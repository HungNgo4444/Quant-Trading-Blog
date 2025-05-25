import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, User, Eye, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Header from '@/components/Header';
import LikeShareActions from '@/components/LikeShareActions';
import { BlogPost as BlogPostType } from '@/data/blogPosts';
import { blogService } from '@/lib/blogService';
import { useAuth } from '@/contexts/AuthContext';

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<BlogPostType[]>([]);

  useEffect(() => {
    if (id) {
      loadPost(id);
    }
  }, [id]);

  const loadPost = async (postId: string) => {
    setIsLoading(true);
    try {
      const postData = await blogService.getPostById(postId);
      
      if (!postData) {
        navigate('/');
        return;
      }
      
      setPost(postData);
      
      // Record view if user is logged in
      if (user) {
        await blogService.recordView(postId, user.id);
      }
      
      // Load related posts (posts with similar tags)
      if (postData.tags.length > 0) {
        const allPosts = await blogService.getAllPosts();
        const related = allPosts
          .filter(p => p.id !== postId && p.tags.some(tag => postData.tags.includes(tag)))
          .slice(0, 3);
        setRelatedPosts(related);
      }
    } catch (error) {
      console.error('Error loading post:', error);
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderMarkdown = (content: string) => {
    // Simple markdown rendering - in a real app, use a proper markdown library
    return content
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-6 text-gray-900">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-semibold mb-4 mt-8 text-gray-900">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold mb-3 mt-6 text-gray-900">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono">$1</code>')
      .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4"><code>$2</code></pre>')
      .replace(/^- (.*$)/gim, '<li class="ml-4">• $1</li>')
      .replace(/^\d+\. (.*$)/gim, '<li class="ml-4">$1</li>')
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/\n/g, '<br>');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải bài viết...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Bài viết không tồn tại</h1>
            <p className="text-gray-600 mb-8">Bài viết bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
            <Button asChild>
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay về trang chủ
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <div className="mb-8">
          <Button variant="ghost" asChild>
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay về trang chủ
            </Link>
          </Button>
        </div>

        {/* Article header */}
        <header className="mb-8">
          {/* Featured image */}
          {post.imageUrl && (
            <div className="mb-8">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
              />
            </div>
          )}

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              {post.author}
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {formatDate(post.publishedAt)}
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {post.readTime} phút đọc
            </div>
            <div className="flex items-center">
              <Eye className="h-4 w-4 mr-1" />
              {post.views || 0} lượt xem
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                <Tag className="h-3 w-3" />
                {tag}
              </Badge>
            ))}
          </div>

          {/* Excerpt */}
          <p className="text-xl text-gray-700 leading-relaxed mb-8 font-light">
            {post.excerpt}
          </p>

          <Separator />
        </header>

        {/* Article content */}
        <div className="prose prose-lg max-w-none mb-12">
          <div 
            className="text-gray-800 leading-relaxed"
            dangerouslySetInnerHTML={{ 
              __html: `<p class="mb-4">${renderMarkdown(post.content)}</p>` 
            }}
          />
        </div>

        <Separator className="mb-8" />

        {/* Like, Share, Comment Actions */}
        <LikeShareActions
          postId={post.id}
          initialLikes={post.likes || 0}
          initialShares={post.shares || 0}
          showComments={true}
        />

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Bài viết liên quan</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  to={`/post/${relatedPost.id}`}
                  className="group block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
                >
                  {relatedPost.imageUrl && (
                    <img
                      src={relatedPost.imageUrl}
                      alt={relatedPost.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                  <div className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {relatedPost.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {relatedPost.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{formatDate(relatedPost.publishedAt)}</span>
                      <span>{relatedPost.readTime} phút đọc</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Author info */}
        <section className="mt-16 bg-white rounded-lg p-8 shadow-md">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Về tác giả: {post.author}
              </h3>
              <p className="text-gray-600 mb-4">
                Chuyên gia về giao dịch định lượng với nhiều năm kinh nghiệm trong lĩnh vực 
                phân tích dữ liệu tài chính và phát triển các chiến lược đầu tư tự động.
              </p>
              <div className="flex gap-2">
                <Badge variant="outline">Quantitative Trading</Badge>
                <Badge variant="outline">Python</Badge>
                <Badge variant="outline">Machine Learning</Badge>
              </div>
            </div>
          </div>
        </section>
      </article>
    </div>
  );
};

export default BlogPost;
