import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthState, LoginCredentials, RegisterCredentials, AuthResponse } from '@/types/auth';
import { isSupabaseConfigured } from '@/config/supabase';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  register: (credentials: RegisterCredentials) => Promise<AuthResponse>;
  logout: () => void;
  verifyEmail: (email: string, code: string) => Promise<AuthResponse>;
  resendVerificationCode: (email: string) => Promise<AuthResponse>;
  resetPassword: (email: string) => Promise<AuthResponse>;
  updatePassword: (password: string) => Promise<AuthResponse>;
  updateProfile: (data: any) => Promise<void>;
  deleteAccount: () => Promise<void>;
  isAdmin: boolean;
  isSupabaseEnabled: boolean;
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
    isLoading: false,
    isAuthenticated: false,
  });

  const isSupabaseEnabled = isSupabaseConfigured();
  
  // Get current site URL for redirects
  const getCurrentSiteUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    return 'http://localhost:8080';
  };
  
  // Lazy load Supabase only when needed and available
  const getSupabase = async () => {
    if (!isSupabaseEnabled) {
      throw new Error('Supabase not configured - please check .env file');
    }
    
    try {
      const { supabase } = await import('@/lib/supabase');
      return supabase;
    } catch (error) {
      console.error('Failed to load Supabase:', error);
      throw new Error('Failed to connect to database: ' + (error as Error).message);
    }
  };

  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      if (!isSupabaseEnabled) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return {
          success: false,
          message: "Database không khả dụng. Vui lòng kiểm tra cấu hình Supabase."
        };
      }

      const supabase = await getSupabase();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        
        // Handle specific auth errors
        if (error.message.includes('Email not confirmed')) {
          return {
            success: false,
            message: "Email chưa được xác thực. Vui lòng kiểm tra email và xác thực tài khoản trước khi đăng nhập.",
            requiresEmailVerification: true
          };
        }
        
        return {
          success: false,
          message: error.message === 'Invalid login credentials' 
            ? "Email hoặc mật khẩu không đúng" 
            : error.message
        };
      }

      if (data.user) {
        // Get user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        const user: User = {
          id: data.user.id,
          email: data.user.email!,
          name: profile?.name || data.user.email!.split('@')[0],
          role: profile?.role || 'user',
          isEmailVerified: data.user.email_confirmed_at !== null
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
    } catch (error) {
      console.error('Login error:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return {
        success: false,
        message: "Đã xảy ra lỗi khi đăng nhập: " + (error as Error).message
      };
    }

    setAuthState(prev => ({ ...prev, isLoading: false }));
    return {
      success: false,
      message: "Đăng nhập thất bại"
    };
  };

  const register = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    try {
      const supabase = await getSupabase();
      
      // Register with email confirmation
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            name: credentials.name,
          },
          emailRedirectTo: `${getCurrentSiteUrl()}/auth?tab=login&verified=true`
        }
      });

      if (error) {
        return {
          success: false,
          message: error.message === 'User already registered' 
            ? "Email này đã được đăng ký. Vui lòng sử dụng email khác hoặc đăng nhập."
            : error.message
        };
      }

      // Check if user needs email confirmation
      if (data.user && !data.user.email_confirmed_at) {
        return {
          success: true,
          message: "Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản trước khi đăng nhập.",
          requiresEmailVerification: true
        };
      }

      return {
        success: true,
        message: "Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ."
      };
    } catch (error) {
      console.error('Register error:', error);
      return {
        success: false,
        message: "Đã xảy ra lỗi khi đăng ký: " + (error as Error).message
      };
    }
  };

  const logout = async () => {
    try {
      const supabase = await getSupabase();
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    setAuthState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    });
  };

  const verifyEmail = async (email: string, code: string): Promise<AuthResponse> => {
    try {
      const supabase = await getSupabase();
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: code,
        type: 'signup'
      });

      if (error) {
        return {
          success: false,
          message: error.message === 'Token has expired or is invalid'
            ? "Mã xác thực đã hết hạn hoặc không hợp lệ. Vui lòng yêu cầu mã mới."
            : error.message
        };
      }

      return {
        success: true,
        message: "Email đã được xác thực thành công! Bạn có thể đăng nhập ngay bây giờ."
      };
    } catch (error) {
      console.error('Email verification error:', error);
      return {
        success: false,
        message: "Đã xảy ra lỗi khi xác thực email: " + (error as Error).message
      };
    }
  };

  const resendVerificationCode = async (email: string): Promise<AuthResponse> => {
    try {
      const supabase = await getSupabase();
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${getCurrentSiteUrl()}/auth?tab=login&verified=true`
        }
      });

      if (error) {
        return {
          success: false,
          message: error.message
        };
      }

      return {
        success: true,
        message: "Mã xác thực đã được gửi lại đến email của bạn"
      };
    } catch (error) {
      console.error('Resend verification error:', error);
      return {
        success: false,
        message: "Đã xảy ra lỗi khi gửi lại mã xác thực: " + (error as Error).message
      };
    }
  };

  const resetPassword = async (email: string): Promise<AuthResponse> => {
    try {
      const supabase = await getSupabase();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${getCurrentSiteUrl()}/reset-password`
      });

      if (error) {
        return {
          success: false,
          message: error.message
        };
      }

      return {
        success: true,
        message: "Link đặt lại mật khẩu đã được gửi đến email của bạn"
      };
    } catch (error) {
      console.error('Reset password error:', error);
      return {
        success: false,
        message: "Đã xảy ra lỗi khi gửi link đặt lại mật khẩu: " + (error as Error).message
      };
    }
  };

  const updatePassword = async (password: string): Promise<AuthResponse> => {
    try {
      const supabase = await getSupabase();
      const { data, error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        return {
          success: false,
          message: error.message === 'New password should be different from the old password'
            ? "Mật khẩu mới phải khác với mật khẩu cũ"
            : error.message
        };
      }

      return {
        success: true,
        message: "Mật khẩu đã được cập nhật thành công"
      };
    } catch (error) {
      console.error('Update password error:', error);
      return {
        success: false,
        message: "Đã xảy ra lỗi khi cập nhật mật khẩu: " + (error as Error).message
      };
    }
  };

  const updateProfile = async (data: any): Promise<void> => {
    try {
      const supabase = await getSupabase();
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', authState.user?.id);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  };

  const deleteAccount = async (): Promise<void> => {
    try {
      const supabase = await getSupabase();
      // Note: Supabase doesn't have a direct delete user method
      // This would typically be handled by a server function
      console.log('Account deletion requested');
      logout();
    } catch (error) {
      console.error('Delete account error:', error);
      throw error;
    }
  };

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const supabase = await getSupabase();
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          const user: User = {
            id: session.user.id,
            email: session.user.email!,
            name: profile?.name || session.user.email!.split('@')[0],
            role: profile?.role || 'user',
            isEmailVerified: session.user.email_confirmed_at !== null
          };

          setAuthState({
            user,
            isLoading: false,
            isAuthenticated: true,
          });
        }

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log('Auth state changed:', event, session?.user?.email);
            
            if (session?.user) {
              const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();

              const user: User = {
                id: session.user.id,
                email: session.user.email!,
                name: profile?.name || session.user.email!.split('@')[0],
                role: profile?.role || 'user',
                isEmailVerified: session.user.email_confirmed_at !== null
              };

              setAuthState({
                user,
                isLoading: false,
                isAuthenticated: true,
              });
            } else {
              setAuthState({
                user: null,
                isLoading: false,
                isAuthenticated: false,
              });
            }
          }
        );

        return () => subscription.unsubscribe();
      } catch (error) {
        console.error('Auth initialization error:', error);
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    };

    initializeAuth();
  }, []);

  const isAdmin = authState.user?.role === 'admin';

  const value: AuthContextType = {
    ...authState,
    login,
    register,
    logout,
    verifyEmail,
    resendVerificationCode,
    resetPassword,
    updatePassword,
    updateProfile,
    deleteAccount,
    isAdmin,
    isSupabaseEnabled,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 