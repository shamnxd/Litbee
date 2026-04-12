import {
  Inject,
  Injectable,
  ConflictException,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { UserDocument } from '../schemas/user.schema';
import { I_AUTH_REPOSITORY, I_ACCOUNT_SERVICE } from '../constants/tokens';
import type { IAuthRepository } from '../interfaces/auth.repository.interface';
import type { IIdentityService } from '../interfaces/identity.service.interface';
import type { IAccountService } from '../interfaces/account.service.interface';
import type { AuthResponse, UserResponse } from '../dto/auth-response.dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { AUTH_MESSAGES } from '../../common/constants/messages';
import { AuthMapper } from '../auth.mapper';

@Injectable()
export class IdentityService implements IIdentityService {
  constructor(
    @Inject(I_AUTH_REPOSITORY) private readonly _authRepository: IAuthRepository,
    @Inject(forwardRef(() => I_ACCOUNT_SERVICE))
    private readonly _accountService: IAccountService,
    private readonly _jwtService: JwtService,
    private readonly _configService: ConfigService,
  ) { }

  async register(dto: RegisterDto): Promise<{ message: string; user: UserResponse }> {
    const existing = await this._authRepository.findOne({ email: dto.email });
    if (existing) {
      throw new ConflictException(AUTH_MESSAGES.ERRORS.EMAIL_EXISTS);
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this._authRepository.create({
      email: dto.email,
      name: dto.name,
      password: hashedPassword,
      isVerified: false
    });

    // Send verification email automatically in service layer
    await this._accountService.sendVerificationEmail(user.email);

    return {
      message: AUTH_MESSAGES.SUCCESS.REGISTRATION_SUCCESS,
      user: AuthMapper.toUserResponseDto(user),
    };
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await this._authRepository.findOne({ email: dto.email });
    if (!user) {
      throw new UnauthorizedException(AUTH_MESSAGES.ERRORS.INVALID_CREDENTIALS);
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException(AUTH_MESSAGES.ERRORS.INVALID_CREDENTIALS);
    }

    return this.issueTokens(user);
  }

  async refreshTokens(refreshToken: string): Promise<AuthResponse> {
    try {
      const payload = await this._jwtService.verifyAsync<{
        sub: string;
        email: string;
      }>(refreshToken, {
        secret: this._configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const user = await this._authRepository.findById(payload.sub);
      if (!user || !user.refreshToken) {
        throw new UnauthorizedException(AUTH_MESSAGES.ERRORS.ACCESS_DENIED);
      }

      const isMatch = await bcrypt.compare(refreshToken, user.refreshToken);
      if (!isMatch) {
        throw new UnauthorizedException(AUTH_MESSAGES.ERRORS.ACCESS_DENIED);
      }

      return this.issueTokens(user);
    } catch {
      throw new UnauthorizedException(AUTH_MESSAGES.ERRORS.INVALID_REFRESH_TOKEN);
    }
  }

  async issueTokens(user: UserDocument): Promise<AuthResponse> {
    const payload = { sub: user._id.toString(), email: user.email };
    const [access_token, refresh_token] = await Promise.all([
      this._jwtService.signAsync(payload, {
        secret: this._configService.get<string>('JWT_SECRET'),
        expiresIn: this._configService.get<any>('JWT_ACCESS_TOKEN_EXPIRES_IN') || '15m',
      }),
      this._jwtService.signAsync(payload, {
        secret: this._configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this._configService.get<any>('JWT_REFRESH_TOKEN_EXPIRES_IN') || '7d',
      }),
    ]);

    const hashedRefreshToken = await bcrypt.hash(refresh_token, 10);
    await this._authRepository.findByIdAndUpdate(user._id.toString(), {
      $set: { refreshToken: hashedRefreshToken }
    });

    return {
      message: AUTH_MESSAGES.SUCCESS.LOGIN_SUCCESS,
      access_token,
      refresh_token,
      user: AuthMapper.toUserResponseDto(user),
    };
  }

  async logout(userId: string) {
    await this._authRepository.findByIdAndUpdate(userId, {
      $set: { refreshToken: null }
    });
    return { message: AUTH_MESSAGES.SUCCESS.LOGOUT_SUCCESS };
  }
}
