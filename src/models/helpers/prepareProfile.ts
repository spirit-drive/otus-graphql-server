import { UserDocument } from '../User';
import { Profile } from '../../graphql.types';

export const prepareProfile = (item: UserDocument): Profile =>
  item && {
    id: item._id,
    nickname: item.nickname,
    signUpDate: item.signUpDate,
  };
