export const verificationOtpTemplate = (otp: string): string => `
<div style="font-family: 'Inter', Arial, sans-serif; padding: 40px; background-color: #f9fafb; display: flex; justify-content: center; align-items: center;">
  <div style="background-color: #ffffff; padding: 40px; border-radius: 20px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); max-width: 500px; width: 100%; border: 1px solid #e5e7eb;">
    <div style="text-align: center; margin-bottom: 30px;">
       <div style="display: inline-block; padding: 12px; background: #fff7ed; border-radius: 12px; margin-bottom: 20px;">
          <h2 style="margin: 0; color: #f59e0b; font-size: 24px; font-weight: 800; letter-spacing: -0.025em;">Litbee</h2>
       </div>
       <h1 style="color: #111827; font-size: 24px; font-weight: 800; margin: 0; letter-spacing: -0.025em;">Verify your account</h1>
       <p style="color: #6b7280; font-size: 16px; margin-top: 10px;">To complete your registration, please use the following one-time password (OTP).</p>
    </div>

    <div style="background-color: #fefce8; border: 2px dashed #fcd34d; padding: 30px; border-radius: 16px; text-align: center; margin-bottom: 30px;">
      <span style="font-size: 36px; font-weight: 900; letter-spacing: 0.25em; color: #92400e; font-family: monospace;">${otp}</span>
    </div>

    <div style="text-align: center; color: #9ca3af; font-size: 14px; line-height: 1.6;">
      <p>This code will expire in <strong style="color: #4b5563;">5 minutes</strong>.</p>
      <p>If you didn't request this code, you can safely ignore this email.</p>
    </div>

    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #f3f4f6; text-align: center;">
      <p style="color: #9ca3af; font-size: 12px;">&copy; ${new Date().getFullYear()} Litbee Inc. All rights reserved.</p>
    </div>
  </div>
</div>
`;
