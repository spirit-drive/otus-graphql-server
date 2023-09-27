import { ApolloResolver } from '../../types';
import { withAuth } from '../auth';
import { DiseaseDocument, DiseaseModel } from '../../models/Disease';

export const diseasesRaw: ApolloResolver<never, DiseaseDocument[] | Error> = async () =>
  (await DiseaseModel.find({})) as DiseaseDocument[];

export const diseases = withAuth(diseasesRaw);
