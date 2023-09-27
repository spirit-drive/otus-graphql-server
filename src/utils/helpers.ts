import * as jwt from 'jsonwebtoken';
import { UserDocument, UserModel } from '../models/User';
import * as config from '../config.json';

export type Params = Record<string, unknown>;

export const getTokenByParams = (params: Params): string =>
  jwt.sign(params, config.jwtsecret, { expiresIn: config.expiresIn });

export const getParamsFromToken = async <T extends Params>(token: string): Promise<T> =>
  (await jwt.verify(token, config.jwtsecret)) as T;

export const getUserByToken = async (token: string): Promise<UserDocument | never> => {
  if (!token) throw new Error('token is required');
  const { email } = await getParamsFromToken(token);
  return UserModel.findOne({ email });
};
