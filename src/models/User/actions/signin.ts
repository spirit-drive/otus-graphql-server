import { AccountResponse, ApolloResolver } from '../../../types';
import { UserDocument, UserModel } from '../User';
import { IncorrectPasswordOrEmailError } from '../../../Errors';
import { getTokenByParams } from '../../../utils/helpers';

export const signin: ApolloResolver<{ password: string; email: string }> = async (_, args) => {
  const { password, email } = args;
  let user: UserDocument;
  try {
    user = (await UserModel.findOne({ email })) as UserDocument;
  } catch (e) {
    return new IncorrectPasswordOrEmailError(e);
  }
  if (!user || !user.isRightPassword(password)) {
    return new IncorrectPasswordOrEmailError('User not found or invalid password');
  }

  const token = getTokenByParams({ id: user._id });
  const result: AccountResponse = {
    token,
    user,
  };
  return result;
};
