/**
 * Database Types for Boligbolig Platform
 * Auto-generated from Supabase schema
 */

// ===========================================
// ENUMS
// ===========================================

export enum PropertyType {
  VILLA = 'villa',
  RAEKKEHUS = 'raekkehus',
  LEJLIGHED = 'lejlighed',
  LANDEJENDOM = 'landejendom',
  FRITIDSHUS = 'fritidshus',
  ANDEL = 'andel',
}

export enum ListingStatus {
  DRAFT = 'draft',
  SKUFFE = 'skuffe',
  AKTIV = 'aktiv',
  I_BUDROUND = 'i_budround',
  SOLGT = 'solgt',
  TRUKKET = 'trukket',
}

export enum MatchStatus {
  PENDING = 'pending',
  VIEWED = 'viewed',
  INTERESTED = 'interested',
  REJECTED = 'rejected',
}

export enum RingMatchStatus {
  PROPOSED = 'proposed',
  NEGOTIATING = 'negotiating',
  AGREED = 'agreed',
  FAILED = 'failed',
}

export enum AuctionStatus {
  SCHEDULED = 'scheduled',
  ACTIVE = 'active',
  ENDED = 'ended',
  CANCELLED = 'cancelled',
}

export enum ServiceStatus {
  PENDING = 'pending',
  ORDERED = 'ordered',
  COMPLETED = 'completed',
}

export enum ServiceCategory {
  JURIDISK = 'juridisk',
  TEKNISK = 'teknisk',
  FOTO = 'foto',
}

// ===========================================
// DATABASE TABLES
// ===========================================

export interface User {
  id: string;
  email: string;
  phone?: string;
  mitid_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Region {
  id: number;
  name: string;
  parent_id?: number;
  geometry?: unknown; // PostGIS geometry type
  avg_sqm_price?: number;
  created_at: string;
}

export interface Property {
  id: string;
  owner_id: string;

  // Anonymous data (visible to buyers)
  region_id: number;
  property_type: PropertyType;
  sqm_living: number;
  sqm_lot?: number;
  rooms?: number;
  build_year?: number;
  energy_label?: string;

  // Pricing
  asking_price: number;
  min_acceptable_price?: number;

  // Status & visibility
  status: ListingStatus;
  is_anonymous: boolean;
  show_street_view: boolean;

  // Actual address (only visible after match acceptance)
  address_encrypted?: Buffer;
  address_street?: string;
  address_city?: string;
  address_postal_code?: string;

  // Metadata
  created_at: string;
  updated_at: string;
  expires_at?: string;
}

export interface PropertyFeature {
  property_id: string;
  feature_key: string;
  feature_value?: string;
}

export interface PropertyImage {
  id: string;
  property_id: string;
  storage_path: string;
  is_blurred: boolean;
  room_type?: string;
  display_order: number;
  ai_quality_score?: number;
  created_at: string;
}

export interface BuyerProfile {
  id: string;
  user_id: string;

  // Search criteria
  budget_min?: number;
  budget_max: number;
  budget_flexibility: number; // 0-1

  // Preferences
  property_types: PropertyType[];
  sqm_min?: number;
  sqm_max?: number;
  rooms_min?: number;
  build_year_min?: number;

  // Status
  is_active: boolean;
  has_financing_approved: boolean;

  // Ring matching
  owns_property_id?: string;

  created_at: string;
  updated_at: string;
}

export interface BuyerRegionPreference {
  buyer_profile_id: string;
  region_id: number;
  priority: number;
}

export interface DirectMatch {
  id: string;
  property_id: string;
  buyer_profile_id: string;

  match_score: number; // 0-1
  match_factors?: MatchFactors;

  status: MatchStatus;
  buyer_viewed_at?: string;
  buyer_response?: string;

  created_at: string;
}

export interface MatchFactors {
  price_match: number;
  location_match: number;
  size_match: number;
  feature_match: number;
  [key: string]: number;
}

export interface RingMatch {
  id: string;
  ring_size: number;
  total_value?: number;
  feasibility_score?: number;
  status: RingMatchStatus;
  created_at: string;
  expires_at?: string;
}

export interface RingParticipant {
  ring_id: string;
  position: number;
  user_id: string;
  selling_property_id?: string;
  buying_property_id?: string;
  agreed_sell_price?: number;
  has_accepted: boolean;
}

export interface Service {
  id: number;
  name: string;
  category?: ServiceCategory;
  description?: string;
  base_price?: number;
  provider_name?: string;
  is_active: boolean;
}

export interface PropertyService {
  property_id: string;
  service_id: number;
  status: ServiceStatus;
  ordered_at?: string;
  completed_at?: string;
}

export interface Auction {
  id: string;
  property_id: string;
  start_time: string;
  end_time: string;
  starting_price: number;
  reserve_price?: number;
  current_bid?: number;
  bid_count: number;
  status: AuctionStatus;
  created_at: string;
}

export interface AuctionBid {
  id: string;
  auction_id: string;
  bidder_id: string;
  amount: number;
  placed_at: string;
  is_winning: boolean;
}

// ===========================================
// COMPOSITE TYPES
// ===========================================

export interface PropertyWithDetails extends Property {
  owner: User;
  region: Region;
  features: PropertyFeature[];
  images: PropertyImage[];
}

export interface BuyerProfileWithPreferences extends BuyerProfile {
  user: User;
  region_preferences: Array<BuyerRegionPreference & { region: Region }>;
}

export interface DirectMatchWithDetails extends DirectMatch {
  property: PropertyWithDetails;
  buyer_profile: BuyerProfileWithPreferences;
}

export interface RingMatchWithParticipants extends RingMatch {
  participants: Array<
    RingParticipant & {
      user: User;
      selling_property?: Property;
      buying_property?: Property;
    }
  >;
}

// ===========================================
// API REQUEST/RESPONSE TYPES
// ===========================================

export interface CreatePropertyRequest {
  region_id: number;
  property_type: PropertyType;
  sqm_living: number;
  sqm_lot?: number;
  rooms?: number;
  build_year?: number;
  energy_label?: string;
  asking_price: number;
  min_acceptable_price?: number;
  address_street?: string;
  address_city?: string;
  address_postal_code?: string;
  features?: Record<string, string>;
}

export interface CreateBuyerProfileRequest {
  budget_min?: number;
  budget_max: number;
  budget_flexibility?: number;
  property_types: PropertyType[];
  sqm_min?: number;
  sqm_max?: number;
  rooms_min?: number;
  build_year_min?: number;
  region_ids: number[];
  owns_property_id?: string;
}

export interface PriceSliderData {
  price: number;
  buyer_count: number;
  avg_buyer_budget: number;
  demand_score: number; // 0-1
}

// ===========================================
// HELPER TYPES
// ===========================================

export type PropertyTypeLabel = {
  [K in PropertyType]: string;
};

export const PROPERTY_TYPE_LABELS: PropertyTypeLabel = {
  [PropertyType.VILLA]: 'Villa',
  [PropertyType.RAEKKEHUS]: 'Rækkehus',
  [PropertyType.LEJLIGHED]: 'Lejlighed',
  [PropertyType.LANDEJENDOM]: 'Landejendom',
  [PropertyType.FRITIDSHUS]: 'Fritidshus',
  [PropertyType.ANDEL]: 'Andelsbolig',
};

export type ListingStatusLabel = {
  [K in ListingStatus]: string;
};

export const LISTING_STATUS_LABELS: ListingStatusLabel = {
  [ListingStatus.DRAFT]: 'Kladde',
  [ListingStatus.SKUFFE]: 'Skuffesag',
  [ListingStatus.AKTIV]: 'Aktiv',
  [ListingStatus.I_BUDROUND]: 'I budrunde',
  [ListingStatus.SOLGT]: 'Solgt',
  [ListingStatus.TRUKKET]: 'Trukket tilbage',
};
