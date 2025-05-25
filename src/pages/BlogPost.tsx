
import { useParams, Link } from 'react-router-dom';
import { getPostById } from '@/utils/blogData';
import Header from '@/components/Header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, BookOpen, ArrowLeft } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const post = id ? getPostById(id) : null;

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Bài viết không tồn tại
            </h1>
            <Link to="/">
              <Button>Quay về trang chủ</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Đã sao chép link",
        description: "Link bài viết đã được sao chép vào clipboard",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <Link to="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8">
          <ArrowLeft className="h-4 w-4" />
          Quay về trang chủ
        </Link>

        <article className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Header */}
          <div className="p-8 border-b">
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
              {post.featured && (
                <Badge className="bg-blue-100 text-blue-700">
                  Nổi bật
                </Badge>
              )}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {post.title}
            </h1>
            
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              {post.excerpt}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(post.publishedAt).toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  {post.readTime} phút đọc
                </span>
                <span className="font-medium text-gray-700">{post.author}</span>
              </div>
              
              <Button variant="outline" size="sm" onClick={handleShare}>
                Chia sẻ
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="prose prose-lg max-w-none">
              {post.content.split('\n').map((paragraph, index) => {
                if (paragraph.startsWith('##')) {
                  return (
                    <h2 key={index} className="text-2xl font-bold mt-8 mb-4 text-gray-900">
                      {paragraph.replace('## ', '')}
                    </h2>
                  );
                }
                if (paragraph.startsWith('```')) {
                  const nextIndex = post.content.split('\n').findIndex((p, i) => i > index && p.startsWith('```'));
                  if (nextIndex > index) {
                    const codeBlock = post.content.split('\n').slice(index + 1, nextIndex).join('\n');
                    return (
                      <pre key={index} className="bg-gray-100 p-4 rounded-lg overflow-x-auto my-6">
                        <code className="text-sm">{codeBlock}</code>
                      </pre>
                    );
                  }
                  return null;
                }
                if (paragraph.trim() === '' || paragraph.startsWith('```')) {
                  return null;
                }
                return (
                  <p key={index} className="mb-4 leading-relaxed text-gray-700">
                    {paragraph}
                  </p>
                );
              })}
            </div>
          </div>
        </article>

        {/* Call to action */}
        <div className="text-center mt-12 p-8 bg-white rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Bạn thấy bài viết này hữu ích?
          </h3>
          <p className="text-gray-600 mb-4">
            Chia sẻ với bạn bè hoặc khám phá thêm các bài viết khác
          </p>
          <div className="flex justify-center gap-4">
            <Button onClick={handleShare} variant="outline">
              Chia sẻ bài viết
            </Button>
            <Button asChild>
              <Link to="/">Xem thêm bài viết</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BlogPost;
