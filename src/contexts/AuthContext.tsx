import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthState, LoginCredentials, RegisterCredentials, AuthResponse } from '@/types/auth';
import { isSupabaseConfigured } from '@/config/supabase';

interface AuthContextType extends AuthState {
  // Authentication
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  register: (credentials: RegisterCredentials) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  
  // Email verification
  verifyEmail: (token: string) => Promise<AuthResponse>;
  resendVerificationEmail: (email?: string) => Promise<AuthResponse>;
  
  // Password management
  resetPassword: (email: string) => Promise<AuthResponse>;
  updatePassword: (newPassword: string, currentPassword?: string) => Promise<AuthResponse>;
  
  // Profile management
  updateProfile: (data: Partial<User>) => Promise<AuthResponse>;
  uploadAvatar: (file: File) => Promise<AuthResponse>;
  deleteAccount: () => Promise<AuthResponse>;
  
  // Account verification
  checkEmailVerification: () => Promise<boolean>;
  
  // Utility
  isAdmin: boolean;
  isSupabaseEnabled: boolean;
  refreshUser: () => Promise<void>;
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
      throw new Error('Supabase chưa được cấu hình - vui lòng kiểm tra file .env');
    }
    
    try {
      const { supabase } = await import('@/lib/supabase');
      return supabase;
    } catch (error) {
      console.error('Failed to load Supabase:', error);
      throw new Error('Không thể kết nối database: ' + (error as Error).message);
    }
  };

  // Helper function to create user object from Supabase data
  const createUserFromSupabaseData = async (supabaseUser: any, profile?: any) => {
    const user: User = {
      id: supabaseUser.id,
      email: supabaseUser.email!,
      name: profile?.name || supabaseUser.user_metadata?.name || supabaseUser.email!.split('@')[0],
      role: profile?.role || 'user',
      isEmailVerified: supabaseUser.email_confirmed_at !== null,
      createdAt: supabaseUser.created_at,
      lastLoginAt: profile?.last_login_at || new Date().toISOString()
    };
    return user;
  };

  // Login function
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
        
        if (error.message.includes('Invalid login credentials')) {
          return {
            success: false,
            message: "Email hoặc mật khẩu không đúng. Vui lòng kiểm tra lại thông tin đăng nhập."
          };
        }
        
        return {
          success: false,
          message: `Lỗi đăng nhập: ${error.message}`
        };
      }

      if (data.user) {
        // Get user profile and update last login
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (!profileError && profile) {
          // Update last login time
          await supabase
            .from('profiles')
            .update({ last_login_at: new Date().toISOString() })
            .eq('id', data.user.id);
        }

        const user = await createUserFromSupabaseData(data.user, profile);

        setAuthState({
          user,
          isLoading: false,
          isAuthenticated: true,
        });

        return {
          success: true,
          message: "Đăng nhập thành công! Chào mừng bạn quay trở lại.",
          user
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return {
        success: false,
        message: "Đã xảy ra lỗi không mong muốn khi đăng nhập. Vui lòng thử lại sau."
      };
    }

    setAuthState(prev => ({ ...prev, isLoading: false }));
    return {
      success: false,
      message: "Đăng nhập thất bại. Vui lòng thử lại."
    };
  };

  // Register function
  const register = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
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
      
      // Register with email confirmation
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            name: credentials.name,
          },
          emailRedirectTo: `${getCurrentSiteUrl()}/auth?verified=true`
        }
      });

      setAuthState(prev => ({ ...prev, isLoading: false }));

      if (error) {
        if (error.message.includes('User already registered')) {
          return {
            success: false,
            message: "Email này đã được đăng ký. Vui lòng sử dụng email khác hoặc đăng nhập nếu đây là tài khoản của bạn."
          };
        }
        
        if (error.message.includes('Password should be at least')) {
          return {
            success: false,
            message: "Mật khẩu phải có ít nhất 6 ký tự. Vui lòng chọn mật khẩu mạnh hơn."
          };
        }
        
        return {
          success: false,
          message: `Lỗi đăng ký: ${error.message}`
        };
      }

      // Create profile in database
      if (data.user) {
        try {
          await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              email: data.user.email,
              name: credentials.name,
              role: 'user',
              is_email_verified: false,
              created_at: new Date().toISOString()
            });
        } catch (profileError) {
          console.warn('Could not create profile:', profileError);
        }
      }

      // Check if user needs email confirmation
      if (data.user && !data.user.email_confirmed_at) {
        return {
          success: true,
          message: "Đăng ký thành công! Chúng tôi đã gửi email xác thực đến địa chỉ của bạn. Vui lòng kiểm tra email và nhấp vào liên kết để kích hoạt tài khoản.",
          requiresEmailVerification: true
        };
      }

      return {
        success: true,
        message: "Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ."
      };
    } catch (error) {
      console.error('Register error:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return {
        success: false,
        message: "Đã xảy ra lỗi không mong muốn khi đăng ký. Vui lòng thử lại sau."
      };
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      if (isSupabaseEnabled) {
        const supabase = await getSupabase();
        await supabase.auth.signOut();
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  };

  // Email verification
  const verifyEmail = async (token: string): Promise<AuthResponse> => {
    try {
      const supabase = await getSupabase();
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'email'
      });

      if (error) {
        return {
          success: false,
          message: `Lỗi xác thực email: ${error.message}`
        };
      }

      if (data.user) {
        // Update profile verification status
        await supabase
          .from('profiles')
          .update({ 
            is_email_verified: true,
            email_verified_at: new Date().toISOString()
          })
          .eq('id', data.user.id);

        return {
          success: true,
          message: "Email đã được xác thực thành công! Bạn có thể đăng nhập ngay bây giờ."
        };
      }

      return {
        success: false,
        message: "Không thể xác thực email. Vui lòng thử lại."
      };
    } catch (error) {
      console.error('Email verification error:', error);
      return {
        success: false,
        message: "Đã xảy ra lỗi khi xác thực email. Vui lòng thử lại sau."
      };
    }
  };

  // Resend verification email
  const resendVerificationEmail = async (email?: string): Promise<AuthResponse> => {
    try {
      const supabase = await getSupabase();
      const targetEmail = email || authState.user?.email;
      
      if (!targetEmail) {
        return {
          success: false,
          message: "Không tìm thấy email để gửi lại xác thực."
        };
      }

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: targetEmail,
        options: {
          emailRedirectTo: `${getCurrentSiteUrl()}/auth?verified=true`
        }
      });

      if (error) {
        return {
          success: false,
          message: `Lỗi gửi lại email: ${error.message}`
        };
      }

      return {
        success: true,
        message: "Email xác thực đã được gửi lại. Vui lòng kiểm tra hộp thư của bạn."
      };
    } catch (error) {
      console.error('Resend verification error:', error);
      return {
        success: false,
        message: "Đã xảy ra lỗi khi gửi lại email xác thực. Vui lòng thử lại sau."
      };
    }
  };

  // Reset password
  const resetPassword = async (email: string): Promise<AuthResponse> => {
    try {
      const supabase = await getSupabase();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${getCurrentSiteUrl()}/auth?tab=reset-password`
      });

      if (error) {
        return {
          success: false,
          message: `Lỗi gửi email đặt lại mật khẩu: ${error.message}`
        };
      }

      return {
        success: true,
        message: "Email đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư và làm theo hướng dẫn."
      };
    } catch (error) {
      console.error('Reset password error:', error);
      return {
        success: false,
        message: "Đã xảy ra lỗi khi gửi email đặt lại mật khẩu. Vui lòng thử lại sau."
      };
    }
  };

  // Update password
  const updatePassword = async (newPassword: string, currentPassword?: string): Promise<AuthResponse> => {
    try {
      const supabase = await getSupabase();
      
      // If current password is provided, verify it first
      if (currentPassword && authState.user) {
        const { error: verifyError } = await supabase.auth.signInWithPassword({
          email: authState.user.email,
          password: currentPassword
        });
        
        if (verifyError) {
          return {
            success: false,
            message: "Mật khẩu hiện tại không đúng."
          };
        }
      }

      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        return {
          success: false,
          message: `Lỗi cập nhật mật khẩu: ${error.message}`
        };
      }

      return {
        success: true,
        message: "Mật khẩu đã được cập nhật thành công."
      };
    } catch (error) {
      console.error('Update password error:', error);
      return {
        success: false,
        message: "Đã xảy ra lỗi khi cập nhật mật khẩu. Vui lòng thử lại sau."
      };
    }
  };

  // Update profile
  const updateProfile = async (data: Partial<User>): Promise<AuthResponse> => {
    try {
      const supabase = await getSupabase();
      
      if (!authState.user) {
        return {
          success: false,
          message: "Bạn cần đăng nhập để cập nhật thông tin."
        };
      }

      // Update user metadata in auth
      const authUpdates: any = {};
      if (data.name) authUpdates.name = data.name;
      
      if (Object.keys(authUpdates).length > 0) {
        const { error: authError } = await supabase.auth.updateUser({
          data: authUpdates
        });
        
        if (authError) {
          return {
            success: false,
            message: `Lỗi cập nhật thông tin xác thực: ${authError.message}`
          };
        }
      }

      // Update profile in database
      const profileUpdates: any = {};
      if (data.name) profileUpdates.name = data.name;
      profileUpdates.updated_at = new Date().toISOString();

      const { error: profileError } = await supabase
        .from('profiles')
        .update(profileUpdates)
        .eq('id', authState.user.id);

      if (profileError) {
        return {
          success: false,
          message: `Lỗi cập nhật hồ sơ: ${profileError.message}`
        };
      }

      // Update local state
      setAuthState(prev => ({
        ...prev,
        user: prev.user ? { ...prev.user, ...data } : null
      }));

      return {
        success: true,
        message: "Thông tin hồ sơ đã được cập nhật thành công."
      };
    } catch (error) {
      console.error('Update profile error:', error);
      return {
        success: false,
        message: "Đã xảy ra lỗi khi cập nhật hồ sơ. Vui lòng thử lại sau."
      };
    }
  };

  // Upload avatar (placeholder - implementation depends on storage setup)
  const uploadAvatar = async (file: File): Promise<AuthResponse> => {
    try {
      const supabase = await getSupabase();
      
      if (!authState.user) {
        return {
          success: false,
          message: "Bạn cần đăng nhập để tải lên avatar."
        };
      }

      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${authState.user.id}-${Date.now()}.${fileExt}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);

      if (uploadError) {
        return {
          success: false,
          message: `Lỗi tải lên avatar: ${uploadError.message}`
        };
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Update profile with avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', authState.user.id);

      if (updateError) {
        return {
          success: false,
          message: `Lỗi cập nhật avatar: ${updateError.message}`
        };
      }

      return {
        success: true,
        message: "Avatar đã được cập nhật thành công."
      };
    } catch (error) {
      console.error('Upload avatar error:', error);
      return {
        success: false,
        message: "Đã xảy ra lỗi khi tải lên avatar. Vui lòng thử lại sau."
      };
    }
  };

  // Delete account
  const deleteAccount = async (): Promise<AuthResponse> => {
    try {
      const supabase = await getSupabase();
      
      if (!authState.user) {
        return {
          success: false,
          message: "Bạn cần đăng nhập để xóa tài khoản."
        };
      }

      // Note: Supabase doesn't provide direct user deletion from client
      // This would typically require an admin function or RPC call
      // For now, we'll mark the profile as deleted
      const { error } = await supabase
        .from('profiles')
        .update({ 
          deleted_at: new Date().toISOString(),
          email: `deleted_${Date.now()}@deleted.com`,
          name: 'Deleted User'
        })
        .eq('id', authState.user.id);

      if (error) {
        return {
          success: false,
          message: `Lỗi xóa tài khoản: ${error.message}`
        };
      }

      // Sign out the user
      await logout();

      return {
        success: true,
        message: "Tài khoản đã được xóa thành công."
      };
    } catch (error) {
      console.error('Delete account error:', error);
      return {
        success: false,
        message: "Đã xảy ra lỗi khi xóa tài khoản. Vui lòng thử lại sau."
      };
    }
  };

  // Check email verification status
  const checkEmailVerification = async (): Promise<boolean> => {
    try {
      if (!authState.user) return false;
      
      const supabase = await getSupabase();
      const { data } = await supabase.auth.getUser();
      
      return data.user?.email_confirmed_at !== null;
    } catch (error) {
      console.error('Check email verification error:', error);
      return false;
    }
  };

  // Refresh user data
  const refreshUser = async (): Promise<void> => {
    try {
      if (!isSupabaseEnabled) return;
      
      const supabase = await getSupabase();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        const updatedUser = await createUserFromSupabaseData(user, profile);
        
        setAuthState(prev => ({
          ...prev,
          user: updatedUser,
          isAuthenticated: true
        }));
      }
    } catch (error) {
      console.error('Refresh user error:', error);
    }
  };

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      if (!isSupabaseEnabled) {
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        });
        return;
      }

      try {
        const supabase = await getSupabase();
        
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          const user = await createUserFromSupabaseData(session.user, profile);
          
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

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (session?.user) {
              const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();

              const user = await createUserFromSupabaseData(session.user, profile);
              
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
  }, [isSupabaseEnabled]);

  const isAdmin = authState.user?.role === 'admin';

  const value: AuthContextType = {
    ...authState,
    login,
    register,
    logout,
    verifyEmail,
    resendVerificationEmail,
    resetPassword,
    updatePassword,
    updateProfile,
    uploadAvatar,
    deleteAccount,
    checkEmailVerification,
    refreshUser,
    isAdmin,
    isSupabaseEnabled,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 