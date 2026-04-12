import { UserDocument } from './schemas/user.schema';

export class AuthMapper {
  static toUserResponseDto(user: UserDocument) {
    return {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      isVerified: user.isVerified,
    };
  }
}
