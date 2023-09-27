import { CustomError, ApolloResolver } from '../../../types';
import { UserClient, UserDocument } from '../User';
import { getUserByContext } from '../helpers';
import { DataBaseError } from '../../../Errors';
import { nameIsExist } from './signup';

export const update: ApolloResolver<UserClient> = async (_, data, context) => {
  const { type, value } = await getUserByContext(context);
  if (type === 'error') return value as CustomError;
  const user = value as UserDocument;

  if (data.name && data.name !== user.name) {
    const nameError = await nameIsExist(data.name);
    if (nameError) return nameError;
  }

  Object.assign(user, data);

  try {
    await user.save();
  } catch (e) {
    return new DataBaseError(e);
  }

  return {
    token: context.token,
    user,
  };
};
