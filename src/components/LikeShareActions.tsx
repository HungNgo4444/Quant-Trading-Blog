import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Share2, 
  MessageCircle, 
  Send,
  Trash2,
  Reply,
  X
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { blogService, Comment } from '@/lib/blogService';
import { toast } from '@/hooks/use-toast';

interface LikeShareActionsProps {
  postId: string;
  initialLikes?: number;
  initialShares?: number;
  showComments?: boolean;
}

interface CommentData {
  id: string;
  post_id: string;
  user_id: string;
  user_name: string;
  content: string;
  parent_id?: string;
  created_at: string;
  userId: string;
  userName: string;
  parentId?: string;
  timestamp: string;
}

const LikeShareActions = ({ 
  postId, 
  initialLikes = 0, 
  initialShares = 0,
  showComments = true 
}: LikeShareActionsProps) => {
  const { user, isAuthenticated } = useAuth();
  
  const [likes, setLikes] = useState(initialLikes);
  const [shares, setShares] = useState(initialShares);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState<CommentData[]>([]);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (showComments) {
      loadComments();
    }
    
    // Record view when component mounts
    if (user) {
      blogService.recordView(postId, user.id);
      checkUserLikeStatus();
    }
  }, [postId, showComments, user]);

  const checkUserLikeStatus = async () => {
    if (!user) return;
    
    try {
      console.log(`🔍 Checking like status for post ${postId} by user ${user.id}`);
      const liked = await blogService.checkUserLikeStatus(postId, user.id);
      setIsLiked(liked);
      console.log(`✅ User like status loaded: ${liked ? 'LIKED' : 'NOT LIKED'}`);
    } catch (error) {
      console.error('Error checking like status:', error);
    }
  };

  const loadComments = async () => {
    try {
      console.log(`📥 Loading comments for post ${postId}...`);
      const postComments = await blogService.getComments(postId);
      
      // Convert to CommentData format
      const formattedComments = postComments.map(comment => ({
        ...comment,
        userId: comment.user_id,
        userName: comment.user_name,
        parentId: comment.parent_id,
        timestamp: comment.created_at || new Date().toISOString()
      }));
      
      setComments(formattedComments);
      console.log(`✅ Loaded ${formattedComments.length} comments`);
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Yêu cầu đăng nhập",
        description: "Vui lòng đăng nhập để thích bài viết",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log(`🔄 Handling like for post ${postId} by user ${user.id}`);
      const liked = await blogService.toggleLike(postId, user.id);
      
      // Update local state
      setIsLiked(liked);
      setLikes(prev => liked ? prev + 1 : prev - 1);
      
      // Don't refresh data automatically to prevent issues
      // User can refresh page manually if needed
      
      toast({
        title: liked ? "Đã thích bài viết" : "Đã bỏ thích",
        description: liked ? "Cảm ơn bạn đã thích bài viết này!" : "Đã bỏ thích bài viết"
      });
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi thích bài viết",
        variant: "destructive"
      });
    }
  };

  const handleShare = async () => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Yêu cầu đăng nhập",
        description: "Vui lòng đăng nhập để chia sẻ bài viết",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log(`📤 Handling share for post ${postId} by user ${user.id}`);
      
      // Copy URL to clipboard
      const url = `${window.location.origin}/post/${postId}`;
      await navigator.clipboard.writeText(url);
      
      // Record share
      await blogService.recordShare(postId, user.id);
      setShares(prev => prev + 1);
      
      // Don't refresh data automatically to prevent issues
      // User can refresh page manually if needed
      
      toast({
        title: "Đã sao chép liên kết",
        description: "Liên kết bài viết đã được sao chép vào clipboard"
      });
    } catch (error) {
      console.error('Error sharing:', error);
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi chia sẻ bài viết",
        variant: "destructive"
      });
    }
  };

  const handleSubmitComment = async (e?: React.FormEvent) => {
    // Prevent form submission if this is called from a form
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!isAuthenticated || !user) {
      toast({
        title: "Yêu cầu đăng nhập",
        description: "Vui lòng đăng nhập để bình luận",
        variant: "destructive"
      });
      return;
    }

    if (!commentText.trim()) {
      toast({
        title: "Nội dung trống",
        description: "Vui lòng nhập nội dung bình luận",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('🔄 Submitting comment...');
      const result = await blogService.addComment(
        postId, 
        user.id, 
        user.name, 
        commentText.trim(),
        replyTo || undefined
      );
      
      if (result) {
        console.log('✅ Comment submitted successfully');
        setCommentText('');
        setReplyTo(null);
        setShowCommentForm(false);
        
        // Reload comments without causing page reload
        try {
          await loadComments();
        } catch (loadError) {
          console.error('Error reloading comments:', loadError);
        }
        
        toast({
          title: "Bình luận thành công",
          description: "Cảm ơn bạn đã bình luận!"
        });
      } else {
        throw new Error('Failed to add comment');
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi gửi bình luận",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa bình luận này?')) {
      return;
    }

    try {
      await blogService.deleteComment(commentId);
      await loadComments();
      
      toast({
        title: "Đã xóa bình luận",
        description: "Bình luận đã được xóa thành công"
      });
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi xóa bình luận",
        variant: "destructive"
      });
    }
  };

  const handleReply = (commentId: string, userName: string) => {
    setReplyTo(commentId);
    setCommentText(`@${userName} `);
    setShowCommentForm(true);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Vừa xong';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} giờ trước`;
    } else if (diffInHours < 24 * 7) {
      return `${Math.floor(diffInHours / 24)} ngày trước`;
    } else {
      return date.toLocaleDateString('vi-VN');
    }
  };

  // Group comments by parent/child
  const topLevelComments = comments.filter(c => !c.parentId);
  const getReplies = (parentId: string) => comments.filter(c => c.parentId === parentId);

  return (
    <div className="space-y-6">
      {/* Action buttons */}
      <div className="flex items-center gap-4 py-4 border-t border-b">
        <Button
          variant={isLiked ? "default" : "outline"}
          size="sm"
          onClick={handleLike}
          className="flex items-center gap-2"
        >
          <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
          {likes} Thích
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleShare}
          className="flex items-center gap-2"
        >
          <Share2 className="h-4 w-4" />
          {shares} Chia sẻ
        </Button>
        
        {showComments && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (!isAuthenticated) {
                toast({
                  title: "Yêu cầu đăng nhập",
                  description: "Vui lòng đăng nhập để bình luận",
                  variant: "destructive"
                });
                return;
              }
              setShowCommentForm(!showCommentForm);
            }}
            className="flex items-center gap-2"
          >
            <MessageCircle className="h-4 w-4" />
            {comments.length} Bình luận
          </Button>
        )}
      </div>

      {/* Comment form */}
      {showComments && showCommentForm && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">
                {replyTo ? 'Trả lời bình luận' : 'Viết bình luận'}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowCommentForm(false);
                  setReplyTo(null);
                  setCommentText('');
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {replyTo && (
              <Badge variant="secondary">
                Đang trả lời bình luận
              </Badge>
            )}
            
            <Textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={isAuthenticated ? "Viết bình luận của bạn..." : "Vui lòng đăng nhập để bình luận"}
              rows={4}
              disabled={!isAuthenticated}
            />
            
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCommentForm(false);
                  setReplyTo(null);
                  setCommentText('');
                }}
              >
                Hủy
              </Button>
              <Button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSubmitComment();
                }}
                disabled={!isAuthenticated || !commentText.trim() || isSubmitting}
              >
                <Send className="mr-2 h-4 w-4" />
                {isSubmitting ? 'Đang gửi...' : 'Gửi bình luận'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comments list */}
      {showComments && comments.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Bình luận ({comments.length})</h3>
          
          {topLevelComments.map((comment) => (
            <div key={comment.id} className="space-y-3">
              {/* Main comment */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                        {getInitials(comment.userName)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{comment.userName}</span>
                        <span className="text-xs text-gray-500">
                          {formatDate(comment.timestamp)}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-700 mb-2">{comment.content}</p>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleReply(comment.id, comment.userName)}
                          className="text-xs h-6 px-2"
                        >
                          <Reply className="h-3 w-3 mr-1" />
                          Trả lời
                        </Button>
                        
                        {user && (user.id === comment.userId || user.role === 'admin') && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteComment(comment.id)}
                            className="text-xs h-6 px-2 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Xóa
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Replies */}
              {getReplies(comment.id).map((reply) => (
                <div key={reply.id} className="ml-8">
                  <Card className="bg-gray-50">
                    <CardContent className="p-3">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                            {getInitials(reply.userName)}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-xs">{reply.userName}</span>
                            <span className="text-xs text-gray-500">
                              {formatDate(reply.timestamp)}
                            </span>
                          </div>
                          
                          <p className="text-xs text-gray-700 mb-1">{reply.content}</p>
                          
                          {user && (user.id === reply.userId || user.role === 'admin') && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteComment(reply.id)}
                              className="text-xs h-5 px-1 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Xóa
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LikeShareActions; 