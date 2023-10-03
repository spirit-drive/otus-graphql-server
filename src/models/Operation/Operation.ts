import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Operation } from '../../graphql.types';

export type OperationDocument = Document &
  Omit<Operation, 'id' | 'category'> & {
    categoryId: string;
    commandId: string;
  };
export const OperationSchema = new mongoose.Schema<OperationDocument>(
  {
    name: {
      type: String,
      required: true,
    },
    categoryId: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['Profit', 'Cost'],
    },
    amount: {
      type: Number,
      required: true,
    },
    desc: String,
    commandId: String,
  },
  { timestamps: true }
);

export const OperationModel = mongoose.model('Operation', OperationSchema);
