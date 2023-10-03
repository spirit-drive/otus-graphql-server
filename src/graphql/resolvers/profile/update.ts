import { ErrorCode, ApolloResolver } from '../../../types';
import { ProfileMutations, ProfileMutationsUpdateArgs } from '../../../graphql.types';
import { prepareProfile } from '../../../models/helpers/prepareProfile';
import { GraphQLError } from 'graphql/index';
import { withAuth } from '../../auth';

export const updateRaw: ApolloResolver<
  never,
  ProfileMutations['update'] | GraphQLError | Error,
  ProfileMutationsUpdateArgs
> = async (_, { input }, { user }) => {
  try {
    const { name } = input;
    user.name = name;

    // Выполняем валидацию перед сохранением
    const validationError = user.validateSync();
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
    await user.save();
    return prepareProfile(user);
  } catch (e) {
    if (e.message?.match(/{\s(\w+):\s"(\w+)"\s}/)) {
      return new GraphQLError(e.message, {
        extensions: {
          code: ErrorCode.DUPLICATES,
          http: { status: 400 },
        },
      });
    }
    return e;
  }
};

export const update = withAuth(updateRaw);
