/**
 * Mock Database for Local Development
 * This simulates the database without requiring Supabase
 */

import type {
  User,
  Region,
  Property,
  PropertyFeature,
  PropertyImage,
  BuyerProfile,
  BuyerRegionPreference,
  DirectMatch,
} from '@/types/database';
import { PropertyType, ListingStatus, MatchStatus } from '@/types/database';

// ===========================================
// MOCK DATA STORAGE
// ===========================================

export const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'lars@example.dk',
    phone: '+45 12345678',
    mitid_verified: true,
    created_at: new Date('2025-01-01').toISOString(),
    updated_at: new Date('2025-01-01').toISOString(),
  },
  {
    id: 'user-2',
    email: 'marie@example.dk',
    phone: '+45 23456789',
    mitid_verified: true,
    created_at: new Date('2025-01-02').toISOString(),
    updated_at: new Date('2025-01-02').toISOString(),
  },
  {
    id: 'user-3',
    email: 'peter@example.dk',
    phone: '+45 34567890',
    mitid_verified: false,
    created_at: new Date('2025-01-03').toISOString(),
    updated_at: new Date('2025-01-03').toISOString(),
  },
  {
    id: 'user-4',
    email: 'anna@example.dk',
    phone: '+45 45678901',
    mitid_verified: true,
    created_at: new Date('2025-01-04').toISOString(),
    updated_at: new Date('2025-01-04').toISOString(),
  },
  {
    id: 'user-5',
    email: 'mikkel@example.dk',
    phone: '+45 56789012',
    mitid_verified: true,
    created_at: new Date('2025-01-04').toISOString(),
    updated_at: new Date('2025-01-04').toISOString(),
  },
  {
    id: 'user-6',
    email: 'sofie@example.dk',
    phone: '+45 67890123',
    mitid_verified: true,
    created_at: new Date('2025-01-04').toISOString(),
    updated_at: new Date('2025-01-04').toISOString(),
  },
];

export const mockRegions: Region[] = [
  {
    id: 1,
    name: 'København K',
    avg_sqm_price: 55000,
    created_at: new Date('2025-01-01').toISOString(),
  },
  {
    id: 2,
    name: 'Aarhus C',
    avg_sqm_price: 35000,
    created_at: new Date('2025-01-01').toISOString(),
  },
  {
    id: 3,
    name: 'Odense',
    avg_sqm_price: 28000,
    created_at: new Date('2025-01-01').toISOString(),
  },
  {
    id: 4,
    name: 'Nordsjælland',
    avg_sqm_price: 42000,
    created_at: new Date('2025-01-01').toISOString(),
  },
];

export const mockProperties: Property[] = [
  {
    id: 'prop-1',
    owner_id: 'user-1',
    region_id: 1,
    property_type: PropertyType.LEJLIGHED,
    sqm_living: 85,
    rooms: 3,
    build_year: 2015,
    energy_label: 'A',
    asking_price: 4500000,
    min_acceptable_price: 4200000,
    status: ListingStatus.AKTIV,
    is_anonymous: true,
    show_street_view: false,
    address_street: 'Nørrebrogade 42',
    address_city: 'København',
    address_postal_code: '2200',
    created_at: new Date('2025-01-05').toISOString(),
    updated_at: new Date('2025-01-05').toISOString(),
  },
  {
    id: 'prop-2',
    owner_id: 'user-2',
    region_id: 4,
    property_type: PropertyType.VILLA,
    sqm_living: 150,
    sqm_lot: 800,
    rooms: 5,
    build_year: 1985,
    energy_label: 'C',
    asking_price: 6800000,
    min_acceptable_price: 6500000,
    status: ListingStatus.AKTIV,
    is_anonymous: true,
    show_street_view: false,
    address_street: 'Skovvej 15',
    address_city: 'Rungsted',
    address_postal_code: '2960',
    created_at: new Date('2025-01-06').toISOString(),
    updated_at: new Date('2025-01-06').toISOString(),
  },
  {
    id: 'prop-3',
    owner_id: 'user-1',
    region_id: 2,
    property_type: PropertyType.RAEKKEHUS,
    sqm_living: 120,
    sqm_lot: 200,
    rooms: 4,
    build_year: 2005,
    energy_label: 'B',
    asking_price: 3200000,
    min_acceptable_price: 3000000,
    status: ListingStatus.AKTIV,
    is_anonymous: false,
    show_street_view: true,
    address_street: 'Åboulevarden 23',
    address_city: 'Aarhus',
    address_postal_code: '8000',
    created_at: new Date('2025-01-07').toISOString(),
    updated_at: new Date('2025-01-07').toISOString(),
  },
  {
    id: 'prop-4',
    owner_id: 'user-2',
    region_id: 1,
    property_type: PropertyType.LEJLIGHED,
    sqm_living: 105,
    rooms: 4,
    build_year: 2018,
    energy_label: 'A',
    asking_price: 5200000,
    min_acceptable_price: 4900000,
    status: ListingStatus.AKTIV,
    is_anonymous: true,
    show_street_view: false,
    address_street: 'Vesterbrogade 112',
    address_city: 'København',
    address_postal_code: '1620',
    created_at: new Date('2025-01-08').toISOString(),
    updated_at: new Date('2025-01-08').toISOString(),
  },
  {
    id: 'prop-5',
    owner_id: 'user-3',
    region_id: 3,
    property_type: PropertyType.VILLA,
    sqm_living: 180,
    sqm_lot: 650,
    rooms: 6,
    build_year: 1975,
    energy_label: 'D',
    asking_price: 4800000,
    min_acceptable_price: 4500000,
    status: ListingStatus.AKTIV,
    is_anonymous: false,
    show_street_view: true,
    address_street: 'Hunderupvej 45',
    address_city: 'Odense',
    address_postal_code: '5220',
    created_at: new Date('2025-01-09').toISOString(),
    updated_at: new Date('2025-01-09').toISOString(),
  },
  {
    id: 'prop-6',
    owner_id: 'user-1',
    region_id: 2,
    property_type: PropertyType.LEJLIGHED,
    sqm_living: 72,
    rooms: 2,
    build_year: 2020,
    energy_label: 'A',
    asking_price: 2400000,
    min_acceptable_price: 2200000,
    status: ListingStatus.AKTIV,
    is_anonymous: true,
    show_street_view: false,
    address_street: 'Jægergårdsgade 78',
    address_city: 'Aarhus',
    address_postal_code: '8000',
    created_at: new Date('2025-01-10').toISOString(),
    updated_at: new Date('2025-01-10').toISOString(),
  },
  {
    id: 'prop-7',
    owner_id: 'user-3',
    region_id: 4,
    property_type: PropertyType.RAEKKEHUS,
    sqm_living: 135,
    sqm_lot: 300,
    rooms: 5,
    build_year: 1998,
    energy_label: 'C',
    asking_price: 5500000,
    min_acceptable_price: 5200000,
    status: ListingStatus.AKTIV,
    is_anonymous: true,
    show_street_view: false,
    address_street: 'Strandvejen 234',
    address_city: 'Hellerup',
    address_postal_code: '2900',
    created_at: new Date('2025-01-11').toISOString(),
    updated_at: new Date('2025-01-11').toISOString(),
  },
];

export const mockPropertyFeatures: PropertyFeature[] = [
  { property_id: 'prop-1', feature_key: 'balkon', feature_value: 'ja' },
  { property_id: 'prop-1', feature_key: 'altan', feature_value: 'nej' },
  { property_id: 'prop-2', feature_key: 'garage', feature_value: '2_biler' },
  { property_id: 'prop-2', feature_key: 'have', feature_value: 'syd' },
  { property_id: 'prop-3', feature_key: 'garage', feature_value: '1_bil' },
];

export const mockPropertyImages: PropertyImage[] = [
  {
    id: 'img-1',
    property_id: 'prop-1',
    storage_path: '/mock/property-1-living.jpg',
    is_blurred: true,
    room_type: 'stue',
    display_order: 1,
    ai_quality_score: 0.85,
    created_at: new Date('2025-01-05').toISOString(),
  },
  {
    id: 'img-2',
    property_id: 'prop-1',
    storage_path: '/mock/property-1-kitchen.jpg',
    is_blurred: true,
    room_type: 'køkken',
    display_order: 2,
    ai_quality_score: 0.92,
    created_at: new Date('2025-01-05').toISOString(),
  },
];

export const mockBuyerProfiles: BuyerProfile[] = [
  {
    id: 'buyer-1',
    user_id: 'user-3',
    budget_min: 3000000,
    budget_max: 5000000,
    budget_flexibility: 0.15,
    property_types: [PropertyType.LEJLIGHED, PropertyType.RAEKKEHUS],
    sqm_min: 75,
    rooms_min: 3,
    is_active: true,
    has_financing_approved: true,
    created_at: new Date('2025-01-08').toISOString(),
    updated_at: new Date('2025-01-08').toISOString(),
  },
  {
    id: 'buyer-2',
    user_id: 'user-2',
    budget_min: 5000000,
    budget_max: 8000000,
    budget_flexibility: 0.1,
    property_types: [PropertyType.VILLA],
    sqm_min: 140,
    rooms_min: 4,
    is_active: true,
    has_financing_approved: false,
    created_at: new Date('2025-01-09').toISOString(),
    updated_at: new Date('2025-01-09').toISOString(),
  },
  {
    id: 'buyer-3',
    user_id: 'user-4',
    budget_min: 2000000,
    budget_max: 3500000,
    budget_flexibility: 0.2,
    property_types: [PropertyType.LEJLIGHED],
    sqm_min: 60,
    rooms_min: 2,
    is_active: true,
    has_financing_approved: true,
    created_at: new Date('2025-01-10').toISOString(),
    updated_at: new Date('2025-01-10').toISOString(),
  },
  {
    id: 'buyer-4',
    user_id: 'user-5',
    budget_min: 4000000,
    budget_max: 6000000,
    budget_flexibility: 0.12,
    property_types: [PropertyType.VILLA, PropertyType.RAEKKEHUS],
    sqm_min: 120,
    rooms_min: 4,
    is_active: true,
    has_financing_approved: true,
    created_at: new Date('2025-01-10').toISOString(),
    updated_at: new Date('2025-01-10').toISOString(),
  },
  {
    id: 'buyer-5',
    user_id: 'user-6',
    budget_min: 3500000,
    budget_max: 5500000,
    budget_flexibility: 0.18,
    property_types: [PropertyType.LEJLIGHED, PropertyType.RAEKKEHUS],
    sqm_min: 80,
    rooms_min: 3,
    is_active: true,
    has_financing_approved: false,
    created_at: new Date('2025-01-11').toISOString(),
    updated_at: new Date('2025-01-11').toISOString(),
  },
];

export const mockBuyerRegionPreferences: BuyerRegionPreference[] = [
  { buyer_profile_id: 'buyer-1', region_id: 1, priority: 1 },
  { buyer_profile_id: 'buyer-1', region_id: 2, priority: 2 },
  { buyer_profile_id: 'buyer-2', region_id: 4, priority: 1 },
  { buyer_profile_id: 'buyer-3', region_id: 2, priority: 1 },
  { buyer_profile_id: 'buyer-3', region_id: 1, priority: 2 },
  { buyer_profile_id: 'buyer-4', region_id: 4, priority: 1 },
  { buyer_profile_id: 'buyer-4', region_id: 3, priority: 2 },
  { buyer_profile_id: 'buyer-5', region_id: 1, priority: 1 },
  { buyer_profile_id: 'buyer-5', region_id: 4, priority: 2 },
];

export const mockDirectMatches: DirectMatch[] = [
  {
    id: 'match-1',
    property_id: 'prop-1',
    buyer_profile_id: 'buyer-1',
    match_score: 0.92,
    match_factors: {
      price_match: 0.95,
      location_match: 1.0,
      size_match: 0.88,
      feature_match: 0.85,
    },
    status: MatchStatus.PENDING,
    created_at: new Date('2025-01-10').toISOString(),
  },
];

// ===========================================
// HELPER FUNCTIONS
// ===========================================

/**
 * Calculate how many buyers would be interested at a given price point
 */
export function calculateBuyerCount(
  regionId: number,
  propertyType: PropertyType,
  price: number
): number {
  return mockBuyerProfiles.filter((buyer) => {
    // Check if buyer has this region in preferences
    const hasRegion = mockBuyerRegionPreferences.some(
      (pref) => pref.buyer_profile_id === buyer.id && pref.region_id === regionId
    );

    if (!hasRegion) return false;

    // Check property type
    if (!buyer.property_types.includes(propertyType)) return false;

    // Check price with flexibility
    const maxAcceptablePrice = buyer.budget_max * (1 + buyer.budget_flexibility);
    if (price > maxAcceptablePrice) return false;

    // Check if active
    return buyer.is_active;
  }).length;
}

/**
 * Get properties matching a buyer's criteria
 */
export function getMatchingProperties(buyerProfileId: string): Property[] {
  const buyer = mockBuyerProfiles.find((b) => b.id === buyerProfileId);
  if (!buyer) return [];

  const buyerRegions = mockBuyerRegionPreferences
    .filter((pref) => pref.buyer_profile_id === buyerProfileId)
    .map((pref) => pref.region_id);

  return mockProperties.filter((prop) => {
    // Check region
    if (!buyerRegions.includes(prop.region_id)) return false;

    // Check property type
    if (!buyer.property_types.includes(prop.property_type)) return false;

    // Check price
    const maxPrice = buyer.budget_max * (1 + buyer.budget_flexibility);
    if (prop.asking_price > maxPrice) return false;

    // Check size
    if (buyer.sqm_min && prop.sqm_living < buyer.sqm_min) return false;
    if (buyer.sqm_max && prop.sqm_living > buyer.sqm_max) return false;

    // Check rooms
    if (buyer.rooms_min && prop.rooms && prop.rooms < buyer.rooms_min) return false;

    // Check build year
    if (buyer.build_year_min && prop.build_year && prop.build_year < buyer.build_year_min)
      return false;

    // Only active or drawer listings
    return prop.status === ListingStatus.AKTIV || prop.status === ListingStatus.SKUFFE;
  });
}

/**
 * Generate sample data for price slider
 */
export function getPriceSliderData(
  regionId: number,
  propertyType: PropertyType,
  minPrice: number,
  maxPrice: number,
  steps: number = 20
): Array<{ price: number; buyerCount: number }> {
  const stepSize = (maxPrice - minPrice) / steps;
  const data: Array<{ price: number; buyerCount: number }> = [];

  for (let i = 0; i <= steps; i++) {
    const price = minPrice + stepSize * i;
    const buyerCount = calculateBuyerCount(regionId, propertyType, price);
    data.push({ price, buyerCount });
  }

  return data;
}
