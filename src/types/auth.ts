export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  isEmailVerified: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
  requiresEmailVerification?: boolean;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordReset {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface EmailVerification {
  token: string;
}

export interface TwoFactorAuth {
  email: string;
  code: string;
} 