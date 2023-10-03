import { ApolloResolver, Messages } from '../../../types';
import { Operation, OperationMutationsAddArgs } from '../../../graphql.types';
import { OperationModel } from '../../../models/Operation';
import { UserDocument } from '../../../models/User';
import { GraphQLError } from 'graphql';
import { prepareOperation } from '../../../models/helpers/prepareOperation';
import { withAuth } from '../../auth';

export const addRaw: ApolloResolver<never, Operation | Error, OperationMutationsAddArgs> = async (
  _,
  args,
  { user }
) => {
  const entity = new OperationModel({ ...args.input, commandId: (user as UserDocument)?.commandId });

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
  return await prepareOperation(entity);
};

export const add = withAuth(addRaw);
