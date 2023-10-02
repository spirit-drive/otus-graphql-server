import { UserDocument } from '../User';
import { Profile } from '../../graphql.types';

export const prepareProfile = (item: UserDocument): Profile => {
  if (!item) return null;

  const raw = item.toObject();
  return {
    id: raw._id.toString(),
    nickname: raw.nickname,
    email: raw.email,
    signUpDate: raw.signUpDate,
  };
};
