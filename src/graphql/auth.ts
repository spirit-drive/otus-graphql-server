import { AccountResponse, Messages, ApolloResolver } from '../types';
import { GraphQLError } from 'graphql/index';

export const withAuth =
  <T, Res = AccountResponse, Args extends Record<string, unknown> = Record<string, unknown>>(
    action: ApolloResolver<T, Res, Args>
  ): ApolloResolver<T, Res, Args> =>
  async (parent, args, context): Promise<Res> => {
    if (!context.user) {
      throw new GraphQLError('User is not authenticated', {
        extensions: {
          code: Messages.JWT_ERROR,
          http: { status: 401 },
        },
      });
    }
    return action(parent, args, context);
  };
