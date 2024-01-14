import { RequestHandler } from 'express-serve-static-core';
import { ServerContext } from '../graphql/server';
import { ErrorCode } from '../types';

export const authentication: RequestHandler = async (req, res, next) => {
  const { context } = req as unknown as { context: ServerContext };
  if (!context?.user)
    return res.status(401).json({
      message: 'Token is required',
      extensions: {
        code: ErrorCode.AUTH,
      },
    });

  next();
};
