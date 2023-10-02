import { Category, CategoryQueriesGetManyArgs, Pagination, SortField, Sorting } from '../../../graphql.types';
import { CategoryModel } from '../../../models/Category';
import { UserDocument } from '../../../models/User';
import { prepareCategories } from '../../../models/helpers/prepareCategory';
import { setSortingAndPagination } from '../../../utils/setSortingAndPagination';
import { getManyResponse } from '../../../utils/getManyResponse';
import { ApolloResolver, ResponseManyResult } from '../../../types';

export const getMany: ApolloResolver<
  never,
  ResponseManyResult<Category[]> | Error,
  CategoryQueriesGetManyArgs
> = async (_, args, { user }) => {
  const { commandId } = (user || {}) as UserDocument;
  const { name, ids, sorting, pagination } = args.input || {};
  const query = CategoryModel.find();
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

  const countQuery = CategoryModel.find();
  return await getManyResponse(
    await prepareCategories(entities),
    query.getFilter(),
    countQuery,
    responseSortingAndPagination
  );
};
