import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import * as bcrypt from 'bcrypt';
import {
  GOOGLE_OAUTH_CLIENT,
  I_AUTH_REPOSITORY,
  I_IDENTITY_SERVICE
} from '../constants/tokens';
import { IGoogleAuthService } from '../interfaces/google-auth.service.interface';
import { GoogleUserProfile } from '../dto/google-user-profile.dto';
import { AUTH_MESSAGES } from '../../common/constants/messages';
import type { IAuthRepository } from '../interfaces/auth.repository.interface';
import type { IIdentityService } from '../interfaces/identity.service.interface';
import { AuthResponse } from '../dto/auth-response.dto';

@Injectable()
export class GoogleAuthService implements IGoogleAuthService {
  constructor(
    @Inject(GOOGLE_OAUTH_CLIENT) private readonly _googleClient: OAuth2Client,
    @Inject(I_AUTH_REPOSITORY) private readonly _authRepository: IAuthRepository,
    @Inject(I_IDENTITY_SERVICE) private readonly _identityService: IIdentityService,
    private readonly _configService: ConfigService,
  ) { }

  async verifyToken(token: string): Promise<GoogleUserProfile> {
    try {
      let email: string | undefined;
      let name: string | undefined;

      try {
        const ticket = await this._googleClient.verifyIdToken({
          idToken: token,
          audience: this._configService.get<string>('GOOGLE_CLIENT_ID'),
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
          throw new UnauthorizedException(AUTH_MESSAGES.ERRORS.INVALID_GOOGLE_TOKEN);
        }
      }

      if (!email) {
        throw new UnauthorizedException(AUTH_MESSAGES.ERRORS.GOOGLE_AUTH_FAILED);
      }

      return { email, name };
    } catch (error) {
      throw new UnauthorizedException(AUTH_MESSAGES.ERRORS.GOOGLE_AUTH_FAILED);
    }
  }

  async login(token: string): Promise<AuthResponse> {
    const { email, name } = await this.verifyToken(token);

    let user = await this._authRepository.findOne({ email });

    if (!user) {
      const randomPassword = await bcrypt.hash(
        Math.random().toString(36),
        10,
      );
      user = await this._authRepository.create({
        email,
        name: name ?? email,
        password: randomPassword,
        isVerified: true
      });
    } else if (!user.isVerified) {
      const updatedUser = await this._authRepository.findByIdAndUpdate(user._id.toString(), {
        $set: { isVerified: true }
      });
      if (updatedUser) user = updatedUser;
    }

    return this._identityService.issueTokens(user);
  }
}
