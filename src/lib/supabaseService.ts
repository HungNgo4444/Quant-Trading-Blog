import { supabase } from './supabase';
import { BlogPost } from '@/data/blogPosts';

// Types for Supabase
export interface SupabaseBlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  published_at: string;
  updated_at?: string;
  tags: string[];
  image_url?: string;
  read_time: number;
  views?: number;
  likes?: number;
  shares?: number;
  is_hidden?: boolean;
  created_at?: string;
}

export interface PostInteraction {
  id?: string;
  post_id: string;
  user_id: string;
  type: 'like' | 'share' | 'view';
  created_at?: string;
}

export interface Comment {
  id?: string;
  post_id: string;
  user_id: string;
  user_name: string;
  content: string;
  parent_id?: string;
  created_at?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  is_email_verified: boolean;
  created_at?: string;
  last_login_at?: string;
}

// Convert Supabase format to BlogPost format
const convertToBlogPost = (supabasePost: SupabaseBlogPost): BlogPost => ({
  id: supabasePost.id,
  title: supabasePost.title,
  content: supabasePost.content,
  excerpt: supabasePost.excerpt,
  author: supabasePost.author,
  publishedAt: supabasePost.published_at,
  updatedAt: supabasePost.updated_at,
  tags: supabasePost.tags,
  imageUrl: supabasePost.image_url,
  readTime: supabasePost.read_time,
  views: supabasePost.views || 0,
  likes: supabasePost.likes || 0,
  shares: supabasePost.shares || 0,
  isHidden: supabasePost.is_hidden || false
});

// Convert BlogPost format to Supabase format
const convertToSupabasePost = (blogPost: Partial<BlogPost>): Partial<SupabaseBlogPost> => ({
  id: blogPost.id,
  title: blogPost.title,
  content: blogPost.content,
  excerpt: blogPost.excerpt,
  author: blogPost.author,
  published_at: blogPost.publishedAt,
  updated_at: blogPost.updatedAt,
  tags: blogPost.tags,
  image_url: blogPost.imageUrl,
  read_time: blogPost.readTime,
  views: blogPost.views,
  likes: blogPost.likes,
  shares: blogPost.shares,
  is_hidden: blogPost.isHidden
});

export const supabaseService = {
  // Initialize default data
  async initializeDefaultData(): Promise<void> {
    try {
      // Check if posts already exist
      const { data: existingPosts } = await supabase
        .from('blog_posts')
        .select('id')
        .limit(1);

      if (existingPosts && existingPosts.length > 0) {
        return; // Data already exists
      }

      // Insert default posts
      const defaultPosts = [
        {
          id: '1',
          title: 'Giới thiệu về Quantitative Trading',
          excerpt: 'Tìm hiểu về giao dịch định lượng và cách áp dụng toán học, thống kê vào đầu tư tài chính.',
          content: `# Giới thiệu về Quantitative Trading

Quantitative Trading (Giao dịch định lượng) là phương pháp đầu tư sử dụng các mô hình toán học và thống kê để đưa ra quyết định giao dịch.

## Đặc điểm chính

- **Dựa trên dữ liệu**: Sử dụng dữ liệu lịch sử và real-time
- **Tự động hóa**: Giảm thiểu can thiệp thủ công
- **Quản lý rủi ro**: Kiểm soát chặt chẽ rủi ro

## Lợi ích

1. Loại bỏ cảm xúc trong giao dịch
2. Xử lý khối lượng dữ liệu lớn
3. Thực hiện giao dịch nhanh chóng
4. Backtesting chiến lược

Quantitative Trading đang ngày càng phổ biến trong thế giới tài chính hiện đại.`,
          author: 'Quant Trader',
          published_at: '2024-01-15T10:00:00Z',
          read_time: 5,
          tags: ['Quantitative Trading', 'Giới thiệu', 'Tài chính'],
          image_url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop',
          views: 150,
          likes: 12,
          shares: 3
        },
        {
          id: '2',
          title: 'Python cho Quantitative Analysis',
          excerpt: 'Hướng dẫn sử dụng Python và các thư viện phổ biến trong phân tích định lượng.',
          content: `# Python cho Quantitative Analysis

Python là ngôn ngữ lập trình phổ biến nhất trong lĩnh vực phân tích định lượng.

## Thư viện quan trọng

### NumPy
\`\`\`python
import numpy as np
prices = np.array([100, 102, 98, 105, 103])
returns = np.diff(prices) / prices[:-1]
\`\`\`

### Pandas
\`\`\`python
import pandas as pd
df = pd.read_csv('stock_data.csv')
df['returns'] = df['close'].pct_change()
\`\`\`

### Matplotlib
\`\`\`python
import matplotlib.pyplot as plt
plt.plot(df['close'])
plt.title('Stock Price')
plt.show()
\`\`\`

## Ứng dụng thực tế

1. **Phân tích dữ liệu**: Xử lý và làm sạch dữ liệu tài chính
2. **Tính toán chỉ số**: RSI, MACD, Bollinger Bands
3. **Backtesting**: Kiểm tra hiệu quả chiến lược
4. **Visualization**: Trực quan hóa dữ liệu

Python cung cấp ecosystem mạnh mẽ cho quant analysis.`,
          author: 'Quant Trader',
          published_at: '2024-01-10T14:30:00Z',
          read_time: 8,
          tags: ['Python', 'Programming', 'Data Analysis'],
          image_url: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&h=400&fit=crop',
          views: 89,
          likes: 8,
          shares: 2
        },
        {
          id: '3',
          title: 'Backtesting Strategies với Python',
          excerpt: 'Cách thực hiện backtesting để đánh giá hiệu quả của chiến lược giao dịch.',
          content: `# Backtesting Strategies với Python

Backtesting là quá trình kiểm tra hiệu quả của chiến lược giao dịch bằng dữ liệu lịch sử.

## Quy trình Backtesting

### 1. Chuẩn bị dữ liệu
\`\`\`python
import yfinance as yf
import pandas as pd

# Tải dữ liệu
data = yf.download('AAPL', start='2020-01-01', end='2023-01-01')
\`\`\`

### 2. Định nghĩa chiến lược
\`\`\`python
def moving_average_strategy(data, short_window=20, long_window=50):
    signals = pd.DataFrame(index=data.index)
    signals['price'] = data['Close']
    signals['short_ma'] = data['Close'].rolling(window=short_window).mean()
    signals['long_ma'] = data['Close'].rolling(window=long_window).mean()
    
    # Tín hiệu mua/bán
    signals['signal'] = 0
    signals['signal'][short_window:] = np.where(
        signals['short_ma'][short_window:] > signals['long_ma'][short_window:], 1, 0
    )
    signals['positions'] = signals['signal'].diff()
    
    return signals
\`\`\`

### 3. Tính toán kết quả
\`\`\`python
def calculate_returns(signals):
    # Tính lợi nhuận
    signals['returns'] = signals['price'].pct_change()
    signals['strategy_returns'] = signals['returns'] * signals['signal'].shift(1)
    
    # Thống kê
    total_return = (1 + signals['strategy_returns']).prod() - 1
    sharpe_ratio = signals['strategy_returns'].mean() / signals['strategy_returns'].std() * np.sqrt(252)
    
    return total_return, sharpe_ratio
\`\`\`

## Metrics quan trọng

- **Total Return**: Tổng lợi nhuận
- **Sharpe Ratio**: Tỷ lệ rủi ro/lợi nhuận
- **Maximum Drawdown**: Mức thua lỗ tối đa
- **Win Rate**: Tỷ lệ thắng

## Lưu ý quan trọng

1. **Overfitting**: Tránh tối ưu hóa quá mức
2. **Transaction Costs**: Tính phí giao dịch
3. **Market Regime**: Xem xét các giai đoạn thị trường khác nhau
4. **Out-of-sample Testing**: Kiểm tra ngoài mẫu

Backtesting giúp đánh giá chiến lược trước khi áp dụng thực tế.`,
          author: 'Quant Trader',
          published_at: '2024-01-05T09:15:00Z',
          read_time: 10,
          tags: ['Backtesting', 'Strategy', 'Python', 'Testing'],
          image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
          views: 234,
          likes: 18,
          shares: 7
        }
      ];

      const { error } = await supabase
        .from('blog_posts')
        .insert(defaultPosts);

      if (error) {
        console.error('Error inserting default posts:', error);
      }

      // Create default admin user
      const { error: authError } = await supabase.auth.signUp({
        email: 'admin@quantblog.com',
        password: 'admin123',
        options: {
          data: {
            name: 'Quant Admin',
            role: 'admin'
          }
        }
      });

      if (authError && authError.message !== 'User already registered') {
        console.error('Error creating admin user:', authError);
      }

    } catch (error) {
      console.error('Error initializing default data:', error);
    }
  },

  // Posts CRUD
  async getAllPosts(includeHidden: boolean = false): Promise<BlogPost[]> {
    try {
      let query = supabase
        .from('blog_posts')
        .select('*');
      
      // Filter out hidden posts unless explicitly requested
      if (!includeHidden) {
        query = query.eq('is_hidden', false);
      }
      
      const { data, error } = await query.order('published_at', { ascending: false });

      if (error) throw error;

      return data ? data.map(convertToBlogPost) : [];
    } catch (error) {
      console.error('Error fetching posts:', error);
      return [];
    }
  },

  async getPostById(id: string): Promise<BlogPost | null> {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return data ? convertToBlogPost(data) : null;
    } catch (error) {
      console.error('Error fetching post:', error);
      return null;
    }
  },

  async createPost(postData: Omit<BlogPost, 'id' | 'publishedAt'>): Promise<BlogPost | null> {
    try {
      // Generate unique ID using timestamp + random string
      const uniqueId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const newPost = {
        ...convertToSupabasePost(postData),
        id: uniqueId,
        published_at: new Date().toISOString(),
        views: 0,
        likes: 0,
        shares: 0
      };

      console.log('📝 Creating new post:', newPost.title, 'with ID:', uniqueId);

      const { data, error } = await supabase
        .from('blog_posts')
        .insert([newPost])
        .select()
        .single();

      if (error) {
        console.error('Error creating post:', error);
        throw error;
      }

      console.log('✅ Post created successfully:', data.id);
      return data ? convertToBlogPost(data) : null;
    } catch (error) {
      console.error('Error creating post:', error);
      return null;
    }
  },

  async updatePost(id: string, updates: Partial<BlogPost>): Promise<BlogPost | null> {
    try {
      const supabaseUpdates = {
        ...convertToSupabasePost(updates),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('blog_posts')
        .update(supabaseUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return data ? convertToBlogPost(data) : null;
    } catch (error) {
      console.error('Error updating post:', error);
      return null;
    }
  },

  async deletePost(id: string): Promise<boolean> {
    try {
      console.log(`🗑️ Deleting post ${id} and related data...`);
      
      // First delete related interactions and comments (foreign key constraints)
      const { error: interactionsError } = await supabase
        .from('post_interactions')
        .delete()
        .eq('post_id', id);
      
      if (interactionsError) {
        console.error('Error deleting interactions:', interactionsError);
      }

      const { error: commentsError } = await supabase
        .from('comments')
        .delete()
        .eq('post_id', id);
      
      if (commentsError) {
        console.error('Error deleting comments:', commentsError);
      }

      // Then delete the post itself
      const { error: postError } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (postError) {
        console.error('Error deleting post:', postError);
        throw postError;
      }

      console.log(`✅ Post ${id} deleted successfully`);
      return true;
    } catch (error) {
      console.error('Error deleting post:', error);
      return false;
    }
  },

  async togglePostVisibility(id: string): Promise<boolean> {
    try {
      console.log(`👁️ Toggling visibility for post ${id}...`);
      
      // Get current status
      const { data: post, error: getError } = await supabase
        .from('blog_posts')
        .select('is_hidden')
        .eq('id', id)
        .single();

      if (getError) {
        console.error('Error getting post visibility:', getError);
        throw getError;
      }

      // Toggle visibility
      const newHiddenStatus = !post.is_hidden;
      const { error: updateError } = await supabase
        .from('blog_posts')
        .update({ is_hidden: newHiddenStatus })
        .eq('id', id);

      if (updateError) {
        console.error('Error updating post visibility:', updateError);
        throw updateError;
      }

      console.log(`✅ Post ${id} ${newHiddenStatus ? 'hidden' : 'shown'} successfully`);
      return true;
    } catch (error) {
      console.error('Error toggling post visibility:', error);
      return false;
    }
  },

  // Interactions
  async recordView(postId: string, userId?: string): Promise<void> {
    try {
      if (userId) {
        // Logged in user - check for duplicate views today
        const today = new Date().toISOString().split('T')[0];
        const { data: existingView } = await supabase
          .from('post_interactions')
          .select('id')
          .eq('post_id', postId)
          .eq('user_id', userId)
          .eq('type', 'view')
          .gte('created_at', `${today}T00:00:00.000Z`)
          .maybeSingle();

        if (existingView) {
          console.log('User already viewed this post today');
          return;
        }

        // Insert interaction for logged in user
        await supabase
          .from('post_interactions')
          .insert([{
            post_id: postId,
            user_id: userId,
            type: 'view'
          }]);
      } else {
        // Anonymous user - use session-based tracking
        await this.recordAnonymousView(postId);
      }

      // Update post views count
      const { data: post } = await supabase
        .from('blog_posts')
        .select('views')
        .eq('id', postId)
        .single();

      if (post) {
        await supabase
          .from('blog_posts')
          .update({ views: (post.views || 0) + 1 })
          .eq('id', postId);
      }
    } catch (error) {
      console.error('Error recording view:', error);
    }
  },

  async recordAnonymousView(postId: string): Promise<void> {
    try {
      // Generate or get session ID for anonymous user
      const sessionId = this.getOrCreateSessionId();
      
      // Check if this session already viewed this post today
      const today = new Date().toISOString().split('T')[0];
      const viewKey = `view_${postId}_${sessionId}_${today}`;
      
      if (localStorage.getItem(viewKey)) {
        console.log('Anonymous user already viewed this post today');
        return;
      }

      // Mark as viewed in localStorage
      localStorage.setItem(viewKey, 'true');
      
      // Optional: Store anonymous view in database for analytics
      await supabase
        .from('post_interactions')
        .insert([{
          post_id: postId,
          user_id: `anonymous_${sessionId}`,
          type: 'view'
        }]);

      console.log(`✅ Anonymous view recorded for post ${postId}`);
    } catch (error) {
      console.error('Error recording anonymous view:', error);
    }
  },

  getOrCreateSessionId(): string {
    let sessionId = localStorage.getItem('blog_session_id');
    
    if (!sessionId) {
      // Create a unique session ID
      sessionId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('blog_session_id', sessionId);
    }
    
    return sessionId;
  },

  // Clean up old view records from localStorage (call this periodically)
  cleanupOldViewRecords(): void {
    try {
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      // Remove view records older than yesterday
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('view_') && !key.includes(today) && !key.includes(yesterday)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error cleaning up old view records:', error);
    }
  },

  async toggleLike(postId: string, userId: string): Promise<boolean> {
    try {
      console.log(`❤️ Toggling like for post ${postId} by user ${userId}`);
      
      // Check if already liked
      const { data: existingLike, error: checkError } = await supabase
        .from('post_interactions')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', userId)
        .eq('type', 'like')
        .maybeSingle();

      if (checkError) {
        console.error('Error checking like status:', checkError);
        throw checkError;
      }

      if (existingLike) {
        console.log('🔄 Removing like...');
        // Remove like
        const { error: deleteError } = await supabase
          .from('post_interactions')
          .delete()
          .eq('id', existingLike.id);

        if (deleteError) {
          console.error('Error removing like:', deleteError);
          throw deleteError;
        }

        // Decrease likes count
        const { data: post, error: getPostError } = await supabase
          .from('blog_posts')
          .select('likes')
          .eq('id', postId)
          .single();

        if (getPostError) {
          console.error('Error getting post for like count:', getPostError);
          throw getPostError;
        }

        if (post) {
          const newLikesCount = Math.max(0, (post.likes || 0) - 1);
          const { error: updateError } = await supabase
            .from('blog_posts')
            .update({ likes: newLikesCount })
            .eq('id', postId);

          if (updateError) {
            console.error('Error updating likes count:', updateError);
            throw updateError;
          }
          
          console.log(`✅ Like removed. New count: ${newLikesCount}`);
        }

        return false; // Unliked
      } else {
        console.log('➕ Adding like...');
        // Add like
        const { error: insertError } = await supabase
          .from('post_interactions')
          .insert([{
            post_id: postId,
            user_id: userId,
            type: 'like'
          }]);

        if (insertError) {
          console.error('Error adding like:', insertError);
          throw insertError;
        }

        // Increase likes count
        const { data: post, error: getPostError } = await supabase
          .from('blog_posts')
          .select('likes')
          .eq('id', postId)
          .single();

        if (getPostError) {
          console.error('Error getting post for like count:', getPostError);
          throw getPostError;
        }

        if (post) {
          const newLikesCount = (post.likes || 0) + 1;
          const { error: updateError } = await supabase
            .from('blog_posts')
            .update({ likes: newLikesCount })
            .eq('id', postId);

          if (updateError) {
            console.error('Error updating likes count:', updateError);
            throw updateError;
          }
          
          console.log(`✅ Like added. New count: ${newLikesCount}`);
        }

        return true; // Liked
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      return false; // Return false instead of throwing to prevent UI crashes
    }
  },

  async recordShare(postId: string, userId: string): Promise<void> {
    try {
      console.log(`📤 Recording share for post ${postId} by user ${userId}`);
      
      // Insert interaction
      const { error: insertError } = await supabase
        .from('post_interactions')
        .insert([{
          post_id: postId,
          user_id: userId,
          type: 'share'
        }]);

      if (insertError) {
        console.error('Error inserting share interaction:', insertError);
        throw insertError;
      }

      // Update post shares count
      const { data: post, error: getPostError } = await supabase
        .from('blog_posts')
        .select('shares')
        .eq('id', postId)
        .single();

      if (getPostError) {
        console.error('Error getting post for share count:', getPostError);
        throw getPostError;
      }

      if (post) {
        const newSharesCount = (post.shares || 0) + 1;
        const { error: updateError } = await supabase
          .from('blog_posts')
          .update({ shares: newSharesCount })
          .eq('id', postId);

        if (updateError) {
          console.error('Error updating shares count:', updateError);
          throw updateError;
        }
        
        console.log(`✅ Share recorded. New count: ${newSharesCount}`);
      }
    } catch (error) {
      console.error('Error recording share:', error);
      // Don't throw error to prevent UI crashes
    }
  },

  // Check if user has liked a post
  async checkUserLikeStatus(postId: string, userId: string): Promise<boolean> {
    try {
      console.log(`🔍 Checking like status for post ${postId} by user ${userId}`);
      
      const { data, error } = await supabase
        .from('post_interactions')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', userId)
        .eq('type', 'like')
        .maybeSingle();

      if (error) {
        console.error('Error checking like status:', error);
        return false;
      }

      const isLiked = !!data;
      console.log(`✅ Like status for post ${postId}: ${isLiked ? 'LIKED' : 'NOT LIKED'}`);
      return isLiked;
    } catch (error) {
      console.error('Error checking like status:', error);
      return false;
    }
  },

  // Comments
  async getComments(postId: string): Promise<Comment[]> {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
  },

  async addComment(postId: string, userId: string, userName: string, content: string, parentId?: string): Promise<Comment | null> {
    try {
      console.log(`💬 Adding comment to post ${postId} by user ${userName}`);
      
      const commentData = {
        post_id: postId,
        user_id: userId,
        user_name: userName,
        content: content.trim(),
        parent_id: parentId || null
      };

      const { data, error } = await supabase
        .from('comments')
        .insert([commentData])
        .select()
        .single();

      if (error) {
        console.error('Error adding comment:', error);
        throw error;
      }

      console.log(`✅ Comment added successfully:`, data.id);
      return data;
    } catch (error) {
      console.error('Error adding comment:', error);
      return null;
    }
  },

  async deleteComment(commentId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error deleting comment:', error);
      return false;
    }
  },

  // Search and filter
  async searchPosts(query: string): Promise<BlogPost[]> {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .or(`title.ilike.%${query}%,content.ilike.%${query}%,excerpt.ilike.%${query}%`)
        .order('published_at', { ascending: false });

      if (error) throw error;

      return data ? data.map(convertToBlogPost) : [];
    } catch (error) {
      console.error('Error searching posts:', error);
      return [];
    }
  },

  async getPostsByTag(tag: string): Promise<BlogPost[]> {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .contains('tags', [tag])
        .order('published_at', { ascending: false });

      if (error) throw error;

      return data ? data.map(convertToBlogPost) : [];
    } catch (error) {
      console.error('Error fetching posts by tag:', error);
      return [];
    }
  }
}; 