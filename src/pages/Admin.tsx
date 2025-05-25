
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { getAllPosts, addPost, deletePost, getAllTags } from '@/utils/blogData';
import { BlogPost } from '@/types/blog';
import { ArrowLeft, Plus, Trash2, BookOpen } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Admin = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState(getAllPosts());
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    tags: '',
    author: '',
    category: '',
    coverImage: '',
    readTime: 5,
    featured: false
  });

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content || !formData.excerpt || !formData.author || !formData.category) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin bắt buộc",
        variant: "destructive"
      });
      return;
    }

    const newPost = addPost({
      title: formData.title,
      content: formData.content,
      excerpt: formData.excerpt,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      author: formData.author,
      category: formData.category,
      coverImage: formData.coverImage || undefined,
      publishedAt: new Date().toISOString().split('T')[0],
      readTime: formData.readTime,
      featured: formData.featured
    });

    setPosts(getAllPosts());
    setIsCreating(false);
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      tags: '',
      author: '',
      category: '',
      coverImage: '',
      readTime: 5,
      featured: false
    });

    toast({
      title: "Thành công",
      description: "Bài viết đã được tạo thành công",
    });

    navigate(`/post/${newPost.id}`);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      deletePost(id);
      setPosts(getAllPosts());
      toast({
        title: "Đã xóa",
        description: "Bài viết đã được xóa thành công",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Admin Panel</span>
            </Link>
            <Link to="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
              <ArrowLeft className="h-4 w-4" />
              Quay về blog
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quản lý bài viết</h1>
            <p className="text-gray-600 mt-2">Tạo và quản lý các bài viết trên blog</p>
          </div>
          <Button onClick={() => setIsCreating(true)} disabled={isCreating}>
            <Plus className="h-4 w-4 mr-2" />
            Tạo bài viết mới
          </Button>
        </div>

        {isCreating && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Tạo bài viết mới</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Tiêu đề *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Nhập tiêu đề bài viết"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="author">Tác giả *</Label>
                    <Input
                      id="author"
                      value={formData.author}
                      onChange={(e) => handleInputChange('author', e.target.value)}
                      placeholder="Tên tác giả"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="category">Chủ đề *</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      placeholder="Frontend, Backend, Database..."
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="coverImage">Hình minh họa (URL)</Label>
                    <Input
                      id="coverImage"
                      value={formData.coverImage}
                      onChange={(e) => handleInputChange('coverImage', e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt">Mô tả ngắn *</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => handleInputChange('excerpt', e.target.value)}
                    placeholder="Mô tả ngắn gọn về bài viết"
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Nội dung *</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    placeholder="Nội dung chi tiết bài viết (hỗ trợ Markdown)"
                    rows={12}
                    className="font-mono"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags</Label>
                    <Input
                      id="tags"
                      value={formData.tags}
                      onChange={(e) => handleInputChange('tags', e.target.value)}
                      placeholder="React, JavaScript, CSS (phân cách bằng dấu phẩy)"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="readTime">Thời gian đọc (phút)</Label>
                    <Input
                      id="readTime"
                      type="number"
                      value={formData.readTime}
                      onChange={(e) => handleInputChange('readTime', parseInt(e.target.value))}
                      min="1"
                      max="60"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => handleInputChange('featured', checked)}
                  />
                  <Label htmlFor="featured">Đánh dấu là bài viết nổi bật</Label>
                </div>

                <div className="flex gap-4">
                  <Button type="submit">Tạo bài viết</Button>
                  <Button type="button" variant="outline" onClick={() => setIsCreating(false)}>
                    Hủy
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Danh sách bài viết ({posts.length})
            </h2>
          </div>

          <div className="grid gap-6">
            {posts.map((post) => (
              <Card key={post.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {post.title}
                        </h3>
                        {post.featured && (
                          <Badge className="bg-blue-100 text-blue-700">
                            Nổi bật
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-gray-600 mb-3 line-clamp-2">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <span>Tác giả: {post.author}</span>
                        <span>Ngày: {new Date(post.publishedAt).toLocaleDateString('vi-VN')}</span>
                        <span>{post.readTime} phút đọc</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {post.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link to={`/post/${post.id}`}>Xem</Link>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDelete(post.id)}
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

          {posts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-4">Chưa có bài viết nào</p>
              <Button onClick={() => setIsCreating(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Tạo bài viết đầu tiên
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Admin;
