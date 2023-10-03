import { ErrorCode, ApolloResolver } from '../../../types';
import { ProfileMutations, ProfileMutationsSignupArgs } from '../../../graphql.types';
import { UserDocument, UserModel } from '../../../models/User';
import { getTokenByParams } from '../../../utils/helpers';
import { GraphQLError } from 'graphql/index';

export const signup: ApolloResolver<never, ProfileMutations['signup'] | Error, ProfileMutationsSignupArgs> = async (
  _,
  args
) => {
  const { password, email, commandId } = args;

  const foundUsers = (await UserModel.findOne({ email })) as UserDocument;
  if (foundUsers) {
    return new GraphQLError(`User with email: ${foundUsers.email} already exist`, {
      extensions: {
        code: ErrorCode.ACCOUNT_ALREADY_EXIST,
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
        code: ErrorCode.VALIDATION,
        http: { status: 400 },
      },
    });
  }

  await user.save();

  const token = getTokenByParams({ id: user._id });
  return {
    token,
    user,
  };
};
