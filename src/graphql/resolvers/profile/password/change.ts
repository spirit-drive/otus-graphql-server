import { Messages, ApolloResolver } from '../../../../types';
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
        code: Messages.INCORRECT_PASSWORD,
      },
    });
  }

  if (!isValidPassword(newPassword)) {
    return new GraphQLError(`"${newPassword}" is not valid password`, {
      extensions: {
        code: Messages.INVALID_PASSWORD,
        http: { status: 400 },
      },
    });
  }

  user.password = await user.generateHash(newPassword);

  try {
    await user.save();
  } catch (e) {
    return new GraphQLError(e.message, {
      extensions: {
        code: Messages.DATA_BASE_ERROR,
      },
    });
  }

  return {
    success: true,
  };
};

export const change = withAuth(changeRaw);
