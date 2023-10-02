import { Document } from 'mongoose';

export const updateModel = <T, Doc extends Document & T>(input: T, doc: Doc, keys: (keyof T)[], patch?: boolean) => {
  keys.forEach((key) => {
    if (patch) {
      doc[key] = (input as unknown as Doc)[key] || doc[key];
    } else {
      doc[key] = (input as unknown as Doc)[key] || null;
    }
  });
};
