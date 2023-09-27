import { AccountResponseRaw, CustomError, ApolloResolver } from '../../../types';
import { getTokenByParams } from '../../../utils/helpers';
import { DataBaseError, InvalidPasswordError, InvalidResetPasswordError } from '../../../Errors';
import {
  generateHash,
  generateRandomString,
  getDeadline,
  getUserByContext,
  isValidCode,
  isValidPassword,
} from '../helpers';
import { UserDocument } from '../User';

export const getCode: ApolloResolver<never, { code: string } & AccountResponseRaw> = async (_, __, context) => {
  const { type, value } = await getUserByContext(context);
  if (type === 'error') return value as CustomError;
  const user = value as UserDocument;

  const code = generateRandomString();
  user.resetPassword = {
    code: await generateHash(code),
    deadline: getDeadline(),
  };

  try {
    await user.save();
  } catch (e) {
    return new DataBaseError(e);
  }

  return { code, token: context.token, user } as any;
};

export const resetPassword: ApolloResolver<{ code: string; newPassword: string }> = async (
  _,
  { code, newPassword },
  context
) => {
  const { type, value } = await getUserByContext(context);
  if (type === 'error') return value as CustomError;
  const user = value as UserDocument;

  if (!isValidPassword(newPassword)) {
    return new InvalidPasswordError(`"${newPassword}" is not valid password`);
  }

  if (!user.resetPassword?.code || !isValidCode(code, user.resetPassword.code)) {
    return new InvalidResetPasswordError(`"${code}" is not valid code`);
  }

  if (!user.resetPassword?.deadline || user.resetPassword.deadline < Date.now()) {
    return new InvalidResetPasswordError(`resetPassword is expired`);
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
