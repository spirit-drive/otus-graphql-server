import { ApolloServer } from '@apollo/server';
import { typeDefs } from './typeDefs';
import { resolvers } from './resolvers';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { getParamsFromToken } from '../utils/helpers';
import { AccountJWTParams } from './account';
import { UserDocument, UserModel } from '../models/User';
import express from 'express';
import { ApolloContext } from '../types';
import * as http from 'http';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';

export const AUTHENTICATION_TYPE = 'Bearer';
const regexpForRemoveAuthenticationType = new RegExp(`^${AUTHENTICATION_TYPE}\\s`);
export const getToken = (authentication: string): string =>
  authentication?.replace(regexpForRemoveAuthenticationType, '');

export type ServerContext = {
  user: UserDocument;
  token: string;
};

export const context = async ({ req }: { req: express.Request }): Promise<ApolloContext> => {
  const { authorization } = (req.headers || {}) as { authorization: string; locale: string };
  const token = getToken(authorization);
  if (!token) return { token: null, user: null };
  try {
    const res = await getParamsFromToken<AccountJWTParams>(token);
    const id = res.id;
    const user = (await UserModel.findById(id)) as UserDocument;
    return { token, user };
  } catch (e) {
    return { token: null, user: null };
  }
};

export const options = {
  context,
};

const schema = makeExecutableSchema({ typeDefs, resolvers });

export const createServer = async (httpServer: http.Server) => {
  const server = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  return { server };
};
