import { UserDocument } from '../User';
import { User } from '../../graphql.types';

export const prepareUser = (item: UserDocument): User => {
  if (!item) return {} as User;

  const raw = item.toObject();
  return {
    id: raw._id.toString(),
    name: raw.name,
  };
};
