import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Product } from '../../server.types';

export type ProductDocument = Document &
  Omit<Product, 'id' | 'category'> & {
    categoryId: string;
    commandId: string;
  };
export const ProductSchema = new mongoose.Schema<ProductDocument>(
  {
    name: {
      type: String,
      required: true,
    },
    categoryId: {
      type: String,
      required: true,
    },
    oldPrice: Number,
    price: {
      type: Number,
      required: true,
    },
    photo: String,
    desc: String,
    commandId: String,
  },
  { timestamps: true }
);

export const ProductModel = mongoose.model('Product', ProductSchema);
