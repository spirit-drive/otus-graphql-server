import { IFieldResolver } from '@graphql-tools/utils';
import { ApolloContext } from '../../../types';
import { UserModel } from '../../../models/User';
import { prepareUser } from '../../../models/helpers/prepareUser';
import { prepareOrderProducts } from '../../../models/helpers/prepareOrder';
import { OrderProductDocument } from '../../../models/Order';

export const user: IFieldResolver<{ userId: string }, unknown, ApolloContext> = async (source) => {
  const result = await UserModel.findById(source.userId);
  return prepareUser(result);
};

export const products: IFieldResolver<{ products: OrderProductDocument[] }, unknown, ApolloContext> = async (source) =>
  await prepareOrderProducts(source.products);

export const Order = {
  user,
  products,
};
