import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { IAuthRepository } from '../interfaces/auth.repository.interface';
import { BaseRepository } from '../../common/repositories/base.repository';

@Injectable()
export class AuthRepository
  extends BaseRepository<UserDocument>
  implements IAuthRepository
{
  constructor(@InjectModel(User.name) userModel: Model<UserDocument>) {
    super(userModel);
  }
}
