import { ApolloResolver } from '../../types';
import { withAuth } from '../auth';
import { MedicineDocument, MedicineModel } from '../../models/Medicine';
import { MutationUpdateMedicineArgs } from '../../graphql.types';

export const updateMedicineRaw: ApolloResolver<never, MedicineDocument | Error, MutationUpdateMedicineArgs> = async (
  _,
  { input, id }
) => {
  const { name, heal } = input;
  const entity = (await MedicineModel.findById(id)) as MedicineDocument;
  entity.name = name;
  entity.heal = heal;

  await entity.save();

  return entity;
};

export const updateMedicine = withAuth(updateMedicineRaw);
