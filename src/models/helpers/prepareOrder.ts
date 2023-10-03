import { ProductModel } from '../Product';
import { prepareProduct } from './prepareProduct';
import { OrderDocument, OrderProductDocument } from '../Order';
import { Order, OrderProduct } from '../../graphql.types';

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
  return {
    ...item.toObject(),
    id: item._id.toString(),
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
