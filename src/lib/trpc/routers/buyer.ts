import { z } from 'zod';
import { router, publicProcedure } from '../server';
import {
  mockBuyerProfiles,
  mockBuyerRegionPreferences,
  mockUsers,
  getMatchingProperties,
} from '@/lib/db/mock-data';
import { PropertyType } from '@/types/database';

export const buyerRouter = router({
  // Get all buyer profiles
  list: publicProcedure.query(() => {
    return mockBuyerProfiles.map((buyer) => ({
      ...buyer,
      user: mockUsers.find((u) => u.id === buyer.user_id),
      region_preferences: mockBuyerRegionPreferences.filter(
        (pref) => pref.buyer_profile_id === buyer.id
      ),
    }));
  }),

  // Get single buyer profile
  byId: publicProcedure.input(z.string()).query(({ input }) => {
    const buyer = mockBuyerProfiles.find((b) => b.id === input);
    if (!buyer) return null;

    return {
      ...buyer,
      user: mockUsers.find((u) => u.id === buyer.user_id),
      region_preferences: mockBuyerRegionPreferences.filter(
        (pref) => pref.buyer_profile_id === buyer.id
      ),
    };
  }),

  // Get matching properties for a buyer
  getMatches: publicProcedure.input(z.string()).query(({ input }) => {
    return getMatchingProperties(input);
  }),

  // Create new buyer profile
  create: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        budgetMin: z.number().optional(),
        budgetMax: z.number(),
        budgetFlexibility: z.number().min(0).max(1).optional(),
        propertyTypes: z.array(z.nativeEnum(PropertyType)),
        sqmMin: z.number().optional(),
        sqmMax: z.number().optional(),
        roomsMin: z.number().optional(),
        buildYearMin: z.number().optional(),
        regionIds: z.array(z.number()),
      })
    )
    .mutation(({ input }) => {
      const newBuyerProfile = {
        id: `buyer-${Date.now()}`,
        user_id: input.userId,
        budget_min: input.budgetMin,
        budget_max: input.budgetMax,
        budget_flexibility: input.budgetFlexibility ?? 0.1,
        property_types: input.propertyTypes,
        sqm_min: input.sqmMin,
        sqm_max: input.sqmMax,
        rooms_min: input.roomsMin,
        build_year_min: input.buildYearMin,
        is_active: true,
        has_financing_approved: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      mockBuyerProfiles.push(newBuyerProfile);

      // Add region preferences
      input.regionIds.forEach((regionId, index) => {
        mockBuyerRegionPreferences.push({
          buyer_profile_id: newBuyerProfile.id,
          region_id: regionId,
          priority: index + 1,
        });
      });

      return newBuyerProfile;
    }),
});
