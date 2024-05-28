import { ApolloResolver, ErrorCode } from '../../../types';
import { Order, OrderMutationsPutArgs } from '../../../graphql.types';
import { OrderModel } from '../../../models/Order';
import { UserDocument } from '../../../models/User';
import { GraphQLError } from 'graphql/index';
import { prepareOrder } from '../../../models/helpers/prepareOrder';
import { updateModel } from '../helpers';
import { isExistProducts } from './helpers';
import { Types } from 'mongoose';

const { ObjectId } = Types;
export const update: (patch?: boolean) => ApolloResolver<never, Order | Error, OrderMutationsPutArgs> =
  (patch) =>
  async (_, args, { user }) => {
    const { id, input } = args;
    const { commandId, id: userId } = (user || {}) as UserDocument;
    if (input.products?.some((i) => !ObjectId.isValid(i.id))) {
      return new GraphQLError(`not all product ids are valid`, {
        extensions: {
          code: ErrorCode.NOT_VALID_ID,
          fieldName: 'products',
        },
      });
    }
    if (input.products && !(await isExistProducts(input.products.map((i) => i.id)))) {
      return new GraphQLError(`not all products found`, {
        extensions: {
          code: ErrorCode.NOT_FOUND,
          fieldName: 'products',
        },
      });
    }

    const entity = await OrderModel.findById(id);
    if (!entity) {
      return new GraphQLError(`Order with id: "${id}" not found`, {
        extensions: {
          code: ErrorCode.NOT_FOUND,
        },
      });
    }

    if (entity.commandId !== commandId) {
      return new GraphQLError(`You can't edit this Order`, {
        extensions: {
          code: ErrorCode.NOT_ALLOWED,
        },
      });
    }

    if (entity.userId !== userId) {
      return new GraphQLError(`The order can only be edited by the creator`, {
        extensions: {
          code: ErrorCode.NOT_ALLOWED,
        },
      });
    }

    updateModel(input, entity, ['products', 'status'], patch);

    // Выполняем валидацию перед сохранением
    const validationError = entity.validateSync();
    if (validationError) {
      // Если есть ошибки валидации, отправляем ValidationError
      return new GraphQLError(validationError.message, {
        extensions: {
          code: ErrorCode.VALIDATION,
        },
      });
    }
    // Если валидация успешна, сохраняем документ
    await entity.save();
    return await prepareOrder(entity);
  };
