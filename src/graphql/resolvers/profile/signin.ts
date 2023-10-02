import { AccountResponse, Messages, ApolloResolver } from '../../../types';
import { UserDocument, UserModel } from '../../../models/User';
import { ProfileMutations, ProfileMutationsSigninArgs } from '../../../graphql.types';
import { getTokenByParams } from '../../../utils/helpers';
import { GraphQLError } from 'graphql/index';

export const signin: ApolloResolver<never, ProfileMutations['signin'] | Error, ProfileMutationsSigninArgs> = async (
  _,
  args
) => {
  const { password, email } = args;
  let user: UserDocument;
  try {
    user = (await UserModel.findOne({ email })) as UserDocument;
  } catch (e) {
    return new GraphQLError(e.message, {
      extensions: {
        code: Messages.DATA_BASE_ERROR,
      },
    });
  }
  if (!user || !user.isRightPassword(password)) {
    return new GraphQLError('User not found or invalid password', {
      extensions: {
        code: Messages.INCORRECT_EMAIL_OR_PASSWORD,
        http: { status: 400 },
      },
    });
  }

  const token = getTokenByParams({ id: user._id });
  const result: AccountResponse = {
    token,
    user,
  };
  return result;
};
