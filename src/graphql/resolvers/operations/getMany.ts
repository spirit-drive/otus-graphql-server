import { Operation, OperationQueriesGetManyArgs, Pagination, SortField, Sorting } from '../../../graphql.types';
import { OperationModel } from '../../../models/Operation';
import { UserDocument } from '../../../models/User';
import { prepareOperations } from '../../../models/helpers/prepareOperation';
import { setSortingAndPagination } from '../../../utils/setSortingAndPagination';
import { getManyResponse } from '../../../utils/getManyResponse';
import { ApolloResolver, ResponseManyResult } from '../../../types';

export const getMany: ApolloResolver<
  never,
  ResponseManyResult<Operation[]> | Error,
  OperationQueriesGetManyArgs
> = async (_, args, { user }) => {
  const { commandId } = (user || {}) as UserDocument;
  const { name, ids, sorting, type, pagination, createdAt, updatedAt } = args.input || {};
  const query = OperationModel.find();
  if (type) {
    query.where('type', type);
  }
  if (commandId) {
    query.where('commandId', commandId);
  }
  if (createdAt && (createdAt.gte || createdAt.lte)) {
    query.where('createdAt');
    if (createdAt.gte) {
      query.gte(createdAt.gte);
    }
    if (createdAt.lte) {
      query.lte(createdAt.lte);
    }
  }
  if (updatedAt && (updatedAt.gte || updatedAt.lte)) {
    query.where('updatedAt');
    if (updatedAt.gte) {
      query.gte(updatedAt.gte);
    }
    if (updatedAt.lte) {
      query.lte(updatedAt.lte);
    }
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

  const countQuery = OperationModel.find();
  return await getManyResponse(
    await prepareOperations(entities),
    query.getFilter(),
    countQuery,
    responseSortingAndPagination
  );
};
