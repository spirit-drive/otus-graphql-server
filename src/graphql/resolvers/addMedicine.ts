import { ApolloResolver } from '../../types';
import { withAuth } from '../auth';
import { MedicineDocument, MedicineModel } from '../../models/Medicine';
import { MutationAddMedicineArgs } from '../../graphql.types';

export const addMedicineRaw: ApolloResolver<never, MedicineDocument | Error, MutationAddMedicineArgs> = async (
  _,
  { input }
) => {
  const { name, heal } = input;
  const entity = new MedicineModel({ name, heal });

  await entity.save();

  return entity;
};

export const addMedicine = withAuth(addMedicineRaw);
