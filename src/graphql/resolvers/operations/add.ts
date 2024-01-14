import { ApolloResolver, ErrorCode } from '../../../types';
import { Operation, OperationMutationsAddArgs } from '../../../graphql.types';
import { OperationModel } from '../../../models/Operation';
import { UserDocument } from '../../../models/User';
import { GraphQLError } from 'graphql';
import { prepareOperation } from '../../../models/helpers/prepareOperation';
import { withAuth } from '../../auth';
import { CategoryModel } from '../../../models/Category';
import { Types } from 'mongoose';

const { ObjectId } = Types;

export const addRaw: ApolloResolver<never, Operation | Error, OperationMutationsAddArgs> = async (
  _,
  args,
  { user }
) => {
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

  const entity = new OperationModel({ ...args.input, commandId: (user as UserDocument)?.commandId });

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
  return await prepareOperation(entity);
};

export const add = withAuth(addRaw);
