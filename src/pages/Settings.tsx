import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Loader2, 
  Save, 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  Palette,
  Key,
  Trash2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';

const Settings = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, updatePassword, deleteAccount } = useAuth();
  
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('preferences');
  
  // Preferences
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyDigest: true,
    darkMode: false,
    language: 'vi'
  });
  
  // Password change
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // Load user preferences from localStorage or API
    const savedPrefs = localStorage.getItem('userPreferences');
    if (savedPrefs) {
      setPreferences(JSON.parse(savedPrefs));
    }
  }, [isAuthenticated, navigate]);

  const handleSavePreferences = async () => {
    setIsSaving(true);
    setMessage('');
    
    try {
      // Save to localStorage (in real app, save to database)
      localStorage.setItem('userPreferences', JSON.stringify(preferences));
      setMessage('Cài đặt đã được lưu thành công!');
    } catch (error) {
      console.error('Error saving preferences:', error);
      setMessage('Có lỗi xảy ra khi lưu cài đặt');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage('Mật khẩu xác nhận không khớp');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      setMessage('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }
    
    setIsSaving(true);
    setMessage('');
    
    try {
      const response = await updatePassword(passwordData.newPassword, passwordData.currentPassword);
      if (response.success) {
        setMessage('Mật khẩu đã được thay đổi thành công!');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setMessage(response.message);
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setMessage('Có lỗi xảy ra khi thay đổi mật khẩu');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Bạn có chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn tác.')) {
      return;
    }
    
    try {
      await deleteAccount();
      navigate('/');
    } catch (error) {
      console.error('Error deleting account:', error);
      setMessage('Có lỗi xảy ra khi xóa tài khoản');
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <SettingsIcon className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Cài đặt</h1>
          </div>
          <p className="text-gray-600">Quản lý tùy chọn và bảo mật tài khoản</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="preferences">Tùy chọn</TabsTrigger>
            <TabsTrigger value="notifications">Thông báo</TabsTrigger>
            <TabsTrigger value="security">Bảo mật</TabsTrigger>
            <TabsTrigger value="account">Tài khoản</TabsTrigger>
          </TabsList>

          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  <CardTitle>Giao diện</CardTitle>
                </div>
                <CardDescription>
                  Tùy chỉnh giao diện và ngôn ngữ
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {message && (
                  <Alert>
                    <AlertDescription>{message}</AlertDescription>
                  </Alert>
                )}
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Chế độ tối</Label>
                    <p className="text-sm text-gray-500">Sử dụng giao diện tối</p>
                  </div>
                  <Switch
                    checked={preferences.darkMode}
                    onCheckedChange={(checked) => 
                      setPreferences({ ...preferences, darkMode: checked })
                    }
                  />
                </div>
                
                <div>
                  <Label htmlFor="language">Ngôn ngữ</Label>
                  <select
                    id="language"
                    value={preferences.language}
                    onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  >
                    <option value="vi">Tiếng Việt</option>
                    <option value="en">English</option>
                  </select>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={handleSavePreferences} disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Save className="mr-2 h-4 w-4" />
                    Lưu cài đặt
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  <CardTitle>Thông báo</CardTitle>
                </div>
                <CardDescription>
                  Quản lý cách bạn nhận thông báo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Thông báo email</Label>
                    <p className="text-sm text-gray-500">Nhận thông báo qua email</p>
                  </div>
                  <Switch
                    checked={preferences.emailNotifications}
                    onCheckedChange={(checked) => 
                      setPreferences({ ...preferences, emailNotifications: checked })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Thông báo đẩy</Label>
                    <p className="text-sm text-gray-500">Nhận thông báo đẩy trên trình duyệt</p>
                  </div>
                  <Switch
                    checked={preferences.pushNotifications}
                    onCheckedChange={(checked) => 
                      setPreferences({ ...preferences, pushNotifications: checked })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Tóm tắt hàng tuần</Label>
                    <p className="text-sm text-gray-500">Nhận email tóm tắt bài viết mới hàng tuần</p>
                  </div>
                  <Switch
                    checked={preferences.weeklyDigest}
                    onCheckedChange={(checked) => 
                      setPreferences({ ...preferences, weeklyDigest: checked })
                    }
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={handleSavePreferences} disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Save className="mr-2 h-4 w-4" />
                    Lưu cài đặt
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  <CardTitle>Thay đổi mật khẩu</CardTitle>
                </div>
                <CardDescription>
                  Cập nhật mật khẩu để bảo mật tài khoản
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="newPassword">Mật khẩu mới</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={handleChangePassword} disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Key className="mr-2 h-4 w-4" />
                    Thay đổi mật khẩu
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  <CardTitle>Quản lý tài khoản</CardTitle>
                </div>
                <CardDescription>
                  Thông tin và hành động tài khoản
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Thông tin tài khoản</h4>
                  <p className="text-sm text-gray-600 mb-1">Email: {user?.email}</p>
                  <p className="text-sm text-gray-600 mb-1">
                    Vai trò: {user?.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
                  </p>
                  <p className="text-sm text-gray-600">
                    Ngày tham gia: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : 'Không xác định'}
                  </p>
                </div>
                
                <div className="border-t pt-6">
                  <h4 className="font-medium text-red-600 mb-2">Vùng nguy hiểm</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Xóa tài khoản sẽ xóa vĩnh viễn tất cả dữ liệu của bạn. Hành động này không thể hoàn tác.
                  </p>
                  <Button 
                    variant="destructive" 
                    onClick={handleDeleteAccount}
                    className="flex items-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Xóa tài khoản
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings; 