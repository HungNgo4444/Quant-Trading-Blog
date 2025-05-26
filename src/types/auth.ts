export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  isEmailVerified: boolean;
  createdAt: string;
  lastLoginAt?: string;
  avatarUrl?: string;
  bio?: string;
  website?: string;
  location?: string;
  phone?: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    marketing: boolean;
  };
  privacy: {
    showEmail: boolean;
    showProfile: boolean;
  };
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
  agreeToTerms?: boolean;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
  requiresEmailVerification?: boolean;
  requiresTwoFactor?: boolean;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordReset {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface PasswordUpdate {
  currentPassword: string;
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

export interface ProfileUpdate {
  name?: string;
  bio?: string;
  website?: string;
  location?: string;
  phone?: string;
}

export interface AccountSecurity {
  twoFactorEnabled: boolean;
  lastPasswordChange?: string;
  loginHistory: LoginHistoryEntry[];
}

export interface LoginHistoryEntry {
  id: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  location?: string;
  success: boolean;
}

export interface AuthError {
  code: string;
  message: string;
  details?: any;
} 