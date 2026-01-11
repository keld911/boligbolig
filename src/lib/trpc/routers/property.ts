import { z } from 'zod';
import { router, publicProcedure } from '../server';
import {
  mockProperties,
  mockRegions,
  mockPropertyFeatures,
  mockPropertyImages,
  calculateBuyerCount,
  getPriceSliderData,
} from '@/lib/db/mock-data';
import { PropertyType, ListingStatus } from '@/types/database';

export const propertyRouter = router({
  // Get all properties
  list: publicProcedure
    .input(
      z
        .object({
          status: z.enum(['draft', 'skuffe', 'aktiv', 'i_budround', 'solgt', 'trukket']).optional(),
          regionId: z.number().optional(),
          propertyType: z.nativeEnum(PropertyType).optional(),
        })
        .optional()
    )
    .query(({ input }) => {
      let properties = [...mockProperties];

      if (input?.status) {
        properties = properties.filter((p) => p.status === input.status);
      }

      if (input?.regionId) {
        properties = properties.filter((p) => p.region_id === input.regionId);
      }

      if (input?.propertyType) {
        properties = properties.filter((p) => p.property_type === input.propertyType);
      }

      return properties.map((property) => ({
        ...property,
        region: mockRegions.find((r) => r.id === property.region_id),
        features: mockPropertyFeatures.filter((f) => f.property_id === property.id),
        images: mockPropertyImages.filter((i) => i.property_id === property.id),
      }));
    }),

  // Get single property
  byId: publicProcedure.input(z.string()).query(({ input }) => {
    const property = mockProperties.find((p) => p.id === input);
    if (!property) return null;

    return {
      ...property,
      region: mockRegions.find((r) => r.id === property.region_id),
      features: mockPropertyFeatures.filter((f) => f.property_id === property.id),
      images: mockPropertyImages.filter((i) => i.property_id === property.id),
    };
  }),

  // Get buyer count for a property at a specific price
  getBuyerCount: publicProcedure
    .input(
      z.object({
        regionId: z.number(),
        propertyType: z.nativeEnum(PropertyType),
        price: z.number(),
      })
    )
    .query(({ input }) => {
      const count = calculateBuyerCount(input.regionId, input.propertyType, input.price);
      return { count };
    }),

  // Get price slider data
  getPriceSliderData: publicProcedure
    .input(
      z.object({
        regionId: z.number(),
        propertyType: z.nativeEnum(PropertyType),
        minPrice: z.number(),
        maxPrice: z.number(),
        steps: z.number().optional(),
      })
    )
    .query(({ input }) => {
      return getPriceSliderData(
        input.regionId,
        input.propertyType,
        input.minPrice,
        input.maxPrice,
        input.steps
      );
    }),

  // Create new property
  create: publicProcedure
    .input(
      z.object({
        ownerId: z.string(),
        regionId: z.number(),
        propertyType: z.nativeEnum(PropertyType),
        sqmLiving: z.number(),
        sqmLot: z.number().optional(),
        rooms: z.number().optional(),
        buildYear: z.number().optional(),
        energyLabel: z.string().max(1).optional(),
        askingPrice: z.number(),
        minAcceptablePrice: z.number().optional(),
        addressStreet: z.string().optional(),
        addressCity: z.string().optional(),
        addressPostalCode: z.string().optional(),
      })
    )
    .mutation(({ input }) => {
      const newProperty = {
        id: `prop-${Date.now()}`,
        owner_id: input.ownerId,
        region_id: input.regionId,
        property_type: input.propertyType,
        sqm_living: input.sqmLiving,
        sqm_lot: input.sqmLot,
        rooms: input.rooms,
        build_year: input.buildYear,
        energy_label: input.energyLabel,
        asking_price: input.askingPrice,
        min_acceptable_price: input.minAcceptablePrice,
        status: ListingStatus.DRAFT,
        is_anonymous: true,
        show_street_view: false,
        address_street: input.addressStreet,
        address_city: input.addressCity,
        address_postal_code: input.addressPostalCode,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      mockProperties.push(newProperty);
      return newProperty;
    }),

  // Get all regions
  regions: publicProcedure.query(() => {
    return mockRegions;
  }),
});
