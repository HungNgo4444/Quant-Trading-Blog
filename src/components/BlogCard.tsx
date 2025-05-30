import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Eye, Heart } from 'lucide-react';
import { BlogPost } from '@/data/blogPosts';

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

const BlogCard = ({ post, featured = false }: BlogCardProps) => {
  return (
    <Link to={`/post/${post.id}`} className="group">
      <Card className={`h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${featured ? 'border-blue-200 bg-gradient-to-br from-blue-50 to-white' : ''}`}>
        {/* Cover Image */}
        {post.imageUrl && (
          <div className="relative overflow-hidden rounded-t-lg">
            <img 
              src={post.imageUrl} 
              alt={post.title}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {featured && (
              <div className="absolute top-2 right-2">
                <Badge className="bg-blue-600 text-white">
                  Nổi bật
                </Badge>
              </div>
            )}
          </div>
        )}
        
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className={`font-semibold group-hover:text-blue-600 transition-colors line-clamp-2 ${featured ? 'text-lg' : 'text-base'}`}>
              {post.title}
            </h3>
            {featured && !post.imageUrl && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 shrink-0">
                Nổi bật
              </Badge>
            )}
          </div>
          
          <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
            {post.excerpt}
          </p>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="flex flex-wrap gap-1 mb-3">
            {post.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {post.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{post.tags.length - 3}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(post.publishedAt).toLocaleDateString('vi-VN')}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {post.readTime} phút
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {post.views || 0}
              </span>
              <span className="flex items-center gap-1">
                <Heart className="h-3 w-3" />
                {post.likes || 0}
              </span>
              <span className="font-medium text-gray-700">{post.author}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default BlogCard;
