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
  Save, 
  X,
  Calendar,
  Clock,
  Tag,
  FileText,
  Shield
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { BlogPost } from '@/data/blogPosts';
import { blogService } from '@/lib/blogService';
import { blogSettingsService, BlogSettings } from '@/lib/blogSettings';
import Header from '@/components/Header';

interface PostForm {
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  readTime: number;
  imageUrl: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const { user, isAdmin, isAuthenticated } = useAuth();
  
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');
  const [showEditor, setShowEditor] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Blog settings state
  const [blogSettings, setBlogSettings] = useState<BlogSettings | null>(null);
  const [isLoadingSettings, setIsLoadingSettings] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  
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
    loadBlogSettings();
  }, [isAuthenticated, isAdmin, navigate]);

  const loadPosts = async () => {
    setIsLoading(true);
    try {
      const allPosts = await blogService.getAllPosts();
      setPosts(allPosts);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadBlogSettings = async () => {
    setIsLoadingSettings(true);
    try {
      const settings = await blogSettingsService.getSettings();
      setBlogSettings(settings);
    } catch (error) {
      console.error('Error loading blog settings:', error);
    } finally {
      setIsLoadingSettings(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!blogSettings) return;
    
    setIsSavingSettings(true);
    try {
      await blogSettingsService.updateSettings(blogSettings);
      alert('Cài đặt đã được lưu thành công!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Có lỗi xảy ra khi lưu cài đặt');
    } finally {
      setIsSavingSettings(false);
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
      await blogService.deletePost(postId);
      await loadPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
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
      if (editingPost) {
        // Update existing post
        await blogService.updatePost(editingPost.id, {
          ...postForm,
          author: user?.name || 'Admin',
          updatedAt: new Date().toISOString()
        });
      } else {
        // Create new post
        await blogService.createPost({
          ...postForm,
          author: user?.name || 'Admin'
        });
      }
      
      await loadPosts();
      resetForm();
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Có lỗi xảy ra khi lưu bài viết');
    } finally {
      setIsSaving(false);
    }
  };

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

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="posts">Bài viết</TabsTrigger>
            <TabsTrigger value="analytics">Thống kê</TabsTrigger>
            <TabsTrigger value="settings">Cài đặt</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-6">
            {!showEditor ? (
              <>
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Danh sách bài viết</h2>
                  <Button onClick={() => setShowEditor(true)} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Tạo bài viết mới
                  </Button>
                </div>

                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {posts.map((post) => (
                      <Card key={post.id}>
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
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
                              </div>
                              
                              <div className="flex flex-wrap gap-2">
                                {post.tags.map((tag) => (
                                  <Badge key={tag} variant="secondary">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2 ml-4">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate(`/post/${post.id}`)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditPost(post)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeletePost(post.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
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
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Thống kê Blog</CardTitle>
                <CardDescription>Tổng quan về hiệu suất blog</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{posts.length}</div>
                    <div className="text-sm text-gray-600">Tổng bài viết</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {posts.reduce((sum, post) => sum + (post.views || 0), 0)}
                    </div>
                    <div className="text-sm text-gray-600">Tổng lượt xem</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">
                      {posts.reduce((sum, post) => sum + (post.likes || 0), 0)}
                    </div>
                    <div className="text-sm text-gray-600">Tổng lượt thích</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Cài đặt Blog</CardTitle>
                <CardDescription>Cấu hình thông tin chung cho blog</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingSettings ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : blogSettings ? (
                  <div className="space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="blogTitle">Tiêu đề Blog</Label>
                        <Input
                          id="blogTitle"
                          value={blogSettings.blogTitle}
                          onChange={(e) => setBlogSettings({
                            ...blogSettings,
                            blogTitle: e.target.value
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="authorName">Tên tác giả</Label>
                        <Input
                          id="authorName"
                          value={blogSettings.authorName}
                          onChange={(e) => setBlogSettings({
                            ...blogSettings,
                            authorName: e.target.value
                          })}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="blogDescription">Mô tả Blog</Label>
                      <Textarea
                        id="blogDescription"
                        rows={3}
                        value={blogSettings.blogDescription}
                        onChange={(e) => setBlogSettings({
                          ...blogSettings,
                          blogDescription: e.target.value
                        })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="authorBio">Tiểu sử tác giả</Label>
                      <Textarea
                        id="authorBio"
                        rows={3}
                        value={blogSettings.authorBio}
                        onChange={(e) => setBlogSettings({
                          ...blogSettings,
                          authorBio: e.target.value
                        })}
                      />
                    </div>

                    {/* Contact Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="contactEmail">Email liên hệ</Label>
                        <Input
                          id="contactEmail"
                          type="email"
                          value={blogSettings.contactEmail}
                          onChange={(e) => setBlogSettings({
                            ...blogSettings,
                            contactEmail: e.target.value
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="linkedinUrl">LinkedIn</Label>
                        <Input
                          id="linkedinUrl"
                          value={blogSettings.linkedinUrl}
                          onChange={(e) => setBlogSettings({
                            ...blogSettings,
                            linkedinUrl: e.target.value
                          })}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="authorImage">URL ảnh tác giả</Label>
                      <Input
                        id="authorImage"
                        value={blogSettings.authorImage}
                        onChange={(e) => setBlogSettings({
                          ...blogSettings,
                          authorImage: e.target.value
                        })}
                      />
                    </div>

                    {/* Mission */}
                    <div>
                      <Label htmlFor="missionTitle">Tiêu đề mục tiêu</Label>
                      <Input
                        id="missionTitle"
                        value={blogSettings.missionTitle}
                        onChange={(e) => setBlogSettings({
                          ...blogSettings,
                          missionTitle: e.target.value
                        })}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="educationDesc">Mô tả Giáo dục</Label>
                        <Textarea
                          id="educationDesc"
                          rows={3}
                          value={blogSettings.educationDescription}
                          onChange={(e) => setBlogSettings({
                            ...blogSettings,
                            educationDescription: e.target.value
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="practiceDesc">Mô tả Thực hành</Label>
                        <Textarea
                          id="practiceDesc"
                          rows={3}
                          value={blogSettings.practiceDescription}
                          onChange={(e) => setBlogSettings({
                            ...blogSettings,
                            practiceDescription: e.target.value
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="researchDesc">Mô tả Nghiên cứu</Label>
                        <Textarea
                          id="researchDesc"
                          rows={3}
                          value={blogSettings.researchDescription}
                          onChange={(e) => setBlogSettings({
                            ...blogSettings,
                            researchDescription: e.target.value
                          })}
                        />
                      </div>
                    </div>

                    {/* Main Topics */}
                    <div>
                      <Label>Chủ đề chính</Label>
                      <div className="flex flex-wrap gap-2 mt-2 mb-3">
                        {blogSettings.mainTopics.map((topic, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center gap-1">
                            {topic}
                            <X 
                              className="h-3 w-3 cursor-pointer" 
                              onClick={() => setBlogSettings({
                                ...blogSettings,
                                mainTopics: blogSettings.mainTopics.filter((_, i) => i !== index)
                              })}
                            />
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Thêm chủ đề mới..."
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              if (tagInput.trim() && !blogSettings.mainTopics.includes(tagInput.trim())) {
                                setBlogSettings({
                                  ...blogSettings,
                                  mainTopics: [...blogSettings.mainTopics, tagInput.trim()]
                                });
                                setTagInput('');
                              }
                            }
                          }}
                        />
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => {
                            if (tagInput.trim() && !blogSettings.mainTopics.includes(tagInput.trim())) {
                              setBlogSettings({
                                ...blogSettings,
                                mainTopics: [...blogSettings.mainTopics, tagInput.trim()]
                              });
                              setTagInput('');
                            }
                          }}
                        >
                          Thêm
                        </Button>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button 
                        onClick={handleSaveSettings}
                        disabled={isSavingSettings}
                        className="flex items-center gap-2"
                      >
                        {isSavingSettings ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4" />
                        )}
                        Lưu cài đặt
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Alert>
                    <FileText className="h-4 w-4" />
                    <AlertDescription>
                      Không thể tải cài đặt blog.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin; 