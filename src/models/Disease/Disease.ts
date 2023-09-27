import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Disease as DiseaseType } from '../../graphql.types';
import { DiseaseTypeField } from '../fields/DiseaseTypeField';
import { pubsub, pubsubKeys } from '../../graphql/pubsub';

export type DiseaseDocument = Document & DiseaseType;

export const DiseaseSchema = new mongoose.Schema<DiseaseDocument>({
  name: { type: String, required: true },
  desc: String,
  type: {
    required: true,
    ...DiseaseTypeField,
  },
});

DiseaseSchema.post('save', (updatedDisease) => pubsub.publish(pubsubKeys.updatedDisease, { updatedDisease }));
const removeHook = (removedDisease: DiseaseDocument) => pubsub.publish(pubsubKeys.removedDisease, { removedDisease });
DiseaseSchema.post('deleteOne', removeHook);
DiseaseSchema.post('findOneAndDelete', removeHook);
DiseaseSchema.post('findOneAndRemove', removeHook);

export const DiseaseModel = mongoose.model('Disease', DiseaseSchema);
