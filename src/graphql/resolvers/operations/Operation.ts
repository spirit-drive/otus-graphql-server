import { category } from '../helpers';
import { OperationType } from '../../../graphql.types';

export const Profit = {
  category,
};
export const Cost = {
  category,
};
export const Operation = {
  __resolveType: async (obj: { type?: OperationType }) => obj?.type,
};
