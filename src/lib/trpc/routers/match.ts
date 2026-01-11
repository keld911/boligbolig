import { z } from 'zod';
import { router, publicProcedure } from '../server';
import { mockDirectMatches, mockProperties, mockBuyerProfiles } from '@/lib/db/mock-data';

export const matchRouter = router({
  // Get all matches
  list: publicProcedure.query(() => {
    return mockDirectMatches.map((match) => ({
      ...match,
      property: mockProperties.find((p) => p.id === match.property_id),
      buyer_profile: mockBuyerProfiles.find((b) => b.id === match.buyer_profile_id),
    }));
  }),

  // Get matches for a specific property
  forProperty: publicProcedure.input(z.string()).query(({ input }) => {
    return mockDirectMatches
      .filter((m) => m.property_id === input)
      .map((match) => ({
        ...match,
        buyer_profile: mockBuyerProfiles.find((b) => b.id === match.buyer_profile_id),
      }));
  }),

  // Get matches for a specific buyer
  forBuyer: publicProcedure.input(z.string()).query(({ input }) => {
    return mockDirectMatches
      .filter((m) => m.buyer_profile_id === input)
      .map((match) => ({
        ...match,
        property: mockProperties.find((p) => p.id === match.property_id),
      }));
  }),
});
