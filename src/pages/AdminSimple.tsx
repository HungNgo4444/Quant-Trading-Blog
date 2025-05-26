import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Loader2, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Save, 
  X,
  Calendar,
  Clock,
  FileText,
  Shield
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { BlogPost } from '@/data/blogPosts';
import { blogService } from '@/lib/blogService';
import Header from '@/components/Header';

interface PostForm {
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  readTime: number;
  imageUrl: string;
}

const AdminSimple = () => {
  const navigate = useNavigate();
  const { user, isAdmin, isAuthenticated } = useAuth();
  
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [hiddenPosts, setHiddenPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('visible');
  const [showEditor, setShowEditor] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const [postForm, setPostForm] = useState<PostForm>({
    title: '',
    excerpt: '',
    content: '',
    tags: [],
    readTime: 5,
    imageUrl: ''
  });
  
  const [tagInput, setTagInput] = useState('');

  // Redirect if not admin
  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate('/');
      return;
    }
    
    loadPosts();
  }, [isAuthenticated, isAdmin, navigate]);

  const loadPosts = async () => {
    setIsLoading(true);
    try {
      const allPosts = await blogService.getAllPosts(true);
      const visiblePosts = allPosts.filter(post => !post.isHidden);
      const hiddenPostsList = allPosts.filter(post => post.isHidden);
      
      setPosts(visiblePosts);
      setHiddenPosts(hiddenPostsList);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setPostForm({
      title: '',
      excerpt: '',
      content: '',
      tags: [],
      readTime: 5,
      imageUrl: ''
    });
    setTagInput('');
    setEditingPost(null);
    setShowEditor(false);
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post);
    setPostForm({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      tags: post.tags,
      readTime: post.readTime,
      imageUrl: post.imageUrl || ''
    });
    setShowEditor(true);
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      return;
    }
    
    try {
      const success = await blogService.deletePost(postId);
      if (success) {
        await loadPosts();
        alert('Bài viết đã được xóa thành công!');
      } else {
        alert('Có lỗi xảy ra khi xóa bài viết.');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Có lỗi xảy ra khi xóa bài viết.');
    }
  };

  const handleToggleVisibility = async (postId: string, currentlyHidden: boolean) => {
    try {
      const success = await blogService.togglePostVisibility(postId);
      if (success) {
        await loadPosts();
        alert(`Bài viết đã được ${currentlyHidden ? 'hiển thị' : 'ẩn'} thành công!`);
      } else {
        alert('Có lỗi xảy ra khi thay đổi trạng thái bài viết.');
      }
    } catch (error) {
      console.error('Error toggling post visibility:', error);
      alert('Có lỗi xảy ra khi thay đổi trạng thái bài viết.');
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !postForm.tags.includes(tagInput.trim())) {
      setPostForm({
        ...postForm,
        tags: [...postForm.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setPostForm({
      ...postForm,
      tags: postForm.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleSavePost = async () => {
    if (!postForm.title.trim() || !postForm.content.trim()) {
      alert('Vui lòng điền đầy đủ tiêu đề và nội dung');
      return;
    }

    setIsSaving(true);
    try {
      let result;
      if (editingPost) {
        result = await blogService.updatePost(editingPost.id, {
          ...postForm,
          author: user?.name || 'Admin',
          updatedAt: new Date().toISOString()
        });
      } else {
        result = await blogService.createPost({
          ...postForm,
          author: user?.name || 'Admin'
        });
      }
      
      if (result) {
        await loadPosts();
        resetForm();
        alert(`Bài viết đã được ${editingPost ? 'cập nhật' : 'tạo'} thành công!`);
      } else {
        alert('Có lỗi xảy ra khi lưu bài viết.');
      }
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Có lỗi xảy ra khi lưu bài viết.');
    } finally {
      setIsSaving(false);
    }
  };

  const renderPostCard = (post: BlogPost, isHidden: boolean = false) => (
    <Card key={post.id} className={isHidden ? "border-red-200 bg-red-50" : ""}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold">{post.title}</h3>
              {post.isHidden && (
                <Badge variant="destructive" className="text-xs">ẨN</Badge>
              )}
          </div>
            <p className="text-gray-600 mb-3 line-clamp-2">{post.excerpt}</p>
            
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(post.publishedAt).toLocaleDateString('vi-VN')}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {post.readTime} phút đọc
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {post.views || 0} lượt xem
              </div>
              <div className="flex items-center gap-1">
                {post.isHidden ? (
                  <>
                    <EyeOff className="h-4 w-4 text-red-500" />
                    <span className="text-red-500">Đang ẩn</span>
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 text-green-500" />
                    <span className="text-green-500">Đang hiển thị</span>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
              onClick={() => navigate(`/post/${post.id}`)}
                          title="Xem bài viết"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditPost(post)}
                          title="Chỉnh sửa"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
              onClick={() => handleToggleVisibility(post.id, post.isHidden || false)}
              className={post.isHidden ? "text-green-600 hover:text-green-700" : "text-orange-600 hover:text-orange-700"}
              title={post.isHidden ? "Hiển thị bài viết" : "Ẩn bài viết"}
            >
              {post.isHidden ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeletePost(post.id)}
                          className="text-red-600 hover:text-red-700"
                          title="Xóa bài viết"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
      </CardContent>
    </Card>
  );

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Quản trị Blog</h1>
          </div>
          <p className="text-gray-600">Quản lý bài viết và nội dung blog</p>
        </div>

        {!showEditor ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Quản lý bài viết</h2>
              <Button onClick={() => setShowEditor(true)} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Tạo bài viết mới
              </Button>
            </div>

            {/* Simple tabs without nesting */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="visible" className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Bài viết hiển thị ({posts.length})
                </TabsTrigger>
                <TabsTrigger value="hidden" className="flex items-center gap-2">
                  <EyeOff className="h-4 w-4" />
                  Bài viết ẩn ({hiddenPosts.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="visible" className="space-y-4 mt-6">
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : posts.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-600 mb-2">Chưa có bài viết</h3>
                      <p className="text-gray-500">Tạo bài viết đầu tiên để bắt đầu</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {posts.map((post) => renderPostCard(post, false))}
                </div>
              )}
              </TabsContent>

              <TabsContent value="hidden" className="space-y-4 mt-6">
                {hiddenPosts.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <EyeOff className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-600 mb-2">Không có bài viết ẩn</h3>
                      <p className="text-gray-500">Tất cả bài viết đang được hiển thị công khai</p>
            </CardContent>
          </Card>
                ) : (
                  <div className="grid gap-4">
                    {hiddenPosts.map((post) => renderPostCard(post, true))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>
                    {editingPost ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}
                  </CardTitle>
                  <CardDescription>
                    Điền thông tin để {editingPost ? 'cập nhật' : 'tạo'} bài viết
                  </CardDescription>
                </div>
                <Button variant="outline" onClick={resetForm}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Tiêu đề *</Label>
                    <Input
                      id="title"
                      value={postForm.title}
                      onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                      placeholder="Nhập tiêu đề bài viết"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="excerpt">Mô tả ngắn *</Label>
                    <Textarea
                      id="excerpt"
                      value={postForm.excerpt}
                      onChange={(e) => setPostForm({ ...postForm, excerpt: e.target.value })}
                      placeholder="Mô tả ngắn gọn về bài viết"
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="imageUrl">URL hình ảnh</Label>
                    <Input
                      id="imageUrl"
                      value={postForm.imageUrl}
                      onChange={(e) => setPostForm({ ...postForm, imageUrl: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="readTime">Thời gian đọc (phút)</Label>
                    <Input
                      id="readTime"
                      type="number"
                      value={postForm.readTime}
                      onChange={(e) => setPostForm({ ...postForm, readTime: parseInt(e.target.value) || 5 })}
                      min="1"
                      max="60"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label>Tags</Label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        placeholder="Nhập tag"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      />
                      <Button type="button" onClick={handleAddTag} variant="outline">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {postForm.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                          {tag}
                          <X 
                            className="h-3 w-3 cursor-pointer" 
                            onClick={() => handleRemoveTag(tag)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor="content">Nội dung *</Label>
                <Textarea
                  id="content"
                  value={postForm.content}
                  onChange={(e) => setPostForm({ ...postForm, content: e.target.value })}
                  placeholder="Viết nội dung bài viết (hỗ trợ Markdown)"
                  rows={15}
                  className="font-mono"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Hỗ trợ Markdown: **bold**, *italic*, `code`, ## heading, etc.
                </p>
              </div>
              
              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={resetForm}>
                  Hủy
                </Button>
                <Button onClick={handleSavePost} disabled={isSaving}>
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Save className="mr-2 h-4 w-4" />
                  {editingPost ? 'Cập nhật' : 'Tạo bài viết'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Back to Admin Safe */}
        <div className="mt-8 pt-6 border-t">
          <div className="flex justify-center">
            <Button 
              variant="outline" 
              onClick={() => navigate('/admin')}
              className="flex items-center gap-2"
            >
              <Shield className="h-4 w-4" />
              Quay lại Admin Safe
                    </Button>
                  </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSimple; 