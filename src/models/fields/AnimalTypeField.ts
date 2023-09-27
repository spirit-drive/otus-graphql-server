import { AnimalType } from '../../graphql.types';

export const AnimalTypeField = {
  type: String,
  default: AnimalType.Dog,
  enum: Object.values(AnimalType),
};
