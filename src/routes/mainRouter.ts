import { Router } from 'express';
import { authentication } from './auth';
import { uploadRouter } from './uploadRouter';
import { setContext } from './setContext';

export const contextRouter = Router();
contextRouter.use('/upload', authentication, uploadRouter);
export const mainRouter = Router();
mainRouter.use('/', setContext, contextRouter);
