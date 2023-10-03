import { ApolloResolver, ErrorCode } from '../../../types';
import { Order, OrderMutationsAddArgs } from '../../../graphql.types';
import { OrderModel } from '../../../models/Order';
import { GraphQLError } from 'graphql';
import { prepareOrder } from '../../../models/helpers/prepareOrder';
import { withAuth } from '../../auth';
import { isExistProducts } from './helpers';

export const addRaw: ApolloResolver<never, Order | Error, OrderMutationsAddArgs> = async (_, args, { user }) => {
  const { products } = args?.input || {};
  if (!products?.length) {
    return new GraphQLError(`productIds is required`, {
      extensions: {
        code: ErrorCode.FIELD_REQUIRED,
        http: { status: 400 },
        fieldName: 'products',
      },
    });
  }
  if (!(await isExistProducts(products.map((i) => i.id)))) {
    return new GraphQLError(`not all products found`, {
      extensions: {
        code: ErrorCode.NOT_FOUND,
        http: { status: 400 },
        fieldName: 'products',
      },
    });
  }
  const entity = new OrderModel({ ...args.input, userId: user._id, commandId: user?.commandId });

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

export const add = withAuth(addRaw);
