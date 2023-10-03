import { withAuth } from '../../auth';
import { update } from './update';

export const patch = withAuth(update(true));
