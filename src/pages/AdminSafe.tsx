import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Shield, AlertTriangle, Database, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';

const AdminSafe = () => {
  const navigate = useNavigate();
  const { user, isAdmin, isAuthenticated, isSupabaseEnabled } = useAuth();
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [databaseStatus, setDatabaseStatus] = useState<'checking' | 'connected' | 'error'>('checking');

  // Redirect if not admin
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    
    if (!isAdmin) {
      navigate('/');
      return;
    }
    
    checkDatabaseConnection();
  }, [isAuthenticated, isAdmin, navigate]);

  const checkDatabaseConnection = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (!isSupabaseEnabled) {
        setError('Supabase chưa được cấu hình. Vui lòng kiểm tra file config.');
        setDatabaseStatus('error');
        return;
      }

      // Test database connection
      const { supabase } = await import('@/lib/supabase');
      const { data, error: dbError } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);

      if (dbError) {
        throw new Error(`Database error: ${dbError.message}`);
      }

      setDatabaseStatus('connected');
      console.log('✅ Database connection successful');
      
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      setError(`Lỗi kết nối database: ${(error as Error).message}`);
      setDatabaseStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetupDatabase = () => {
    window.open('https://supabase.com', '_blank');
  };

  const handleGoToFullAdmin = () => {
    // Navigate to main admin panel
    navigate('/admin/panel');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Đang kiểm tra kết nối database...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel - Simplified</h1>
          <p className="text-gray-600">Chào mừng Admin User</p>
        </div>

        {/* Database Status */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              <CardTitle>Trạng thái Database</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {databaseStatus === 'checking' && (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Đang kiểm tra kết nối...</span>
              </div>
            )}
            
            {databaseStatus === 'connected' && (
              <div className="space-y-4">
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    ✅ Database đã kết nối thành công! Bạn có thể sử dụng đầy đủ tính năng admin.
                  </AlertDescription>
                </Alert>
                
                <Button onClick={handleGoToFullAdmin} className="w-full">
                  <Settings className="mr-2 h-4 w-4" />
                  Vào Admin Panel đầy đủ
                </Button>
              </div>
            )}
            
            {databaseStatus === 'error' && (
              <div className="space-y-4">
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    ❌ Không thể kết nối database. {error}
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    Để sử dụng Admin Panel, bạn cần:
                  </p>
                  <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                    <li>Setup database trong Supabase</li>
                    <li>Chạy các file SQL schema</li>
                    <li>Cấu hình đúng credentials</li>
                  </ul>
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={handleSetupDatabase} variant="outline">
                    <Database className="mr-2 h-4 w-4" />
                    Mở Supabase Dashboard
                  </Button>
                  <Button onClick={checkDatabaseConnection} variant="outline">
                    Thử lại
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quản lý Bài viết</CardTitle>
              <CardDescription>
                Tạo, chỉnh sửa và quản lý các bài viết blog
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleGoToFullAdmin} 
                disabled={databaseStatus !== 'connected'}
                className="w-full"
              >
                Quản lý Bài viết
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cài đặt Blog</CardTitle>
              <CardDescription>
                Cấu hình thông tin blog và tác giả
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleGoToFullAdmin} 
                disabled={databaseStatus !== 'connected'}
                className="w-full"
              >
                Cài đặt Blog
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Help Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Cần hỗ trợ?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-gray-600">
              Nếu gặp vấn đề với Admin Panel:
            </p>
            <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
              <li>Kiểm tra console browser (F12) để xem lỗi chi tiết</li>
              <li>Đảm bảo đã setup database trong Supabase</li>
              <li>Chạy các file SQL schema theo đúng thứ tự</li>
              <li>Kiểm tra cấu hình Supabase trong src/config/supabase.ts</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSafe; 