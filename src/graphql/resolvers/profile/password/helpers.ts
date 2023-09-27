import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { ResetPassword } from '../../../../models/User';

export const getResetPassword = async (): Promise<ResetPassword & { token: string }> => {
  const token = crypto.randomBytes(32).toString('hex');
  const code = await bcrypt.hash(token, bcrypt.genSaltSync(8));
  return {
    deadline: Date.now() + 1000 * 60 * 60 * 3,
    code,
    token,
  };
};
