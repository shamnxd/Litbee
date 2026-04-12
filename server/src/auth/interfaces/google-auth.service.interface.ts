import { GoogleUserProfile } from '../dto/google-user-profile.dto';
import { AuthResponse } from '../dto/auth-response.dto';

export interface IGoogleAuthService {
  verifyToken(token: string): Promise<GoogleUserProfile>;
  login(token: string): Promise<AuthResponse>;
}
