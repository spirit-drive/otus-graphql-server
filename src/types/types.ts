import { Profile } from '../graphql.types';
import { UserMain, UserDocument } from '../models/User';

export enum Messages {
  INCORRECT_EMAIL_OR_PASSWORD = 'ERR_INCORRECT_EMAIL_OR_PASSWORD',
  INCORRECT_PASSWORD = 'ERR_INCORRECT_PASSWORD',
  ACCOUNT_ALREADY_EXIST = 'ERR_ACCOUNT_ALREADY_EXIST',
  NOT_ALLOWED = 'ERR_NOT_ALLOWED',
  INVALID_PASSWORD = 'ERR_INVALID_PASSWORD',
  INVALID_RESET_PASSWORD = 'ERR_INVALID_RESET_PASSWORD',
  USER_NOT_FOUND = 'ERR_USER_NOT_FOUND',
  NOT_FOUND = 'ERR_NOT_FOUND',
  ERROR_OF_SENDING_TO_EMAIL = 'ERR_ERROR_OF_SENDING_TO_EMAIL',
  TOKEN_REQUIRED_ERROR = 'ERR_TOKEN_REQUIRED_ERROR',
  SAME_PASSWORDS_ERROR = 'ERR_SAME_PASSWORDS_ERROR',
  JWT_ERROR = 'ERR_JWT_ERROR',
  DATA_BASE_ERROR = 'ERR_DATA_BASE_ERROR',
  DUPLICATE_VALUE_OF_FIELD = 'ERR_DUPLICATE_VALUE_OF_FIELD',
  INVALID_NICKNAME = 'ERR_INVALID_NICKNAME',
}

export type CustomError = Error & { code: Messages };

export type AccountResponseRaw = {
  token: string | null;
  user: UserMain | null;
};

export type AccountResponse = AccountResponseRaw | CustomError;

export type ApolloContext = {
  token: string;
  user: Profile & UserDocument;
};

export type ApolloResolver<T, Res = AccountResponse, Args extends Record<string, unknown> = Record<string, unknown>> = (
  doc: T,
  args: Args,
  context: ApolloContext
) => Promise<Res>;
