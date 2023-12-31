import { ApolloResolver, ErrorCode } from '../../../types';
import { Order, OrderMutationsPutArgs } from '../../../graphql.types';
import { OrderModel } from '../../../models/Order';
import { UserDocument } from '../../../models/User';
import { GraphQLError } from 'graphql/index';
import { prepareOrder } from '../../../models/helpers/prepareOrder';
import { updateModel } from '../helpers';
import { isExistProducts } from './helpers';

export const update: (patch?: boolean) => ApolloResolver<never, Order | Error, OrderMutationsPutArgs> =
  (patch) =>
  async (_, args, { user }) => {
    const { id, input } = args;
    const { commandId, id: userId } = (user || {}) as UserDocument;
    if (input.products && !(await isExistProducts(input.products.map((i) => i.id)))) {
      return new GraphQLError(`not all products found`, {
        extensions: {
          code: ErrorCode.NOT_FOUND,
          http: { status: 404 },
          fieldName: 'products',
        },
      });
    }

    const entity = await OrderModel.findOne({ _id: id, commandId });
    if (!entity) {
      return new GraphQLError(`Order with id: "${id}" not found`, {
        extensions: {
          code: ErrorCode.NOT_FOUND,
          http: { status: 404 },
        },
      });
    }
    if (entity.userId !== userId) {
      return new GraphQLError(`The order can only be edited by the creator`, {
        extensions: {
          code: ErrorCode.NOT_ALLOWED,
          http: { status: 403 },
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
          http: { status: 400 },
        },
      });
    }
    // Если валидация успешна, сохраняем документ
    await entity.save();
    return await prepareOrder(entity);
  };
