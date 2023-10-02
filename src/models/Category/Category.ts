import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Category } from '../../server.types';

export type CategoryDocument = Document &
  Omit<Category, 'id'> & {
    commandId: string;
  };
export const CategorySchema = new mongoose.Schema<CategoryDocument>(
  {
    name: {
      type: String,
      required: true,
    },
    commandId: String,
    photo: String,
  },
  { timestamps: true }
);

export const CategoryModel = mongoose.model('Category', CategorySchema);
