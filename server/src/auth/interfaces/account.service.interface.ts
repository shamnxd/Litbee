import { AuthResponse, UserResponse } from '../dto/auth-response.dto';

export const I_ACCOUNT_SERVICE = 'IAccountService';

export interface IAccountService {
  sendVerificationEmail(email: string): Promise<{ message: string }>;
  verifyEmail(email: string, otp: string): Promise<AuthResponse & { message: string }>;
  forgotPassword(email: string): Promise<{ message: string }>;
  resetPassword(token: string, newPass: string): Promise<{ message: string }>;
}
