import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Order, OrderStatus, ProductInput } from '../../graphql.types';

export type OrderProductDocument = Document & ProductInput;

export const OrderProduct = new mongoose.Schema<ProductInput>({
  id: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

export type OrderDocument = Document &
  Omit<Order, 'id' | 'products' | 'user'> & {
    products: OrderProductDocument[];
    userId: string;
    commandId: string;
  };

export const OrderSchema = new mongoose.Schema<OrderDocument>(
  {
    products: {
      type: [OrderProduct],
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    commandId: String,
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      required: true,
      default: OrderStatus.PendingConfirmation,
    },
  },
  { timestamps: true }
);

export const OrderModel = mongoose.model('Order', OrderSchema);
