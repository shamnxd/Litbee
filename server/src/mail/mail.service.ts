import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { verificationOtpTemplate } from './templates/verification-otp.template';
import { resetPasswordTemplate } from './templates/reset-password.template';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      secure: this.configService.get<boolean>('SMTP_SECURE', false),
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    });
  }

  async sendVerificationOtp(email: string, otp: string) {
    try {
      await this.transporter.sendMail({
        from: `"Litbee Auth" <${this.configService.get<string>('SMTP_USER')}>`,
        to: email,
        subject: 'Email Verification OTP',
        text: `Your OTP for Litbee account verification is: ${otp}. It will expire in 5 minutes.`,
        html: verificationOtpTemplate(otp),
      });
    } catch (error) {
      console.error('Nodemailer error:', error);
      throw new InternalServerErrorException(
        'Failed to send verification email',
      );
    }
  }

  async sendResetPasswordEmail(email: string, resetUrl: string) {
    try {
      await this.transporter.sendMail({
        from: `"Litbee Support" <${this.configService.get<string>('SMTP_USER')}>`,
        to: email,
        subject: 'Reset Password',
        text: `You requested a password reset. Click here to reset: ${resetUrl}`,
        html: resetPasswordTemplate(resetUrl),
      });
    } catch (error) {
      console.error('Nodemailer error:', error);
      throw new InternalServerErrorException(
        'Failed to send reset password email',
      );
    }
  }
}
