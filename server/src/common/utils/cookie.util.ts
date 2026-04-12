import type { Response } from 'express';

export function setRefreshTokenCookie(res: Response, refreshToken: string) {
  let maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds fallback
  
  if (process.env.JWT_REFRESH_COOKIE_MAX_AGE_MS) {
    const parsed = parseInt(process.env.JWT_REFRESH_COOKIE_MAX_AGE_MS, 10);
    if (!isNaN(parsed)) {
      maxAge = parsed;
    }
  }

  res.cookie('refresh_token', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: maxAge,
    path: '/',
  });
}

export function clearRefreshTokenCookie(res: Response) {
  res.clearCookie('refresh_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
}
