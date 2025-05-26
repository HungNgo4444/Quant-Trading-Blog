import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Loader2, AlertTriangle, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';

// Lazy load the actual Admin component
const AdminWrapper = () => {
  const navigate = useNavigate();
  const { user, isAdmin, isAuthenticated } = useAuth();
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [AdminComponent, setAdminComponent] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    
    if (!isAdmin) {
      navigate('/');
      return;
    }
    
    loadAdminComponent();
  }, [isAuthenticated, isAdmin, navigate]);

  const loadAdminComponent = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Test database connection first
      const { supabase } = await import('@/lib/supabase');
      const { data, error: dbError } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);

      if (dbError) {
        throw new Error(`Database connection failed: ${dbError.message}`);
      }

      // If database is OK, load the Admin component
      const AdminModule = await import('@/pages/Admin');
      setAdminComponent(() => AdminModule.default);
      
    } catch (error) {
      console.error('❌ Failed to load Admin:', error);
      setError(`Không thể tải Admin Panel: ${(error as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToSafe = () => {
    navigate('/admin');
  };

  const handleRetry = () => {
    loadAdminComponent();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Đang tải Admin Panel...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
            
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Admin Panel không thể tải do lỗi database. Vui lòng:
              </p>
              <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                <li>Kiểm tra kết nối database trong Supabase</li>
                <li>Đảm bảo các bảng đã được tạo đúng cách</li>
                <li>Chạy các file SQL schema nếu chưa có</li>
              </ul>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleBackToSafe} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại Admin Safe
              </Button>
              <Button onClick={handleRetry}>
                Thử lại
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render the actual Admin component if everything is OK
  if (AdminComponent) {
    return <AdminComponent />;
  }

  return null;
};

export default AdminWrapper; 