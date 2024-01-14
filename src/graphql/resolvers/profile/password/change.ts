import { ErrorCode, ApolloResolver } from '../../../../types';
import { ProfilePasswordMutationsChangeArgs } from '../../../../graphql.types';
import { isValidPassword } from '../../../../models/User/helpers';
import { ResetPassword } from '../../../../graphql.types';
import { GraphQLError } from 'graphql/index';
import { withAuth } from '../../../auth';

export const changeRaw: ApolloResolver<never, ResetPassword | Error, ProfilePasswordMutationsChangeArgs> = async (
  _,
  { input },
  { user }
) => {
  const { password, newPassword } = input;
  if (!user.isRightPassword(password)) {
    return new GraphQLError('Incorrect password', {
      extensions: {
        code: ErrorCode.INCORRECT_PASSWORD,
      },
    });
  }

  if (!isValidPassword(newPassword)) {
    return new GraphQLError(`"${newPassword}" is not valid password. Password must match ${isValidPassword.regexp}`, {
      extensions: {
        code: ErrorCode.INVALID_PASSWORD,
      },
    });
  }

  user.password = await user.generateHash(newPassword);

  await user.save();

  return {
    success: true,
  };
};

export const change = withAuth(changeRaw);
