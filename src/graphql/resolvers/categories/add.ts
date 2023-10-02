import { ApolloResolver, Messages } from '../../../types';
import { Category, CategoryMutationsAddArgs } from '../../../graphql.types';
import { CategoryModel } from '../../../models/Category';
import { UserDocument } from '../../../models/User';
import { GraphQLError } from 'graphql';
import { prepareCategory } from '../../../models/helpers/prepareCategory';
import { withAuth } from '../../auth';

export const addRaw: ApolloResolver<never, Category | Error, CategoryMutationsAddArgs> = async (_, args, { user }) => {
  const entity = new CategoryModel({ ...args.input, commandId: (user as UserDocument)?.commandId });

  // Выполняем валидацию перед сохранением
  const validationError = entity.validateSync();
  if (validationError) {
    // Если есть ошибки валидации, отправляем ValidationError
    return new GraphQLError(validationError.message, {
      extensions: {
        code: Messages.VALIDATION,
        http: { status: 400 },
      },
    });
  }
  // Если валидация успешна, сохраняем документ
  await entity.save();
  return await prepareCategory(entity);
};

export const add = withAuth(addRaw);
