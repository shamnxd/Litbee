import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { AuthResponse, UserResponse } from '../dto/auth-response.dto';
import { UserDocument } from '../schemas/user.schema';

export const I_IDENTITY_SERVICE = 'IIdentityService';

export interface IIdentityService {
  register(dto: RegisterDto): Promise<{ message: string; user: UserResponse }>;
  login(dto: LoginDto): Promise<AuthResponse>;
  refreshTokens(refreshToken: string): Promise<AuthResponse>;
  logout(userId: string): Promise<{ message: string }>;
  issueTokens(user: UserDocument): Promise<AuthResponse>;
}
