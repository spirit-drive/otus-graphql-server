import { ApolloResolver } from '../../types';
import { withAuth } from '../auth';
import { MedicineDocument, MedicineModel } from '../../models/Medicine';

export const medicinesRaw: ApolloResolver<never, MedicineDocument[] | Error> = async () =>
  (await MedicineModel.find({})) as MedicineDocument[];

export const medicines = withAuth(medicinesRaw);
