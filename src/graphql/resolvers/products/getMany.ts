import { Product, ProductQueriesGetManyArgs, Pagination, SortField, Sorting } from '../../../graphql.types';
import { ProductModel } from '../../../models/Product';
import { UserDocument } from '../../../models/User';
import { prepareProducts } from '../../../models/helpers/prepareProduct';
import { setSortingAndPagination } from '../../../utils/setSortingAndPagination';
import { getManyResponse } from '../../../utils/getManyResponse';
import { ApolloResolver, ResponseManyResult } from '../../../types';

export const getMany: ApolloResolver<never, ResponseManyResult<Product[]> | Error, ProductQueriesGetManyArgs> = async (
  _,
  args,
  { user }
) => {
  const { commandId } = (user || {}) as UserDocument;
  const { name, ids, sorting, pagination } = args.input || {};
  const query = ProductModel.find();
  if (commandId) {
    query.where('commandId', commandId);
  }
  if (ids?.length) {
    query.where('_id', { $in: ids });
  }
  if (name) {
    query.where('name', new RegExp(name, 'i'));
  }

  const responseSortingAndPagination = setSortingAndPagination(query, {
    sorting: sorting as Sorting,
    pagination: pagination as Pagination,
    defaultSortingField: SortField.Name,
  });

  const entities = await query;

  const countQuery = ProductModel.find();
  return await getManyResponse(
    await prepareProducts(entities),
    query.getFilter(),
    countQuery,
    responseSortingAndPagination
  );
};
