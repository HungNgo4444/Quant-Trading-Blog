import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthState, LoginCredentials, RegisterCredentials, AuthResponse } from '@/types/auth';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  register: (credentials: RegisterCredentials) => Promise<AuthResponse>;
  logout: () => void;
  verifyEmail: (email: string, code: string) => Promise<AuthResponse>;
  resendVerificationCode: (email: string) => Promise<AuthResponse>;
  updateProfile: (data: any) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: false, // Start with false to prevent loading issues
    isAuthenticated: false,
  });

  // Mock functions for now - will implement with Supabase later
  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    console.log('Login attempt:', credentials.email);
    
    // Mock admin login
    if (credentials.email === 'admin@quantblog.com' && credentials.password === 'admin123') {
      const user: User = {
        id: '1',
        email: credentials.email,
        name: 'Admin',
        role: 'admin',
        isEmailVerified: true
      };
      
      setAuthState({
        user,
        isLoading: false,
        isAuthenticated: true,
      });
      
      return {
        success: true,
        message: "Đăng nhập thành công",
        user
      };
    }
    
    return {
      success: false,
      message: "Email hoặc mật khẩu không đúng"
    };
  };

  const register = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    console.log('Register attempt:', credentials.email);
    return {
      success: false,
      message: "Đăng ký tạm thời không khả dụng"
    };
  };

  const logout = () => {
    setAuthState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    });
  };

  const verifyEmail = async (email: string, code: string): Promise<AuthResponse> => {
    return {
      success: false,
      message: "Xác thực email tạm thời không khả dụng"
    };
  };

  const resendVerificationCode = async (email: string): Promise<AuthResponse> => {
    return {
      success: false,
      message: "Gửi lại mã xác thực tạm thời không khả dụng"
    };
  };

  const updateProfile = async (data: any): Promise<void> => {
    console.log('Update profile:', data);
  };

  const updatePassword = async (password: string): Promise<void> => {
    console.log('Update password');
  };

  const deleteAccount = async (): Promise<void> => {
    console.log('Delete account');
    logout();
  };

  const isAdmin = authState.user?.role === 'admin';

  const value: AuthContextType = {
    ...authState,
    login,
    register,
    logout,
    verifyEmail,
    resendVerificationCode,
    updateProfile,
    updatePassword,
    deleteAccount,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 