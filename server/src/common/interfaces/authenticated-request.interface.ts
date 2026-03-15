import { Request } from 'express';

export interface AuthenticatedUser {
  userId: string;
  email: string;
  sub: string;
}

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}
