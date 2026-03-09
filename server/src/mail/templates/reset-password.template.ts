export const resetPasswordTemplate = (resetUrl: string): string => `
<div style="font-family: 'Inter', Arial, sans-serif; padding: 40px; background-color: #f9fafb; display: flex; justify-content: center; align-items: center;">
  <div style="background-color: #ffffff; padding: 40px; border-radius: 20px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); max-width: 500px; width: 100%; border: 1px solid #e5e7eb;">
    <div style="text-align: center; margin-bottom: 30px;">
       <div style="display: inline-block; padding: 12px; background: #fff7ed; border-radius: 12px; margin-bottom: 20px;">
          <h2 style="margin: 0; color: #f59e0b; font-size: 24px; font-weight: 800; letter-spacing: -0.025em;">Litbee</h2>
       </div>
       <h1 style="color: #111827; font-size: 24px; font-weight: 800; margin: 0; letter-spacing: -0.025em;">Reset your password</h1>
       <p style="color: #6b7280; font-size: 16px; margin-top: 10px;">We received a request to reset your Litbee password. Click the button below to choose a new one.</p>
    </div>

    <div style="text-align: center; margin-bottom: 30px;">
      <a href="${resetUrl}" style="background-color: #0a0a0a; color: #ffffff; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: 700; display: inline-block; transition: background-color 0.2s;">Reset Password</a>
    </div>

    <div style="text-align: center; color: #9ca3af; font-size: 14px; line-height: 1.6;">
      <p>This link will expire in <strong style="color: #4b5563;">1 hour</strong>.</p>
      <p>If you didn't request a password reset, you can safely ignore this email.</p>
    </div>

    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #f3f4f6; text-align: center;">
      <p style="color: #9ca3af; font-size: 12px;">&copy; ${new Date().getFullYear()} Litbee Inc. All rights reserved.</p>
    </div>
  </div>
</div>
`;
