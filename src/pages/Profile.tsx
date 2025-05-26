import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Save, User, Mail, Calendar, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';

const Profile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, updateProfile } = useAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    bio: '',
    website: '',
    location: ''
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
        website: user.website || '',
        location: user.location || ''
      });
    }
  }, [isAuthenticated, user, navigate]);

  const handleSave = async () => {
    setIsSaving(true);
    setMessage('');
    
    try {
      const response = await updateProfile({
        name: profileData.name,
        bio: profileData.bio,
        website: profileData.website,
        location: profileData.location
      });

      if (response.success) {
        setMessage('Hồ sơ đã được cập nhật thành công!');
      } else {
        setMessage(response.message || 'Có lỗi xảy ra khi cập nhật hồ sơ');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Có lỗi xảy ra khi cập nhật hồ sơ');
    } finally {
      setIsSaving(false);
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
            <User className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Hồ sơ cá nhân</h1>
          </div>
          <p className="text-gray-600">Quản lý thông tin tài khoản của bạn</p>
        </div>

        <div className="grid gap-6">
          {/* Profile Info */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cá nhân</CardTitle>
              <CardDescription>
                Cập nhật thông tin hồ sơ của bạn
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {message && (
                <Alert>
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Họ và tên</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    placeholder="Nhập họ và tên"
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    disabled
                    className="bg-gray-100"
                  />
                  <p className="text-sm text-gray-500 mt-1">Email không thể thay đổi</p>
                </div>
              </div>
              
              <div>
                <Label htmlFor="bio">Giới thiệu bản thân</Label>
                <Textarea
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  placeholder="Viết vài dòng giới thiệu về bản thân..."
                  rows={4}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={profileData.website}
                    onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                    placeholder="https://yourwebsite.com"
                  />
                </div>
                
                <div>
                  <Label htmlFor="location">Địa điểm</Label>
                  <Input
                    id="location"
                    value={profileData.location}
                    onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                    placeholder="Thành phố, Quốc gia"
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Save className="mr-2 h-4 w-4" />
                  Lưu thay đổi
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Account Info */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin tài khoản</CardTitle>
              <CardDescription>
                Chi tiết về tài khoản của bạn
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="h-5 w-5 text-gray-500" />
                  <div>
                    <div className="font-medium">Email</div>
                    <div className="text-sm text-gray-600">{user?.email}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <div>
                    <div className="font-medium">Ngày tham gia</div>
                    <div className="text-sm text-gray-600">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : 'Không xác định'}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Shield className="h-5 w-5 text-gray-500" />
                  <div>
                    <div className="font-medium">Vai trò</div>
                    <div className="text-sm text-gray-600">
                      {user?.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile; 