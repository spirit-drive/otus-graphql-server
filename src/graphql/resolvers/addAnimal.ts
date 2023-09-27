import { ApolloResolver } from '../../types';
import { withAuth } from '../auth';
import { AnimalDocument, AnimalModel } from '../../models/Animal';
import { MutationAddAnimalArgs } from '../../graphql.types';

export const addAnimalRaw: ApolloResolver<never, AnimalDocument | Error, MutationAddAnimalArgs> = async (
  _,
  { input }
) => {
  const { name, comment, type, doctorId, diseaseIds, age } = input;
  const entity = new AnimalModel({ name, comment, type, doctorId, diseaseIds, age });

  await entity.save();

  return entity;
};

export const addAnimal = withAuth(addAnimalRaw);
