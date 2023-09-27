import { ApolloResolver } from '../../../types';
import { UserDocument, UserModel } from '../User';
import { AccountAlreadyExistError, ApolloError, DataBaseError, InvalidPasswordError } from '../../../Errors';
import { getTokenByParams } from '../../../utils/helpers';
import { isValidPassword } from '../helpers';

export const emailIsExist = async (email: string): Promise<null | ApolloError> => {
  let foundUsers;
  try {
    foundUsers = (await UserModel.findOne({ email })) as UserDocument;
  } catch (e) {
    return new DataBaseError(e);
  }
  if (foundUsers) {
    return new AccountAlreadyExistError(`User with email "${foundUsers.email}" already exist`);
  }
};

export const nameIsExist = async (name: string): Promise<null | ApolloError> => {
  let foundUsers;
  try {
    foundUsers = (await UserModel.findOne({ name })) as UserDocument;
  } catch (e) {
    return new DataBaseError(e);
  }
  if (foundUsers) {
    return new AccountAlreadyExistError(`User with name "${foundUsers.name}" already exist`);
  }
};

export const signup: ApolloResolver<{ password: string; email: string; name: string }> = async (
  _,
  { password, email, name }
) => {
  const emailError = await emailIsExist(email);
  if (emailError) return emailError;

  const nameError = await nameIsExist(name);
  if (nameError) return nameError;

  if (!isValidPassword(password)) {
    return new InvalidPasswordError(`password "${password}" is not valid`);
  }

  const user = new UserModel() as UserDocument;
  user.name = name;
  user.email = email;
  user.password = await user.generateHash(password);

  try {
    await user.save();
  } catch (e) {
    return new DataBaseError(e);
  }

  const token = getTokenByParams({ id: user._id });
  return {
    token,
    user,
  };
};
