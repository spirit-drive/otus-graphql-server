import { DateScalar } from './scalars/DateScalar';
import { ProfileMutations, ProfilePasswordMutations, profile } from './resolvers/profile';
import { CategoryMutations } from './resolvers/categories/CategoryMutations';
import { CategoryQueries } from './resolvers/categories/CategoryQueries';
import { ProductMutations } from './resolvers/products/ProductMutations';
import { ProductQueries } from './resolvers/products/ProductQueries';
import { OperationQueries } from './resolvers/operations/OperationQueries';
import { OperationMutations } from './resolvers/operations/OperationMutations';
import { OrderQueries } from './resolvers/orders/OrderQueries';
import { OrderMutations } from './resolvers/orders/OrderMutations';

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

  OrderQueries,
  OrderMutations,

  Mutation: {
    profile: () => ({}),
    categories: () => ({}),
    products: () => ({}),
    orders: () => ({}),
  },
  Query: {
    profile,
    categories: () => ({}),
    products: () => ({}),
    orders: () => ({}),
  },
};
