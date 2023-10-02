import { withAuth } from '../../auth';
import { update } from './update';

export const put = withAuth(update());
