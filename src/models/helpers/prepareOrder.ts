import { ProductModel } from '../Product';
import { prepareProduct } from './prepareProduct';
import { OrderDocument, OrderProductDocument } from '../Order';
import { Order, OrderProduct } from '../../graphql.types';
import { UserModel } from '../User';
import { prepareUser } from './prepareUser';

export const prepareOrderProducts = async (productRaws: OrderProductDocument[]): Promise<OrderProduct[]> => {
  const result: OrderProduct[] = [];
  for await (const productRaw of productRaws) {
    result.push({
      id: productRaw._id,
      product: await prepareProduct(await ProductModel.findById(productRaw.id)),
      quantity: productRaw.quantity,
    });
  }
  return result;
};

export const prepareOrder = async (item: OrderDocument): Promise<Order> => {
  if (!item) return null;
  const userDoc = await UserModel.findById(item.userId);
  return {
    id: item._id.toString(),
    products: await prepareOrderProducts(item.products),
    status: item.status,
    user: prepareUser(userDoc),
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
};

export const prepareOrders = async (items: OrderDocument[]): Promise<Order[]> => {
  if (!items?.length) return [];

  const result: Order[] = [];
  for await (const item of items) {
    result.push(await prepareOrder(item));
  }
  return result;
};
