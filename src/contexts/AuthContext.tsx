import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthState, LoginCredentials, RegisterCredentials, AuthResponse } from '@/types/auth';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  register: (credentials: RegisterCredentials) => Promise<AuthResponse>;
  logout: () => void;
  verifyEmail: (email: string, code: string) => Promise<AuthResponse>;
  resendVerificationCode: (email: string) => Promise<AuthResponse>;
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
    isLoading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Get user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        const user: User = {
          id: session.user.id,
          email: session.user.email!,
          name: profile?.name || 'User',
          role: profile?.role || 'user',
          isEmailVerified: session.user.email_confirmed_at ? true : false
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
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          // Get user profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          const user: User = {
            id: session.user.id,
            email: session.user.email!,
            name: profile?.name || 'User',
            role: profile?.role || 'user',
            isEmailVerified: session.user.email_confirmed_at ? true : false
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
  }, []);

  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        
        const response = {
          success: false,
          message: error.message === 'Invalid login credentials' 
            ? 'Email hoặc mật khẩu không đúng' 
            : 'Có lỗi xảy ra khi đăng nhập'
        };

        toast({
          title: "Đăng nhập thất bại",
          description: response.message,
          variant: "destructive",
        });

        return response;
      }

      if (data.user) {
        toast({
          title: "Đăng nhập thành công",
          description: "Chào mừng bạn quay trở lại!",
        });

        return {
          success: true,
          message: "Đăng nhập thành công",
          user: {
            id: data.user.id,
            email: data.user.email!,
            name: 'User', // Will be updated by auth state listener
            role: 'user',
            isEmailVerified: data.user.email_confirmed_at ? true : false
          }
        };
      }

      return {
        success: false,
        message: "Có lỗi xảy ra khi đăng nhập"
      };
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      
      const errorResponse = {
        success: false,
        message: "Có lỗi xảy ra khi đăng nhập"
      };
      
      toast({
        title: "Lỗi",
        description: errorResponse.message,
        variant: "destructive",
      });
      
      return errorResponse;
    }
  };

  const register = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            name: credentials.name,
            role: 'user'
          }
        }
      });

      setAuthState(prev => ({ ...prev, isLoading: false }));

      if (error) {
        const response = {
          success: false,
          message: error.message === 'User already registered' 
            ? 'Email này đã được đăng ký' 
            : 'Có lỗi xảy ra khi đăng ký'
        };

        toast({
          title: "Đăng ký thất bại",
          description: response.message,
          variant: "destructive",
        });

        return response;
      }

      if (data.user) {
        const response = {
          success: true,
          message: "Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản."
        };

        toast({
          title: "Đăng ký thành công",
          description: response.message,
        });

        return response;
      }

      return {
        success: false,
        message: "Có lỗi xảy ra khi đăng ký"
      };
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      
      const errorResponse = {
        success: false,
        message: "Có lỗi xảy ra khi đăng ký"
      };
      
      toast({
        title: "Lỗi",
        description: errorResponse.message,
        variant: "destructive",
      });
      
      return errorResponse;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    
    toast({
      title: "Đăng xuất thành công",
      description: "Hẹn gặp lại bạn!",
    });
  };

  const verifyEmail = async (email: string, code: string): Promise<AuthResponse> => {
    try {
      // Supabase handles email verification automatically via email links
      // This function is kept for compatibility
      return {
        success: true,
        message: "Email đã được xác thực"
      };
    } catch (error) {
      const errorResponse = {
        success: false,
        message: "Có lỗi xảy ra khi xác thực email"
      };
      
      toast({
        title: "Lỗi",
        description: errorResponse.message,
        variant: "destructive",
      });
      
      return errorResponse;
    }
  };

  const resendVerificationCode = async (email: string): Promise<AuthResponse> => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email
      });

      if (error) {
        const response = {
          success: false,
          message: "Có lỗi xảy ra khi gửi lại email xác thực"
        };

        toast({
          title: "Gửi mã thất bại",
          description: response.message,
          variant: "destructive",
        });

        return response;
      }

      const response = {
        success: true,
        message: "Email xác thực đã được gửi lại"
      };

      toast({
        title: "Gửi mã thành công",
        description: response.message,
      });

      return response;
    } catch (error) {
      const errorResponse = {
        success: false,
        message: "Có lỗi xảy ra khi gửi lại email xác thực"
      };
      
      toast({
        title: "Lỗi",
        description: errorResponse.message,
        variant: "destructive",
      });
      
      return errorResponse;
    }
  };

  const isAdmin = authState.user?.role === 'admin';

  const value: AuthContextType = {
    ...authState,
    login,
    register,
    logout,
    verifyEmail,
    resendVerificationCode,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 