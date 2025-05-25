
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Share2, MessageCircle, Bookmark } from 'lucide-react';
import { BlogPost } from '@/types/blog';
import { toast } from '@/hooks/use-toast';
import { likePost } from '@/utils/blogData';

interface LikeShareActionsProps {
  post: BlogPost;
  onLike?: (newLikeCount: number) => void;
}

const LikeShareActions = ({ post, onLike }: LikeShareActionsProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);

  const handleLike = () => {
    if (!isLiked) {
      const success = likePost(post.id);
      if (success) {
        setIsLiked(true);
        const newCount = likeCount + 1;
        setLikeCount(newCount);
        onLike?.(newCount);
        toast({
          title: "Đã thích bài viết! ❤️",
          description: "Cảm ơn bạn đã ủng hộ",
        });
      }
    }
  };

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

  const handleComment = () => {
    toast({
      title: "Tính năng đang phát triển",
      description: "Chức năng bình luận sẽ có sau khi kết nối Supabase",
    });
  };

  const handleBookmark = () => {
    toast({
      title: "Đã lưu bài viết",
      description: "Bài viết đã được thêm vào danh sách yêu thích (Demo)",
    });
  };

  return (
    <Card className="sticky top-20">
      <CardContent className="p-4">
        <div className="flex flex-col gap-3">
          <Button
            variant={isLiked ? "default" : "outline"}
            size="sm"
            onClick={handleLike}
            className="justify-start gap-2"
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
            Thích ({likeCount})
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="justify-start gap-2"
          >
            <Share2 className="h-4 w-4" />
            Chia sẻ
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleComment}
            className="justify-start gap-2"
          >
            <MessageCircle className="h-4 w-4" />
            Bình luận
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleBookmark}
            className="justify-start gap-2"
          >
            <Bookmark className="h-4 w-4" />
            Lưu bài
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LikeShareActions;
