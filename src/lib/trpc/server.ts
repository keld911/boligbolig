import { initTRPC } from '@trpc/server';
import { cache } from 'react';

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.create();

/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = t.router;
export const publicProcedure = t.procedure;
export const createCallerFactory = t.createCallerFactory;

/**
 * This is a workaround for the Next.js App Router
 * to ensure that we only create one instance of the tRPC caller
 */
export const createContext = cache(async () => {
  return {};
});
