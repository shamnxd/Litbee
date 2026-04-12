export interface UserResponse {
  id: string;
  email: string;
  name: string;
  isVerified: boolean;
}

export interface AuthResponse {
  message?: string;
  access_token: string;
  refresh_token: string;
  user: UserResponse;
}
