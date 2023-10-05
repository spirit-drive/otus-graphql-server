import { ApolloResolver, ErrorCode } from '../../../types';
import { Operation, OperationMutationsPutArgs, OperationUpdateInput } from '../../../graphql.types';
import { OperationModel } from '../../../models/Operation';
import { UserDocument } from '../../../models/User';
import { GraphQLError } from 'graphql/index';
import { prepareOperation } from '../../../models/helpers/prepareOperation';
import { updateModel } from '../helpers';

export const update: (patch?: boolean) => ApolloResolver<never, Operation | Error, OperationMutationsPutArgs> =
  (patch) =>
  async (_, args, { user }) => {
    const { id, input } = args;
    const { commandId } = (user || {}) as UserDocument;
    const entity = await OperationModel.findOne({ _id: id, commandId });
    if (!entity) {
      return new GraphQLError(`Operation with id: "${id}" not found`, {
        extensions: {
          code: ErrorCode.NOT_FOUND,
          http: { status: 404 },
        },
      });
    }
    updateModel(
      input as Omit<OperationUpdateInput, 'type'> & { type: string },
      entity,
      ['name', 'categoryId', 'type', 'date', 'amount', 'desc'],
      patch
    );

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
    return await prepareOperation(entity);
  };
