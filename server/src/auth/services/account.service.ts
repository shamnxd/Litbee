import { Inject, Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { I_REDIS_SERVICE } from '../../redis/redis.service.interface';
import type { IRedisService } from '../../redis/redis.service.interface';
import { I_MAIL_SERVICE } from '../../mail/mail.service.interface';
import type { IMailService } from '../../mail/mail.service.interface';
import { IAccountService } from '../interfaces/account.service.interface';
import { AUTH_MESSAGES } from '../../common/constants/messages';
import { I_AUTH_REPOSITORY, I_IDENTITY_SERVICE } from '../constants/tokens';
import type { IAuthRepository } from '../interfaces/auth.repository.interface';
import type { IIdentityService } from '../interfaces/identity.service.interface';
import { AuthResponse } from '../dto/auth-response.dto';

@Injectable()
export class AccountService implements IAccountService {
  constructor(
    @Inject(I_AUTH_REPOSITORY) private readonly _authRepository: IAuthRepository,
    @Inject(I_IDENTITY_SERVICE) private readonly _identityService: IIdentityService,
    @Inject(I_REDIS_SERVICE) private readonly _redisService: IRedisService,
    @Inject(I_MAIL_SERVICE) private readonly _mailService: IMailService,
    private readonly _configService: ConfigService,
  ) { }

  private _generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async sendVerificationEmail(email: string): Promise<{ message: string }> {
    const user = await this._authRepository.findOne({ email });
    if (!user) throw new UnauthorizedException(AUTH_MESSAGES.ERRORS.USER_NOT_FOUND);
    if (user.isVerified) throw new ConflictException(AUTH_MESSAGES.ERRORS.EMAIL_ALREADY_VERIFIED);

    const otp = this._generateOtp();
    const expiry = this._configService.get<number>('OTP_EXPIRES_IN_SEC') || 300;
    await this._redisService.set(`otp:${email}`, otp, Number(expiry));
    await this._mailService.sendVerificationOtp(email, otp);
    return { message: AUTH_MESSAGES.SUCCESS.OTP_SENT };
  }

  async verifyEmail(email: string, otp: string): Promise<AuthResponse & { message: string }> {
    const storedOtp = await this._redisService.get(`otp:${email}`);
    if (!storedOtp || storedOtp !== otp) {
      throw new UnauthorizedException(AUTH_MESSAGES.ERRORS.INVALID_OTP);
    }

    let user = await this._authRepository.findOne({ email });
    if (!user) throw new UnauthorizedException(AUTH_MESSAGES.ERRORS.USER_NOT_FOUND);

    const updatedUser = await this._authRepository.findByIdAndUpdate(user._id.toString(), { $set: { isVerified: true } });
    if (updatedUser) user = updatedUser;
    await this._redisService.del(`otp:${email}`);

    const response = await this._identityService.issueTokens(user);
    return {
      message: AUTH_MESSAGES.SUCCESS.EMAIL_VERIFIED,
      ...response,
    };
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this._authRepository.findOne({ email });
    if (!user)
      return { message: AUTH_MESSAGES.SUCCESS.RESET_LINK_SENT };

    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiry = this._configService.get<number>('RESET_TOKEN_EXPIRES_IN_SEC') || 3600;
    await this._redisService.set(`reset:${resetToken}`, email, Number(expiry));

    const frontendUrl =
      this._configService.get<string>('FRONTEND_URL') || 'http://localhost:5174';
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;

    await this._mailService.sendResetPasswordEmail(email, resetUrl);
    return { message: AUTH_MESSAGES.SUCCESS.RESET_LINK_SENT };
  }

  async resetPassword(token: string, newPass: string): Promise<{ message: string }> {
    const email = await this._redisService.get(`reset:${token}`);
    if (!email)
      throw new UnauthorizedException(AUTH_MESSAGES.ERRORS.INVALID_RESET_TOKEN);

    const user = await this._authRepository.findOne({ email });
    if (!user) throw new UnauthorizedException(AUTH_MESSAGES.ERRORS.USER_NOT_FOUND);

    const hashedPassword = await bcrypt.hash(newPass, 10);
    await this._authRepository.findByIdAndUpdate(user._id.toString(), { $set: { password: hashedPassword } });
    await this._redisService.del(`reset:${token}`);

    return { message: AUTH_MESSAGES.SUCCESS.PASSWORD_RESET };
  }
}
