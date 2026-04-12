import { IBaseRepository } from '../../common/repositories/base.repository.interface';
import { UserDocument } from '../schemas/user.schema';

export interface IAuthRepository extends IBaseRepository<UserDocument> {
  // Add complex custom querying methods here if needed
}
