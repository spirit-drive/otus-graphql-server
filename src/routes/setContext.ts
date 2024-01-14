import { RequestHandler } from 'express-serve-static-core';
import { context, ServerContext } from '../graphql/server';

export const setContext: RequestHandler = async (req, res, next) => {
  (req as unknown as { context: ServerContext }).context = await context({ req });
  next();
};
