import { ResponsePagination, Profile, Sorting } from '../graphql.types';
import { UserMain, UserDocument } from '../models/User';

export enum ErrorCode {
  INCORRECT_EMAIL_OR_PASSWORD = 'INCORRECT_EMAIL_OR_PASSWORD',
  DUPLICATES = 'DUPLICATES',
  NOT_FOUND = 'NOT_FOUND',
  NOT_VALID_ID = 'NOT_VALID_ID',
  FIELD_REQUIRED = 'FIELD_REQUIRED',
  INCORRECT_PASSWORD = 'INCORRECT_PASSWORD',
  ACCOUNT_ALREADY_EXIST = 'ACCOUNT_ALREADY_EXIST',
  INVALID_PASSWORD = 'INVALID_PASSWORD',
  AUTH = 'AUTH',
  NO_FILES = 'NO_FILES',
  NOT_ALLOWED = 'NOT_ALLOWED',
  VALIDATION = 'VALIDATION',
}

export type CustomError = Error & { code: ErrorCode };

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

export type ResponseManyResult<T> = {
  data: T;
  sorting: Sorting;
  pagination: Omit<ResponsePagination, '__typename'>;
};
