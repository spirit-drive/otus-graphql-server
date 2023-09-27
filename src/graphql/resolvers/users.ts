import { ApolloResolver } from '../../types';
import { User } from '../../graphql.types';
import { withAuth } from '../auth';
import { getOnlineUsers } from '../onlineUsers';
import { prepareUsers } from '../../models/helpers/prepareUser';

export const usersRaw: ApolloResolver<never, User[] | Error> = async () => prepareUsers(getOnlineUsers());

export const users = withAuth(usersRaw);
