-- ===========================================
-- AI-DREVET EJENDOMSPLATFORM
-- Initial Database Schema
-- ===========================================

-- Enable PostGIS for geographic queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- ===========================================
-- USERS & AUTH
-- ===========================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    mitid_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- GEOGRAFISKE DATA (til anonyme områder)
-- ===========================================

CREATE TABLE regions (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,              -- "Nordsjælland", "Aarhus V"
    parent_id INTEGER REFERENCES regions(id),
    geometry GEOMETRY(POLYGON, 4326), -- PostGIS til geo-queries
    avg_sqm_price INTEGER,           -- Gennemsnitspris pr. m² (til algoritme)
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_regions_geometry ON regions USING GIST(geometry);
CREATE INDEX idx_regions_parent ON regions(parent_id);

-- ===========================================
-- BOLIGER (Anonyme sælgerprofiler)
-- ===========================================

CREATE TYPE property_type AS ENUM (
    'villa', 'raekkehus', 'lejlighed',
    'landejendom', 'fritidshus', 'andel'
);

CREATE TYPE listing_status AS ENUM (
    'draft', 'skuffe', 'aktiv', 'i_budround', 'solgt', 'trukket'
);

CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Anonyme data (synlige for købere)
    region_id INTEGER NOT NULL REFERENCES regions(id),
    property_type property_type NOT NULL,
    sqm_living INTEGER NOT NULL,
    sqm_lot INTEGER,                  -- Grundareal
    rooms INTEGER,
    build_year INTEGER,
    energy_label CHAR(1),

    -- Prisdata
    asking_price BIGINT NOT NULL,     -- Ønsket pris i DKK
    min_acceptable_price BIGINT,      -- Skjult: mindstepris for matching

    -- Status & synlighed
    status listing_status DEFAULT 'draft',
    is_anonymous BOOLEAN DEFAULT TRUE, -- "Skuffesag"
    show_street_view BOOLEAN DEFAULT FALSE,

    -- Faktisk adresse (kun synlig efter match-accept)
    address_encrypted BYTEA,          -- Krypteret med user-key
    address_street TEXT,              -- Til intern brug
    address_city TEXT,
    address_postal_code TEXT,

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,           -- Auto-deaktivering

    CONSTRAINT check_min_price CHECK (min_acceptable_price IS NULL OR min_acceptable_price <= asking_price)
);

-- Indekser til matching
CREATE INDEX idx_properties_matching ON properties(
    region_id, property_type, asking_price, status
) WHERE status IN ('skuffe', 'aktiv');

CREATE INDEX idx_properties_owner ON properties(owner_id);
CREATE INDEX idx_properties_status ON properties(status);

CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- BOLIG-FEATURES (fleksibel struktur)
-- ===========================================

CREATE TABLE property_features (
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    feature_key TEXT NOT NULL,        -- 'garage', 'pool', 'udsigt'
    feature_value TEXT,               -- 'ja', '2_biler', 'hav'
    PRIMARY KEY (property_id, feature_key)
);

-- ===========================================
-- ANONYME BILLEDER
-- ===========================================

CREATE TABLE property_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    storage_path TEXT NOT NULL,       -- Supabase Storage path
    is_blurred BOOLEAN DEFAULT TRUE,  -- AI-blurret version til anonym visning
    room_type TEXT,                   -- 'køkken', 'stue', 'have'
    display_order INTEGER DEFAULT 0,
    ai_quality_score FLOAT,           -- Score fra AI-fotografering guide
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_property_images_property ON property_images(property_id, display_order);

-- ===========================================
-- KØBERPROFILER
-- ===========================================

CREATE TABLE buyer_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Søgekriterier
    budget_min BIGINT,
    budget_max BIGINT NOT NULL,

    -- Fleksibilitet (0-1 score, bruges til fuzzy matching)
    budget_flexibility FLOAT DEFAULT 0.1,  -- Accepterer +10% over budget

    -- Ønsker
    property_types property_type[] NOT NULL,
    sqm_min INTEGER,
    sqm_max INTEGER,
    rooms_min INTEGER,
    build_year_min INTEGER,

    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    has_financing_approved BOOLEAN DEFAULT FALSE,

    -- Ejer køber selv en bolig? (til ring-matching)
    owns_property_id UUID REFERENCES properties(id),

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT check_budget CHECK (budget_min IS NULL OR budget_min <= budget_max),
    CONSTRAINT check_flexibility CHECK (budget_flexibility >= 0 AND budget_flexibility <= 1)
);

CREATE INDEX idx_buyer_profiles_user ON buyer_profiles(user_id);
CREATE INDEX idx_buyer_profiles_active ON buyer_profiles(is_active) WHERE is_active = TRUE;

CREATE TRIGGER update_buyer_profiles_updated_at BEFORE UPDATE ON buyer_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- KØBER REGION-ØNSKER (mange-til-mange)
-- ===========================================

CREATE TABLE buyer_region_preferences (
    buyer_profile_id UUID REFERENCES buyer_profiles(id) ON DELETE CASCADE,
    region_id INTEGER REFERENCES regions(id),
    priority INTEGER DEFAULT 1,       -- 1 = højeste prioritet
    PRIMARY KEY (buyer_profile_id, region_id)
);

CREATE INDEX idx_buyer_region_prefs_region ON buyer_region_preferences(region_id);

-- ===========================================
-- MATCHING ENGINE
-- ===========================================

-- Direkte matches (1:1)
CREATE TABLE direct_matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    buyer_profile_id UUID NOT NULL REFERENCES buyer_profiles(id) ON DELETE CASCADE,

    match_score FLOAT NOT NULL,       -- 0-1, hvor 1 er perfekt match
    match_factors JSONB,              -- Detaljeret breakdown

    -- Status flow
    status TEXT DEFAULT 'pending',    -- pending, viewed, interested, rejected
    buyer_viewed_at TIMESTAMPTZ,
    buyer_response TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(property_id, buyer_profile_id),
    CONSTRAINT check_match_score CHECK (match_score >= 0 AND match_score <= 1)
);

CREATE INDEX idx_direct_matches_property ON direct_matches(property_id);
CREATE INDEX idx_direct_matches_buyer ON direct_matches(buyer_profile_id);
CREATE INDEX idx_direct_matches_status ON direct_matches(status);

-- Ring-matches (cirkulære handler)
CREATE TABLE ring_matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ring_size INTEGER NOT NULL,       -- 2, 3, 4... parter
    total_value BIGINT,               -- Samlet handelsværdi
    feasibility_score FLOAT,          -- Sandsynlighed for succes
    status TEXT DEFAULT 'proposed',   -- proposed, negotiating, agreed, failed
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,

    CONSTRAINT check_ring_size CHECK (ring_size >= 2),
    CONSTRAINT check_feasibility CHECK (feasibility_score IS NULL OR (feasibility_score >= 0 AND feasibility_score <= 1))
);

CREATE INDEX idx_ring_matches_status ON ring_matches(status);

-- Deltagere i ring (ordnet rækkefølge = bytteretning)
CREATE TABLE ring_participants (
    ring_id UUID REFERENCES ring_matches(id) ON DELETE CASCADE,
    position INTEGER NOT NULL,        -- 0, 1, 2... (hvem sælger til hvem)
    user_id UUID NOT NULL REFERENCES users(id),
    selling_property_id UUID REFERENCES properties(id),
    buying_property_id UUID REFERENCES properties(id),
    agreed_sell_price BIGINT,
    has_accepted BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (ring_id, position)
);

CREATE INDEX idx_ring_participants_user ON ring_participants(user_id);

-- ===========================================
-- TILKØBSSERVICES
-- ===========================================

CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT,                    -- 'juridisk', 'teknisk', 'foto'
    description TEXT,
    base_price INTEGER,
    provider_name TEXT,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE property_services (
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    service_id INTEGER REFERENCES services(id),
    status TEXT DEFAULT 'pending',    -- pending, ordered, completed
    ordered_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    PRIMARY KEY (property_id, service_id)
);

CREATE INDEX idx_property_services_property ON property_services(property_id);

-- ===========================================
-- AUKTIONER
-- ===========================================

CREATE TABLE auctions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    starting_price BIGINT NOT NULL,
    reserve_price BIGINT,             -- Skjult mindstepris
    current_bid BIGINT,
    bid_count INTEGER DEFAULT 0,
    status TEXT DEFAULT 'scheduled',  -- scheduled, active, ended, cancelled
    created_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT check_auction_times CHECK (end_time > start_time)
);

CREATE INDEX idx_auctions_property ON auctions(property_id);
CREATE INDEX idx_auctions_status ON auctions(status);

CREATE TABLE auction_bids (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auction_id UUID NOT NULL REFERENCES auctions(id) ON DELETE CASCADE,
    bidder_id UUID NOT NULL REFERENCES users(id),
    amount BIGINT NOT NULL,
    placed_at TIMESTAMPTZ DEFAULT NOW(),
    is_winning BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_auction_bids_auction ON auction_bids(auction_id, placed_at DESC);
CREATE INDEX idx_auction_bids_bidder ON auction_bids(bidder_id);

-- ===========================================
-- HELPER FUNCTIONS
-- ===========================================

-- Real-time køberantal ved given pris
CREATE OR REPLACE FUNCTION get_buyer_count(
    p_region_id INTEGER,
    p_property_type property_type,
    p_price BIGINT
) RETURNS INTEGER AS $$
    SELECT COUNT(DISTINCT bp.id)::INTEGER
    FROM buyer_profiles bp
    JOIN buyer_region_preferences brp ON brp.buyer_profile_id = bp.id
    WHERE brp.region_id = p_region_id
      AND p_property_type = ANY(bp.property_types)
      AND p_price <= bp.budget_max * (1 + bp.budget_flexibility)
      AND bp.is_active = TRUE;
$$ LANGUAGE SQL STABLE;
