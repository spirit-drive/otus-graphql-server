import { ApolloResolver, ErrorCode } from '../../../types';
import { Product, ProductMutationsAddArgs } from '../../../graphql.types';
import { ProductModel } from '../../../models/Product';
import { UserDocument } from '../../../models/User';
import { GraphQLError } from 'graphql';
import { prepareProduct } from '../../../models/helpers/prepareProduct';
import { withAuth } from '../../auth';
import { CategoryModel } from '../../../models/Category';
import { Types } from 'mongoose';

const { ObjectId } = Types;

export const addRaw: ApolloResolver<never, Product | Error, ProductMutationsAddArgs> = async (_, args, { user }) => {
  if (!ObjectId.isValid(args?.input?.categoryId)) {
    return new GraphQLError(`category id "${args?.input?.categoryId}" is not valid`, {
      extensions: {
        code: ErrorCode.NOT_VALID_ID,
        fieldName: 'categoryId',
      },
    });
  }

  if (!(await CategoryModel.findById(args?.input?.categoryId))) {
    return new GraphQLError(`category not found`, {
      extensions: {
        code: ErrorCode.NOT_FOUND,
        fieldName: 'categoryId',
      },
    });
  }

  const entity = new ProductModel({ ...args.input, commandId: (user as UserDocument)?.commandId });

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
  return await prepareProduct(entity);
};

export const add = withAuth(addRaw);
