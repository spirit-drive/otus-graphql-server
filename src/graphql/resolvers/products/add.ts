import { ApolloResolver, ErrorCode } from '../../../types';
import { Product, ProductMutationsAddArgs } from '../../../graphql.types';
import { ProductModel } from '../../../models/Product';
import { UserDocument } from '../../../models/User';
import { GraphQLError } from 'graphql';
import { prepareProduct } from '../../../models/helpers/prepareProduct';
import { withAuth } from '../../auth';

export const addRaw: ApolloResolver<never, Product | Error, ProductMutationsAddArgs> = async (_, args, { user }) => {
  const entity = new ProductModel({ ...args.input, commandId: (user as UserDocument)?.commandId });

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
  return await prepareProduct(entity);
};

export const add = withAuth(addRaw);
