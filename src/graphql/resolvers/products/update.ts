import { ApolloResolver, ErrorCode } from '../../../types';
import { Product, ProductMutationsPutArgs } from '../../../graphql.types';
import { ProductModel } from '../../../models/Product';
import { UserDocument } from '../../../models/User';
import { GraphQLError } from 'graphql/index';
import { prepareProduct } from '../../../models/helpers/prepareProduct';
import { updateModel } from '../helpers';

export const update: (patch?: boolean) => ApolloResolver<never, Product | Error, ProductMutationsPutArgs> =
  (patch) =>
  async (_, args, { user }) => {
    const { id, input } = args;
    const { commandId } = (user || {}) as UserDocument;
    const entity = await ProductModel.findById(id);

    if (!entity) {
      return new GraphQLError(`Product with id: "${id}" not found`, {
        extensions: {
          code: ErrorCode.NOT_FOUND,
        },
      });
    }

    if (entity.commandId !== commandId) {
      return new GraphQLError(`You can't edit this Product`, {
        extensions: {
          code: ErrorCode.NOT_ALLOWED,
        },
      });
    }

    updateModel(input, entity, ['name', 'photo', 'desc', 'price', 'oldPrice', 'categoryId'], patch);

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
