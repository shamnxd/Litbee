export const I_MAIL_SERVICE = 'IMailService';

export interface IMailService {
  sendVerificationOtp(email: string, otp: string): Promise<void>;
  sendResetPasswordEmail(email: string, resetUrl: string): Promise<void>;
}
