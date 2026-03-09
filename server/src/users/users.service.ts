import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(
    email: string,
    name: string,
    hashedPassword: string,
    isVerified: boolean = false,
  ): Promise<UserDocument> {
    const user = new this.userModel({
      email,
      name,
      password: hashedPassword,
      isVerified,
    });
    return user.save();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  async updateRefreshToken(
    id: string,
    refreshToken: string | null,
  ): Promise<void> {
    await this.userModel.findByIdAndUpdate(id, { refreshToken }).exec();
  }

  async updateVerificationStatus(
    id: string,
    isVerified: boolean,
  ): Promise<void> {
    await this.userModel.findByIdAndUpdate(id, { isVerified }).exec();
  }

  async updatePassword(id: string, hashedPassword: string): Promise<void> {
    await this.userModel
      .findByIdAndUpdate(id, { password: hashedPassword })
      .exec();
  }
}
