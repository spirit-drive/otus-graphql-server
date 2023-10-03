import { ApolloResolver, ErrorCode } from '../../../types';
import { Order, OrderQueriesGetOneArgs } from '../../../graphql.types';
import { OrderModel } from '../../../models/Order';
import { UserDocument } from '../../../models/User';
import { GraphQLError } from 'graphql/index';
import { prepareOrder } from '../../../models/helpers/prepareOrder';

export const getOne: ApolloResolver<never, Order | Error, OrderQueriesGetOneArgs> = async (_, args, { user }) => {
  const { commandId } = (user || {}) as UserDocument;
  const { id } = args;
  const query = OrderModel.findOne({ _id: id });
  if (commandId) {
    query.where('commandId', commandId);
  }
  const entity = await query;

  if (!entity) {
    return new GraphQLError(`Order with id: "${id}" not found`, {
      extensions: { code: ErrorCode.NOT_FOUND, http: { status: 404 } },
    });
  }
  return await prepareOrder(entity);
};
