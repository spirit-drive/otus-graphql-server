import { DateScalar } from './scalars/DateScalar';
import { ProfileMutations, ProfilePasswordMutations, profile } from './resolvers/profile';
import { CategoryMutations } from './resolvers/categories/CategoryMutations';
import { CategoryQueries } from './resolvers/categories/CategoryQueries';
import { ProductMutations } from './resolvers/products/ProductMutations';
import { ProductQueries } from './resolvers/products/ProductQueries';
import { OperationQueries } from './resolvers/operations/OperationQueries';
import { OperationMutations } from './resolvers/operations/OperationMutations';

export const resolvers = {
  Date: DateScalar,

  ProfileMutations,
  ProfilePasswordMutations,

  CategoryMutations,
  CategoryQueries,

  ProductMutations,
  ProductQueries,

  OperationMutations,
  OperationQueries,

  Mutation: {
    profile: () => ({}),
    categories: () => ({}),
    products: () => ({}),
  },
  Query: {
    profile,
    categories: () => ({}),
    products: () => ({}),
  },
};
