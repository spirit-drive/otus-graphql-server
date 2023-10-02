import { Messages, ApolloResolver } from '../../../types';
import { ProfileMutations, ProfileMutationsSignupArgs } from '../../../graphql.types';
import { UserDocument, UserModel } from '../../../models/User';
import { getTokenByParams } from '../../../utils/helpers';
import { GraphQLError } from 'graphql/index';

export const signup: ApolloResolver<never, ProfileMutations['signup'] | Error, ProfileMutationsSignupArgs> = async (
  _,
  args
) => {
  const { password, email, commandId } = args;

  let foundUsers;
  try {
    foundUsers = (await UserModel.findOne({ email })) as UserDocument;
  } catch (e) {
    return new GraphQLError(e.message, {
      extensions: {
        code: Messages.DATA_BASE_ERROR,
      },
    });
  }
  if (foundUsers) {
    return new GraphQLError(`User with email: ${foundUsers.email} already exist`, {
      extensions: {
        code: Messages.ACCOUNT_ALREADY_EXIST,
        http: { status: 400 },
      },
    });
  }
  const user = new UserModel() as UserDocument;
  user.email = email;
  user.commandId = commandId;
  user.password = await user.generateHash(password);

  const validationError = user.validateSync();
  if (validationError) {
    // Если есть ошибки валидации, отправляем ValidationError
    return new GraphQLError(validationError.message, {
      extensions: {
        code: Messages.INVALID_NICKNAME,
        http: { status: 400 },
      },
    });
  }

  try {
    await user.save();
  } catch (e) {
    return new GraphQLError(e.message, {
      extensions: {
        code: Messages.DATA_BASE_ERROR,
      },
    });
  }

  const token = getTokenByParams({ id: user._id });
  return {
    token,
    user,
  };
};
