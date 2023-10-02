import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Order, OrderStatus } from '../../server.types';

export type OrderDocument = Document &
  Omit<Order, 'id' | 'products' | 'user'> & {
    productIds: string[];
    userId: string;
    commandId: string;
  };
export const OrderSchema = new mongoose.Schema<OrderDocument>(
  {
    productIds: {
      type: [String],
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
