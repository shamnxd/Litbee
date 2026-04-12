import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { IdentityService } from './services/identity.service';
import { AccountService } from './services/account.service';
import { GoogleAuthService } from './services/google-auth.service';
import { AuthController } from './auth.controller';
import { User, UserSchema } from './schemas/user.schema';
import { AuthRepository } from './repositories/auth.repository';
import { JwtStrategy } from './strategies/jwt.strategy';
import { OAuth2Client } from 'google-auth-library';
import {
  GOOGLE_OAUTH_CLIENT,
  I_AUTH_REPOSITORY,
  I_IDENTITY_SERVICE,
  I_ACCOUNT_SERVICE,
  I_GOOGLE_AUTH_SERVICE
} from './constants/tokens';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET') ?? 'fallback_secret',
        signOptions: {
          expiresIn: config.get<any>('JWT_ACCESS_TOKEN_EXPIRES_IN') || '15m',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: I_IDENTITY_SERVICE,
      useClass: IdentityService,
    },
    {
      provide: I_ACCOUNT_SERVICE,
      useClass: AccountService,
    },
    {
      provide: I_GOOGLE_AUTH_SERVICE,
      useClass: GoogleAuthService,
    },
    {
      provide: I_AUTH_REPOSITORY,
      useClass: AuthRepository,
    },
    {
      provide: GOOGLE_OAUTH_CLIENT,
      useFactory: (config: ConfigService) => {
        return new OAuth2Client(config.get<string>('GOOGLE_CLIENT_ID'));
      },
      inject: [ConfigService],
    },
    JwtStrategy,
  ],
  controllers: [AuthController],
  exports: [I_IDENTITY_SERVICE],
})
export class AuthModule {}
