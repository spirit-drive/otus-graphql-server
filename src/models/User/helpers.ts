import * as bcrypt from 'bcrypt';
import { ApolloContext } from '../../types';
import { UserDocument } from './User';
import { getUserByToken } from '../../utils/helpers';

export const generateHash = async (string: string): Promise<string> => await bcrypt.hash(string, bcrypt.genSaltSync(8));

export const isValidCode = (string: string, encrypted: string): boolean => bcrypt.compareSync(string, encrypted);

export const emailRegexp =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const isValidEmail = (email: string): boolean => emailRegexp.test(email);
export const isValidNickname = (name: string): boolean => /^[_a-zа-я0-9]{7,}$/i.test(name);
export const isValidPassword = (password: string): boolean => /^[\w-@{}()#$%^&*+=!~]{8,}$/.test(password);

export const RESET_PASSWORD_EXPIRES = 1000 * 60 * 60;

export const generateRandomString = (): string => Math.random().toString(16);
export const getDeadline = (): number => Date.now() + RESET_PASSWORD_EXPIRES;
export const getUserByContext = async (
  context: ApolloContext
): Promise<{ type: 'error'; value: Error } | { type: 'user'; value: UserDocument }> => {
  const { token } = context || {};
  let user;
  try {
    user = await getUserByToken(token);
  } catch (value) {
    return { type: 'error', value };
  }
  if (!user) {
    return { type: 'error', value: new Error(`user is not found by a token`) };
  }
  return { type: 'user', value: user };
};
