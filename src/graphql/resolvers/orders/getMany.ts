import { Order, OrderQueriesGetManyArgs, Pagination, SortField, Sorting } from '../../../graphql.types';
import { OrderModel } from '../../../models/Order';
import { UserDocument } from '../../../models/User';
import { prepareOrders } from '../../../models/helpers/prepareOrder';
import { setSortingAndPagination } from '../../../utils/setSortingAndPagination';
import { getManyResponse } from '../../../utils/getManyResponse';
import { ApolloResolver, ResponseManyResult } from '../../../types';

export const getMany: ApolloResolver<never, ResponseManyResult<Order[]> | Error, OrderQueriesGetManyArgs> = async (
  _,
  args,
  { user }
) => {
  const { commandId } = (user || {}) as UserDocument;
  const { ids, userId, productIds, status, sorting, pagination } = args?.input || {};
  const query = OrderModel.find();
  if (commandId) {
    query.where('commandId', commandId);
  }
  if (ids?.length) {
    query.where('_id', { $in: ids });
  }
  if (userId) {
    query.where('userId', userId);
  }
  if (status) {
    query.where('status', status);
  }
  if (productIds?.length) {
    query.where('productIds').in(productIds);
  }

  const responseSortingAndPagination = setSortingAndPagination(query, {
    sorting: sorting as Sorting,
    pagination: pagination as Pagination,
    defaultSortingField: SortField.CreatedAt,
  });

  const entities = await query;

  const countQuery = OrderModel.find();

  return await getManyResponse(
    await prepareOrders(entities),
    query.getFilter(),
    countQuery,
    responseSortingAndPagination
  );
};
