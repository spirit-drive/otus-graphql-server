import { QueryWithHelpers } from 'mongoose';
import { Pagination, SortField, Sorting, SortType } from '../graphql.types';
import * as config from '../config.json';

export const setSortingAndPagination = (
  query: QueryWithHelpers<unknown, unknown>,
  {
    sorting,
    pagination,
    defaultSortingField,
  }: { sorting: Sorting; pagination: Pagination; defaultSortingField: SortField }
) => {
  // Добавляем сортировку
  if (sorting) {
    const { type = SortType.Asc, field } = sorting;
    let sortField = defaultSortingField as string;

    switch (field) {
      case SortField.Id:
        sortField = '_id';
        break;
      case SortField.CreatedAt:
        sortField = 'createdAt';
        break;
      case SortField.UpdatedAt:
        sortField = 'updatedAt';
        break;
      case SortField.Name:
        sortField = 'name';
        break;
      default:
        break;
    }

    const sortDirection = type === SortType.Desc ? -1 : 1;
    query.sort({ [sortField]: sortDirection });
  }

  // Добавляем пагинацию
  if (pagination) {
    const { pageSize = config.defaultPageSize, pageNumber = config.defaultPageNumber } = pagination;
    const skip = pageSize * (pageNumber - 1);
    query.skip(skip).limit(pageSize);
  }

  return {
    pagination: { pageSize: config.defaultPageSize, pageNumber: config.defaultPageNumber, ...(pagination || {}) },
    sorting: { type: SortType.Asc, field: defaultSortingField, ...(sorting || {}) },
  };
};
