import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
  Inject,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { I_IDENTITY_SERVICE } from './interfaces/identity.service.interface';
import type { IIdentityService } from './interfaces/identity.service.interface';
import { I_ACCOUNT_SERVICE } from './interfaces/account.service.interface';
import type { IAccountService } from './interfaces/account.service.interface';
import { I_GOOGLE_AUTH_SERVICE } from './interfaces/google-auth.service.interface';
import type { IGoogleAuthService } from './interfaces/google-auth.service.interface';
import { AUTH_MESSAGES } from '../common/constants/messages';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { setRefreshTokenCookie, clearRefreshTokenCookie } from '../common/utils/cookie.util';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(I_IDENTITY_SERVICE) private readonly identityService: IIdentityService,
    @Inject(I_ACCOUNT_SERVICE) private readonly accountService: IAccountService,
    @Inject(I_GOOGLE_AUTH_SERVICE) private readonly googleAuthService: IGoogleAuthService,
  ) { }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() dto: RegisterDto) {
    return this.identityService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refresh_token, ...data } = await this.identityService.login(dto);
    setRefreshTokenCookie(res, refresh_token);
    return data;
  }

  @Post('google-login')
  @HttpCode(HttpStatus.OK)
  async googleLogin(
    @Body('token') token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refresh_token, ...data } = await this.googleAuthService.login(token);
    setRefreshTokenCookie(res, refresh_token);
    return data;
  }

  @Post('send-otp')
  @HttpCode(HttpStatus.OK)
  async sendOtp(@Body('email') email: string) {
    return this.accountService.sendVerificationEmail(email);
  }

  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  async verifyEmail(
    @Body('email') email: string,
    @Body('otp') otp: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refresh_token, ...data } = await this.accountService.verifyEmail(email, otp);
    setRefreshTokenCookie(res, refresh_token);
    return data;
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body('email') email: string) {
    return this.accountService.forgotPassword(email);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Body('token') token: string,
    @Body('newPassword') newPass: string,
  ) {
    return this.accountService.resetPassword(token, newPass);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() req: AuthenticatedRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.identityService.logout(req.user.sub);
    clearRefreshTokenCookie(res);
    return result;
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = (req.cookies as Record<string, string | undefined>)[
      'refresh_token'
    ];
    if (!refreshToken) {
      throw new UnauthorizedException(AUTH_MESSAGES.ERRORS.REFRESH_TOKEN_NOT_FOUND);
    }

    const { refresh_token, ...data } = await this.identityService.refreshTokens(refreshToken);
    setRefreshTokenCookie(res, refresh_token);
    return data;
  }
}
