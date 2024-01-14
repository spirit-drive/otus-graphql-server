import { AccountResponse, ErrorCode, ApolloResolver } from '../../../types';
import { UserDocument, UserModel } from '../../../models/User';
import { ProfileMutations, ProfileMutationsSigninArgs } from '../../../graphql.types';
import { getTokenByParams } from '../../../utils/helpers';
import { GraphQLError } from 'graphql/index';

export const signin: ApolloResolver<never, ProfileMutations['signin'] | Error, ProfileMutationsSigninArgs> = async (
  _,
  args
) => {
  const { password, email } = args;
  const user = (await UserModel.findOne({ email })) as UserDocument;
  if (!user || !user.isRightPassword(password)) {
    return new GraphQLError('User not found or invalid password', {
      extensions: {
        code: ErrorCode.INCORRECT_EMAIL_OR_PASSWORD,
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
