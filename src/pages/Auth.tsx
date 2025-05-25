import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, Lock, User, ArrowLeft, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { LoginCredentials, RegisterCredentials } from '@/types/auth';
import Header from '@/components/Header';

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, register, verifyEmail, resendVerificationCode, isLoading } = useAuth();
  
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'login');
  const [showVerification, setShowVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  
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
    confirmPassword: ''
  });
  
  // Verification form state
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await login(loginForm);
    if (response.success) {
      navigate('/');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await register(registerForm);
    if (response.success && response.requiresEmailVerification) {
      setVerificationEmail(registerForm.email);
      setShowVerification(true);
    }
  };

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    
    const response = await verifyEmail(verificationEmail, verificationCode);
    if (response.success) {
      setShowVerification(false);
      setActiveTab('login');
      setVerificationCode('');
    }
    
    setIsVerifying(false);
  };

  const handleResendCode = async () => {
    setIsResending(true);
    await resendVerificationCode(verificationEmail);
    setIsResending(false);
  };

  if (showVerification) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Mail className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>Xác thực email</CardTitle>
              <CardDescription>
                Chúng tôi đã gửi mã xác thực 6 chữ số đến email <strong>{verificationEmail}</strong>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleVerifyEmail} className="space-y-4">
                <div>
                  <Label htmlFor="code">Mã xác thực</Label>
                  <Input
                    id="code"
                    type="text"
                    placeholder="Nhập mã 6 chữ số"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    maxLength={6}
                    className="text-center text-lg tracking-widest"
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={isVerifying}>
                  {isVerifying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Xác thực
                </Button>
                
                <div className="text-center">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleResendCode}
                    disabled={isResending}
                    className="text-sm"
                  >
                    {isResending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Gửi lại mã xác thực
                  </Button>
                </div>
                
                <div className="text-center">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowVerification(false)}
                    className="text-sm"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Quay lại
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Chào mừng đến với Quantitative Trading Blog</CardTitle>
            <CardDescription>
              Đăng nhập hoặc tạo tài khoản để truy cập đầy đủ tính năng
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Đăng nhập</TabsTrigger>
                <TabsTrigger value="register">Đăng ký</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="your@email.com"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="login-password">Mật khẩu</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="••••••••"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      id="remember"
                      type="checkbox"
                      checked={loginForm.rememberMe}
                      onChange={(e) => setLoginForm({ ...loginForm, rememberMe: e.target.checked })}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="remember" className="text-sm">Ghi nhớ đăng nhập</Label>
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Đăng nhập
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="register" className="space-y-4">
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    Mật khẩu sẽ được mã hóa bảo mật và bạn sẽ nhận được email xác thực.
                  </AlertDescription>
                </Alert>
                
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <Label htmlFor="register-name">Họ tên</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-name"
                        type="text"
                        placeholder="Nguyễn Văn A"
                        value={registerForm.name}
                        onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="register-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="your@email.com"
                        value={registerForm.email}
                        onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="register-password">Mật khẩu</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="Ít nhất 8 ký tự"
                        value={registerForm.password}
                        onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                        className="pl-10"
                        minLength={8}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="register-confirm-password">Xác nhận mật khẩu</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-confirm-password"
                        type="password"
                        placeholder="Nhập lại mật khẩu"
                        value={registerForm.confirmPassword}
                        onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Đăng ký
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
            
            <div className="mt-6 text-center">
              <Link to="/" className="text-sm text-blue-600 hover:text-blue-700">
                <ArrowLeft className="inline mr-1 h-4 w-4" />
                Quay về trang chủ
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth; 