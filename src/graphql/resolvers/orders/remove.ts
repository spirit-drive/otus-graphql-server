import { ApolloResolver, ErrorCode } from '../../../types';
import { Order, OrderMutationsRemoveArgs } from '../../../graphql.types';
import { OrderModel } from '../../../models/Order';
import { UserDocument } from '../../../models/User';
import { GraphQLError } from 'graphql/index';
import { prepareOrder } from '../../../models/helpers/prepareOrder';
import { withAuth } from '../../auth';

export const removeRaw: ApolloResolver<never, Order | Error, OrderMutationsRemoveArgs> = async (_, args, { user }) => {
  const { id } = args;
  const { commandId, id: userId } = (user || {}) as UserDocument;
  const entity = await OrderModel.findById(id);

  if (!entity) {
    return new GraphQLError(`Order with id: "${id}" not found`, {
      extensions: {
        code: ErrorCode.NOT_FOUND,
      },
    });
  }

  if (entity.commandId !== commandId) {
    return new GraphQLError(`You can't remove this Order`, {
      extensions: {
        code: ErrorCode.NOT_ALLOWED,
      },
    });
  }
  await entity.deleteOne();

  if (entity.userId !== userId) {
    return new GraphQLError(`The order can only be edited by the creator`, {
      extensions: {
        code: ErrorCode.NOT_ALLOWED,
      },
    });
  }
  return await prepareOrder(entity);
};

export const remove = withAuth(removeRaw);
