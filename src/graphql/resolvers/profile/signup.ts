import { Messages, ApolloResolver } from '../../../types';
import { ProfileMutations, ProfileMutationsSignupArgs } from '../../../graphql.types';
import { UserDocument, UserModel } from '../../../models/User';
import { getTokenByParams } from '../../../utils/helpers';
import { GraphQLError } from 'graphql/index';

export const signup: ApolloResolver<never, ProfileMutations['signup'] | Error, ProfileMutationsSignupArgs> = async (
  _,
  args
) => {
  const { password, nickname } = args;

  let foundUsers;
  try {
    foundUsers = (await UserModel.findOne({ nickname })) as UserDocument;
  } catch (e) {
    return new GraphQLError(e.message, {
      extensions: {
        code: Messages.DATA_BASE_ERROR,
      },
    });
  }
  if (foundUsers) {
    return new GraphQLError(`User with email: ${foundUsers.nickname} already exist`, {
      extensions: {
        code: Messages.ACCOUNT_ALREADY_EXIST,
        http: { code: 400 },
      },
    });
  }
  const user = new UserModel() as UserDocument;
  user.nickname = nickname;
  user.password = await user.generateHash(password);

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
