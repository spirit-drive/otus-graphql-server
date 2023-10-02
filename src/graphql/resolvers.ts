import { DateScalar } from './scalars/DateScalar';
import { ProfileMutations, ProfilePasswordMutations, profile } from './resolvers/profile';
import { CategoryMutations } from './resolvers/categories/CategoryMutations';
import { CategoryQueries } from './resolvers/categories/CategoryQueries';
import { ProductMutations } from './resolvers/products/ProductMutations';
import { ProductQueries } from './resolvers/products/ProductQueries';

export const resolvers = {
  Date: DateScalar,

  ProfileMutations,
  ProfilePasswordMutations,

  CategoryMutations,
  CategoryQueries,

  ProductMutations,
  ProductQueries,

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
