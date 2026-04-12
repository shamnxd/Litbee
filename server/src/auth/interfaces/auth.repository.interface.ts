import { IBaseRepository } from '../../common/repositories/base.repository.interface';
import { UserDocument } from '../schemas/user.schema';

export const I_AUTH_REPOSITORY = 'IAuthRepository';

export interface IAuthRepository extends IBaseRepository<UserDocument> {
  // Add complex custom querying methods here if needed
}
