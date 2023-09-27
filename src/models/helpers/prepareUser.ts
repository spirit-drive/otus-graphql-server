import { UserDocument } from '../User';
import { User } from '../../graphql.types';

export const prepareUser = (item: UserDocument): User =>
  item && {
    id: item._id,
    nickname: item.nickname,
    signUpDate: item.signUpDate,
  };

export const prepareUsers = (items: UserDocument[]): User[] => items?.map(prepareUser);
