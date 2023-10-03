import { OperationDocument } from '../Operation';
import { Operation } from '../../graphql.types';

export const prepareOperation = async (item: OperationDocument): Promise<Operation> => {
  if (!item) return null;
  return {
    ...item.toObject(),
    id: item._id.toString(),
  };
};

export const prepareOperations = async (items: OperationDocument[]): Promise<Operation[]> => {
  if (!items?.length) return [];

  const result: Operation[] = [];
  for await (const item of items) {
    result.push(await prepareOperation(item));
  }
  return result;
};
