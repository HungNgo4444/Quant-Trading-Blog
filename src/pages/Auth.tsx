import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Loader2, 
  Mail, 
  Lock, 
  User, 
  ArrowLeft, 
  Shield, 
  Eye, 
  EyeOff,
  CheckCircle,
  AlertCircle,
  Home,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { LoginCredentials, RegisterCredentials, PasswordUpdate } from '@/types/auth';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { 
    login, 
    register, 
    resetPassword, 
    updatePassword,
    resendVerificationEmail,
    isLoading,
    isAuthenticated,
    user
  } = useAuth();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Check if user is already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  // Handle URL params for verification success
  useEffect(() => {
    const verified = searchParams.get('verified');
    if (verified === 'true') {
      toast({
        title: "Email đã được xác thực!",
        description: "Tài khoản của bạn đã được kích hoạt thành công. Bạn có thể đăng nhập ngay bây giờ.",
      });
      setActiveTab('login');
    }
  }, [searchParams, toast]);
  
  // Login form state
  const [loginForm, setLoginForm] = useState<LoginCredentials>({
    email: '',
    password: '',
    rememberMe: false
  });
  
  // Register form state
  const [registerForm, setRegisterForm] = useState<RegisterCredentials>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  
  // Forgot password form state
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordSent, setForgotPasswordSent] = useState(false);
  
  // Reset password form state (when coming from email link)
  const [resetPasswordForm, setResetPasswordForm] = useState<PasswordUpdate>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Password strength validation
  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return {
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar,
      isValid: minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar
    };
  };

  const passwordStrength = validatePassword(registerForm.password);

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await login(loginForm);
      if (response.success) {
        toast({
          title: "Đăng nhập thành công!",
          description: response.message || "Chào mừng bạn quay trở lại!",
        });
        navigate('/', { replace: true });
      } else {
        if (response.requiresEmailVerification) {
          setActiveTab('verify-email');
        }
        toast({
          title: "Đăng nhập thất bại",
          description: response.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Lỗi đăng nhập",
        description: "Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle register
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (registerForm.password !== registerForm.confirmPassword) {
      toast({
        title: "Lỗi xác nhận mật khẩu",
        description: "Mật khẩu và xác nhận mật khẩu không khớp",
        variant: "destructive",
      });
      return;
    }
    
    if (!passwordStrength.isValid) {
      toast({
        title: "Mật khẩu không đủ mạnh",
        description: "Vui lòng chọn mật khẩu theo yêu cầu bảo mật",
        variant: "destructive",
      });
      return;
    }
    
    if (!registerForm.agreeToTerms) {
      toast({
        title: "Chưa đồng ý điều khoản",
        description: "Bạn cần đồng ý với điều khoản sử dụng để đăng ký",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await register(registerForm);
      if (response.success) {
        if (response.requiresEmailVerification) {
          setActiveTab('verify-email');
        } else {
          setActiveTab('login');
        }
        toast({
          title: "Đăng ký thành công!",
          description: response.message,
        });
      } else {
        toast({
          title: "Đăng ký thất bại",
          description: response.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Lỗi đăng ký",
        description: "Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle forgot password
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await resetPassword(forgotPasswordEmail);
      if (response.success) {
        setForgotPasswordSent(true);
        toast({
          title: "Email đã được gửi!",
          description: response.message,
        });
      } else {
        toast({
          title: "Lỗi gửi email",
          description: response.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Đã xảy ra lỗi khi gửi email. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle resend verification email
  const handleResendVerification = async () => {
    setIsSubmitting(true);
    
    try {
      const response = await resendVerificationEmail(registerForm.email || loginForm.email);
      if (response.success) {
        toast({
          title: "Email đã được gửi lại!",
          description: response.message,
        });
      } else {
        toast({
          title: "Lỗi gửi email",
          description: response.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Đã xảy ra lỗi khi gửi email. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Password strength indicator component
  const PasswordStrengthIndicator = ({ password }: { password: string }) => {
    const strength = validatePassword(password);
    
    if (!password) return null;
    
    return (
      <div className="mt-2 space-y-2">
        <div className="text-xs text-gray-600">Yêu cầu mật khẩu:</div>
        <div className="space-y-1 text-xs">
          <div className={`flex items-center gap-2 ${strength.minLength ? 'text-green-600' : 'text-red-600'}`}>
            {strength.minLength ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
            Ít nhất 8 ký tự
          </div>
          <div className={`flex items-center gap-2 ${strength.hasUpperCase ? 'text-green-600' : 'text-red-600'}`}>
            {strength.hasUpperCase ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
            Chữ hoa (A-Z)
          </div>
          <div className={`flex items-center gap-2 ${strength.hasLowerCase ? 'text-green-600' : 'text-red-600'}`}>
            {strength.hasLowerCase ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
            Chữ thường (a-z)
          </div>
          <div className={`flex items-center gap-2 ${strength.hasNumbers ? 'text-green-600' : 'text-red-600'}`}>
            {strength.hasNumbers ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
            Số (0-9)
          </div>
          <div className={`flex items-center gap-2 ${strength.hasSpecialChar ? 'text-green-600' : 'text-red-600'}`}>
            {strength.hasSpecialChar ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
            Ký tự đặc biệt (!@#$%^&*)
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Quantitative Trading Blog
              </CardTitle>
              <CardDescription className="text-gray-600">
                {activeTab === 'login' && "Chào mừng bạn quay trở lại"}
                {activeTab === 'register' && "Tạo tài khoản mới để bắt đầu"}
                {activeTab === 'forgot-password' && "Khôi phục mật khẩu của bạn"}
                {activeTab === 'verify-email' && "Xác thực email của bạn"}
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="login" className="text-sm">Đăng nhập</TabsTrigger>
                <TabsTrigger value="register" className="text-sm">Đăng ký</TabsTrigger>
                <TabsTrigger value="forgot-password" className="text-sm">Quên MK</TabsTrigger>
              </TabsList>

              {/* Login Tab */}
              <TabsContent value="login" className="space-y-6">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-sm font-medium">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                        className="pl-10"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-sm font-medium">Mật khẩu</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Nhập mật khẩu của bạn"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                        className="pl-10 pr-10"
                        required
                        disabled={isSubmitting}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        disabled={isSubmitting}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remember-me"
                        checked={loginForm.rememberMe}
                        onCheckedChange={(checked) => 
                          setLoginForm(prev => ({ ...prev, rememberMe: !!checked }))
                        }
                        disabled={isSubmitting}
                      />
                      <Label htmlFor="remember-me" className="text-sm text-gray-600">
                        Ghi nhớ đăng nhập
                      </Label>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setActiveTab('forgot-password')}
                      className="text-blue-600 hover:text-blue-700 p-0 h-auto"
                      disabled={isSubmitting}
                    >
                      Quên mật khẩu?
                    </Button>
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Đăng nhập
                  </Button>
                </form>
                
                <div className="text-center">
                  <span className="text-sm text-gray-600">Chưa có tài khoản? </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveTab('register')}
                    className="text-blue-600 hover:text-blue-700 p-0 h-auto"
                    disabled={isSubmitting}
                  >
                    Đăng ký ngay
                  </Button>
                </div>
              </TabsContent>

              {/* Register Tab */}
              <TabsContent value="register" className="space-y-6">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name" className="text-sm font-medium">Họ và tên</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-name"
                        type="text"
                        placeholder="Nguyễn Văn A"
                        value={registerForm.name}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, name: e.target.value }))}
                        className="pl-10"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-email" className="text-sm font-medium">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={registerForm.email}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
                        className="pl-10"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-password" className="text-sm font-medium">Mật khẩu</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Tạo mật khẩu mạnh"
                        value={registerForm.password}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                        className="pl-10 pr-10"
                        required
                        disabled={isSubmitting}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        disabled={isSubmitting}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    <PasswordStrengthIndicator password={registerForm.password} />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-confirm-password" className="text-sm font-medium">Xác nhận mật khẩu</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Nhập lại mật khẩu"
                        value={registerForm.confirmPassword}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="pl-10 pr-10"
                        required
                        disabled={isSubmitting}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        disabled={isSubmitting}
                      >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {registerForm.confirmPassword && registerForm.password !== registerForm.confirmPassword && (
                      <div className="text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle size={12} />
                        Mật khẩu xác nhận không khớp
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="agree-terms"
                      checked={registerForm.agreeToTerms}
                      onCheckedChange={(checked) => 
                        setRegisterForm(prev => ({ ...prev, agreeToTerms: !!checked }))
                      }
                      disabled={isSubmitting}
                      className="mt-0.5"
                    />
                    <Label htmlFor="agree-terms" className="text-xs text-gray-600 leading-relaxed">
                      Tôi đồng ý với{' '}
                      <Link to="/terms" className="text-blue-600 hover:text-blue-700 underline">
                        Điều khoản sử dụng
                      </Link>
                      {' '}và{' '}
                      <Link to="/privacy" className="text-blue-600 hover:text-blue-700 underline">
                        Chính sách bảo mật
                      </Link>
                    </Label>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting || !passwordStrength.isValid || !registerForm.agreeToTerms}
                  >
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Tạo tài khoản
                  </Button>
                </form>
                
                <div className="text-center">
                  <span className="text-sm text-gray-600">Đã có tài khoản? </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveTab('login')}
                    className="text-blue-600 hover:text-blue-700 p-0 h-auto"
                    disabled={isSubmitting}
                  >
                    Đăng nhập
                  </Button>
                </div>
              </TabsContent>

              {/* Forgot Password Tab */}
              <TabsContent value="forgot-password" className="space-y-6">
                {!forgotPasswordSent ? (
                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div className="text-center space-y-2">
                      <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Mail className="h-6 w-6 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-semibold">Khôi phục mật khẩu</h3>
                      <p className="text-sm text-gray-600">
                        Nhập email của bạn và chúng tôi sẽ gửi liên kết đặt lại mật khẩu
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="forgot-email" className="text-sm font-medium">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="forgot-email"
                          type="email"
                          placeholder="your.email@example.com"
                          value={forgotPasswordEmail}
                          onChange={(e) => setForgotPasswordEmail(e.target.value)}
                          className="pl-10"
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                    
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Gửi liên kết khôi phục
                    </Button>
                  </form>
                ) : (
                  <div className="text-center space-y-4">
                    <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">Email đã được gửi!</h3>
                      <p className="text-sm text-gray-600">
                        Chúng tôi đã gửi liên kết khôi phục mật khẩu đến <br />
                        <strong>{forgotPasswordEmail}</strong>
                      </p>
                      <p className="text-xs text-gray-500">
                        Kiểm tra cả thư mục spam nếu bạn không thấy email
                      </p>
                    </div>
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setForgotPasswordSent(false);
                        setForgotPasswordEmail('');
                      }}
                      className="w-full"
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Gửi lại email
                    </Button>
                  </div>
                )}
                
                <div className="text-center">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setActiveTab('login')}
                    className="text-sm"
                    disabled={isSubmitting}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Quay lại đăng nhập
                  </Button>
                </div>
              </TabsContent>

              {/* Email Verification Tab */}
              <TabsContent value="verify-email" className="space-y-6">
                <div className="text-center space-y-4">
                  <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Xác thực email</h3>
                    <p className="text-sm text-gray-600">
                      Chúng tôi đã gửi email xác thực đến địa chỉ của bạn. <br />
                      Vui lòng kiểm tra email và nhấp vào liên kết để kích hoạt tài khoản.
                    </p>
                  </div>
                  
                  <Alert>
                    <Mail className="h-4 w-4" />
                    <AlertDescription>
                      Nếu bạn không thấy email, hãy kiểm tra thư mục spam hoặc thư rác.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="space-y-3">
                    <Button
                      type="button"
                      onClick={handleResendVerification}
                      disabled={isSubmitting}
                      className="w-full"
                      variant="outline"
                    >
                      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Gửi lại email xác thực
                    </Button>
                    
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setActiveTab('login')}
                      className="w-full"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Quay lại đăng nhập
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          
          {/* Footer */}
          <div className="px-6 py-4 border-t bg-gray-50 text-center">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="text-gray-600 hover:text-gray-800"
            >
              <Home className="mr-2 h-4 w-4" />
              Về trang chủ
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Auth; 