import { useState, useEffect } from 'react';
import { Eye, Users, UserCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';

interface ViewTrackerProps {
  postId: string;
  views: number;
}

const ViewTracker = ({ postId, views }: ViewTrackerProps) => {
  const { user } = useAuth();
  const [sessionId, setSessionId] = useState<string>('');
  const [hasViewedToday, setHasViewedToday] = useState(false);

  useEffect(() => {
    // Get session ID for anonymous users
    if (!user) {
      const storedSessionId = localStorage.getItem('blog_session_id');
      if (storedSessionId) {
        setSessionId(storedSessionId.slice(-8)); // Show last 8 characters
      }

      // Check if viewed today
      const today = new Date().toISOString().split('T')[0];
      const viewKey = `view_${postId}_${storedSessionId}_${today}`;
      setHasViewedToday(!!localStorage.getItem(viewKey));
    }
  }, [postId, user]);

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <Eye className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">{views} lượt xem</span>
                {user ? (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <UserCheck className="h-3 w-3" />
                    Đã đăng nhập
                  </Badge>
                ) : (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    Khách
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-600">
                {user ? (
                  'View được tính cho tài khoản của bạn'
                ) : (
                  <>
                    View được tính cho session: 
                    <code className="ml-1 px-1 bg-gray-100 rounded text-xs">
                      ...{sessionId}
                    </code>
                    {hasViewedToday && (
                      <span className="ml-2 text-green-600 text-xs">
                        ✓ Đã xem hôm nay
                      </span>
                    )}
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
        
        {!user && (
          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 <strong>Tip:</strong> Đăng nhập để view được tính chính xác hơn và tránh duplicate counting.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ViewTracker; 