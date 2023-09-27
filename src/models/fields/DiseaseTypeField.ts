import { DiseaseType } from '../../graphql.types';

export const DiseaseTypeField = {
  type: String,
  default: DiseaseType.Cold,
  enum: Object.values(DiseaseType),
};
