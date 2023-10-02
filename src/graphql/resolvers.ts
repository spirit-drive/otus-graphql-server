import { DateScalar } from './scalars/DateScalar';
import { ProfileMutations, ProfilePasswordMutations, profile } from './resolvers/profile';
import { CategoryMutations } from './resolvers/categories/CategoryMutations';
import { CategoryQueries } from './resolvers/categories/CategoryQueries';

export const resolvers = {
  Date: DateScalar,

  ProfileMutations,
  ProfilePasswordMutations,

  CategoryMutations,
  CategoryQueries,

  Mutation: {
    profile: () => ({}),
    categories: () => ({}),
  },
  Query: {
    profile,
    categories: () => ({}),
  },
};
