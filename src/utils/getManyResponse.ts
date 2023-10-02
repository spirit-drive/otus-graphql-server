import { FilterQuery, QueryWithHelpers } from 'mongoose';
import { Pagination, Sorting } from '../graphql.types';
import { ResponseManyResult } from '../types';

export const getManyResponse = async <T>(
  data: T,
  filter: FilterQuery<unknown>,
  countQuery: QueryWithHelpers<unknown, unknown>,
  { sorting, pagination }: { pagination: Pagination; sorting: Sorting }
): Promise<ResponseManyResult<T>> => {
  countQuery.where(filter);

  return {
    data,
    sorting,
    pagination: {
      ...pagination,
      total: await countQuery.countDocuments(),
    },
  };
};
