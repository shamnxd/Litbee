import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { MailService } from '../mail/mail.service';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class AuthService {
  private googleClient: OAuth2Client;
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailService: MailService,
    private redisService: RedisService,
  ) {
    this.googleClient = new OAuth2Client(
      this.configService.get<string>('GOOGLE_CLIENT_ID'),
    );
  }

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async sendVerificationEmail(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('User not found');
    if (user.isVerified) throw new ConflictException('Email already verified');

    const otp = this.generateOtp();
    await this.redisService.set(`otp:${email}`, otp, 300);
    await this.mailService.sendVerificationOtp(email, otp);
    return { message: 'Verification OTP sent to your email.' };
  }

  async verifyEmail(email: string, otp: string) {
    const storedOtp = await this.redisService.get(`otp:${email}`);
    if (!storedOtp || storedOtp !== otp) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('User not found');

    await this.usersService.updateVerificationStatus(user._id.toString(), true);
    await this.redisService.del(`otp:${email}`);

    const tokens = await this.getTokens(user._id.toString(), user.email);
    await this.updateRefreshToken(user._id.toString(), tokens.refresh_token);

    return {
      message: 'Email verified successfully.',
      ...tokens,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        isVerified: true,
      },
    };
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user)
      return { message: 'If an account exists, a reset link will be sent.' };

    const resetToken = crypto.randomBytes(32).toString('hex');
    await this.redisService.set(`reset:${resetToken}`, email, 3600);

    const frontendUrl =
      this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5174';
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;

    await this.mailService.sendResetPasswordEmail(email, resetUrl);
    return { message: 'If an account exists, a reset link will be sent.' };
  }

  async resetPassword(token: string, newPass: string) {
    const email = await this.redisService.get(`reset:${token}`);
    if (!email)
      throw new UnauthorizedException('Invalid or expired reset token');

    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('User not found');

    const hashedPassword = await bcrypt.hash(newPass, 10);
    await this.usersService.updatePassword(user._id.toString(), hashedPassword);
    await this.redisService.del(`reset:${token}`);

    return { message: 'Password reset successfully' };
  }

  async register(dto: RegisterDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('An account with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.create(
      dto.email,
      dto.name,
      hashedPassword,
      false,
    );

    try {
      await this.sendVerificationEmail(user.email);
    } catch (error) {
      console.error('Failed to send initial verification email:', error);
    }

    return {
      message: 'Registration successful. Please verify your email.',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        isVerified: user.isVerified,
      },
    };
  }

  async validateGoogleToken(token: string) {
    try {
      let email: string | undefined;
      let name: string | undefined;

      try {
        const ticket = await this.googleClient.verifyIdToken({
          idToken: token,
          audience: this.configService.get<string>('GOOGLE_CLIENT_ID'),
        });
        const payload = ticket.getPayload();
        if (payload) {
          email = payload.email;
          name = payload.name;
        }
      } catch {
        try {
          const response = await fetch(
            `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`,
          );
          if (response.ok) {
            const data = (await response.json()) as {
              email: string;
              name?: string;
            };
            email = data.email;
            name = data.name;
          }
        } catch {
          throw new UnauthorizedException('Invalid Google token');
        }
      }

      if (!email) {
        throw new UnauthorizedException('Google authentication failed');
      }

      let user = await this.usersService.findByEmail(email);

      if (!user) {
        const randomPassword = await bcrypt.hash(
          Math.random().toString(36),
          10,
        );
        user = await this.usersService.create(
          email,
          name ?? email,
          randomPassword,
          true,
        );
      } else if (!user.isVerified) {
        await this.usersService.updateVerificationStatus(
          user._id.toString(),
          true,
        );
      }

      const tokens = await this.getTokens(user._id.toString(), user.email);
      await this.updateRefreshToken(user._id.toString(), tokens.refresh_token);

      return {
        message: 'Login successful',
        ...tokens,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          isVerified: true,
        },
      };
    } catch (error) {
      console.error('Google Auth Error:', error);
      throw new UnauthorizedException('Google authentication failed');
    }
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const tokens = await this.getTokens(user._id.toString(), user.email);
    await this.updateRefreshToken(user._id.toString(), tokens.refresh_token);

    return {
      message: 'Login successful',
      ...tokens,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        isVerified: user.isVerified,
      },
    };
  }

  async refreshTokens(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync<{
        sub: string;
        email: string;
      }>(refreshToken, {
        secret:
          this.configService.get<string>('JWT_REFRESH_SECRET') ||
          'refresh_secret',
      });
      const userId = payload.sub;

      const user = await this.usersService.findById(userId);
      if (!user || !user.refreshToken) {
        throw new UnauthorizedException('Access Denied');
      }

      const isMatch = await bcrypt.compare(refreshToken, user.refreshToken);
      if (!isMatch) {
        throw new UnauthorizedException('Access Denied');
      }

      const tokens = await this.getTokens(user._id.toString(), user.email);
      await this.updateRefreshToken(user._id.toString(), tokens.refresh_token);

      return {
        ...tokens,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          isVerified: user.isVerified,
        },
      };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async getTokens(userId: string, email: string) {
    const payload = { sub: userId, email };
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      }),
    ]);

    return { access_token, refresh_token };
  }

  async updateRefreshToken(userId: string, refreshToken: string | null) {
    if (!refreshToken) {
      await this.usersService.updateRefreshToken(userId, null);
      return;
    }
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersService.updateRefreshToken(userId, hashedRefreshToken);
  }

  async logout(userId: string) {
    await this.usersService.updateRefreshToken(userId, null);
    return { message: 'Logged out successfully.' };
  }
}
