import { ApolloResolver } from '../../types';
import { withAuth } from '../auth';
import { AnimalDocument, AnimalModel } from '../../models/Animal';

export const animalsRaw: ApolloResolver<never, AnimalDocument[] | Error> = async () =>
  (await AnimalModel.find({})) as AnimalDocument[];

export const animals = withAuth(animalsRaw);
