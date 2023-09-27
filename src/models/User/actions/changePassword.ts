import { CustomError, ApolloResolver } from '../../../types';
import { getTokenByParams } from '../../../utils/helpers';
import { DataBaseError, InvalidPasswordError, SamePasswordsError } from '../../../Errors';
import { getUserByContext, isValidPassword } from '../helpers';
import { UserDocument } from '../User';

export const changePassword: ApolloResolver<{ password: string; newPassword: string }> = async (
  _,
  { password, newPassword },
  context
) => {
  const { type, value } = await getUserByContext(context);
  if (type === 'error') return value as CustomError;
  const user = value as UserDocument;

  if (!isValidPassword(newPassword)) {
    return new InvalidPasswordError(`${newPassword} is not valid password`);
  }
  if (password === newPassword) {
    return new SamePasswordsError(`the new password must be different from the old one`);
  }
  if (!user.isRightPassword(password)) {
    return new InvalidPasswordError(`${newPassword} is not right password`);
  }
  user.password = await user.generateHash(newPassword);
  try {
    await user.save();
  } catch (e) {
    return new DataBaseError(e);
  }

  return {
    token: getTokenByParams({ id: user._id }),
    user,
  };
};
