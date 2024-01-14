import { AccountResponse, ErrorCode, ApolloResolver } from '../types';
import { GraphQLError } from 'graphql/index';

export const withAuth =
  <T, Res = AccountResponse, Args extends Record<string, unknown> = Record<string, unknown>>(
    action: ApolloResolver<T, Res, Args>
  ): ApolloResolver<T, Res, Args> =>
  async (parent, args, context): Promise<Res> => {
    if (!context.user) {
      throw new GraphQLError('User is not authenticated', {
        extensions: {
          code: ErrorCode.AUTH,
        },
      });
    }
    return action(parent, args, context);
  };
