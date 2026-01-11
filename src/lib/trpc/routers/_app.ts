import { router } from '../server';
import { propertyRouter } from './property';
import { buyerRouter } from './buyer';
import { matchRouter } from './match';

export const appRouter = router({
  property: propertyRouter,
  buyer: buyerRouter,
  match: matchRouter,
});

export type AppRouter = typeof appRouter;
