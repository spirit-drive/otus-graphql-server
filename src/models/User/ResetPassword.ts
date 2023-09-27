import * as mongoose from 'mongoose';

export type ResetPasswordType = {
  code: string;
  deadline: number;
};

export const ResetPassword = new mongoose.Schema({
  code: String,
  deadline: Number,
});
