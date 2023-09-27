import { ApolloResolver } from '../../types';
import { User, Disease } from '../../graphql.types';
import { UserModel } from '../../models/User';
import { DiseaseModel } from '../../models/Disease';
import { AnimalDocument } from '../../models/Animal';
const doctor: ApolloResolver<AnimalDocument, User | Error> = async (doc) => await UserModel.findById(doc.doctorId);
const diseases: ApolloResolver<AnimalDocument, Disease[] | Error> = async (doc) =>
  await DiseaseModel.find().where('_id').in(doc.diseaseIds);

export const Animal = {
  doctor,
  diseases,
};
