import { BlogPost } from '@/data/blogPosts';

// Export types
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

// FORCE DATABASE MODE - NO MOCK
const getSupabaseService = async () => {
  try {
    const { supabaseService } = await import('./supabaseService');
    return supabaseService;
  } catch (error) {
    console.error('Failed to load Supabase service:', error);
    throw error;
  }
};

// Blog service functions - FORCE DATABASE MODE ONLY
export const blogService = {
  // Initialize
  async init(): Promise<void> {
    try {
      console.log('🚀 BlogService: FORCE DATABASE MODE - NO MOCK');
      const supabaseService = await getSupabaseService();
      await supabaseService.initializeDefaultData();
      console.log('✅ BlogService: Database initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize blog service:', error);
      throw error;
    }
  },

  // Posts CRUD
  async getAllPosts(includeHidden: boolean = false): Promise<BlogPost[]> {
    try {
      const supabaseService = await getSupabaseService();
      return await supabaseService.getAllPosts(includeHidden);
    } catch (error) {
      console.error('Error getting posts:', error);
      throw error;
    }
  },

  async getPostById(id: string): Promise<BlogPost | null> {
    try {
      const supabaseService = await getSupabaseService();
      return await supabaseService.getPostById(id);
    } catch (error) {
      console.error('Error getting post by ID:', error);
      throw error;
    }
  },

  async createPost(postData: Omit<BlogPost, 'id' | 'publishedAt'>): Promise<BlogPost | null> {
    try {
      const supabaseService = await getSupabaseService();
      return await supabaseService.createPost(postData);
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  },

  async updatePost(id: string, updates: Partial<BlogPost>): Promise<BlogPost | null> {
    try {
      const supabaseService = await getSupabaseService();
      return await supabaseService.updatePost(id, updates);
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  },

  async deletePost(id: string): Promise<boolean> {
    try {
      const supabaseService = await getSupabaseService();
      const result = await supabaseService.deletePost(id);
      return result;
    } catch (error) {
      console.error('Error deleting post:', error);
      return false; // Return false on error instead of throwing
    }
  },

  async togglePostVisibility(id: string): Promise<boolean> {
    try {
      const supabaseService = await getSupabaseService();
      return await supabaseService.togglePostVisibility(id);
    } catch (error) {
      console.error('Error toggling post visibility:', error);
      return false;
    }
  },

  // Interactions
  async recordView(postId: string, userId: string): Promise<void> {
    try {
      const supabaseService = await getSupabaseService();
      await supabaseService.recordView(postId, userId);
    } catch (error) {
      console.error('Error recording view:', error);
      throw error;
    }
  },

  async toggleLike(postId: string, userId: string): Promise<boolean> {
    try {
      const supabaseService = await getSupabaseService();
      return await supabaseService.toggleLike(postId, userId);
    } catch (error) {
      console.error('Error toggling like:', error);
      return false; // Return false on error to prevent UI issues
    }
  },

  async recordShare(postId: string, userId: string): Promise<void> {
    try {
      const supabaseService = await getSupabaseService();
      await supabaseService.recordShare(postId, userId);
    } catch (error) {
      console.error('Error recording share:', error);
      // Don't throw error to prevent UI issues
    }
  },

  // Check if user has liked a post
  async checkUserLikeStatus(postId: string, userId: string): Promise<boolean> {
    try {
      const supabaseService = await getSupabaseService();
      return await supabaseService.checkUserLikeStatus(postId, userId);
    } catch (error) {
      console.error('Error checking like status:', error);
      return false;
    }
  },

  // Comments
  async getComments(postId: string): Promise<any[]> {
    try {
      const supabaseService = await getSupabaseService();
      return await supabaseService.getComments(postId);
    } catch (error) {
      console.error('Error getting comments:', error);
      throw error;
    }
  },

  async addComment(postId: string, userId: string, userName: string, content: string, parentId?: string): Promise<any> {
    try {
      const supabaseService = await getSupabaseService();
      return await supabaseService.addComment(postId, userId, userName, content, parentId);
    } catch (error) {
      console.error('Error adding comment:', error);
      return null; // Return null instead of throwing to prevent crashes
    }
  },

  async deleteComment(commentId: string): Promise<boolean> {
    try {
      const supabaseService = await getSupabaseService();
      return await supabaseService.deleteComment(commentId);
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  },

  // Analytics
  async getPostAnalytics(postId: string): Promise<any> {
    try {
      const supabaseService = await getSupabaseService();
      const post = await supabaseService.getPostById(postId);
      if (!post) return null;
      
      return {
        postId: post.id,
        views: post.views || 0,
        likes: post.likes || 0,
        shares: post.shares || 0,
        comments: 0,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting post analytics:', error);
      throw error;
    }
  },

  async getAllAnalytics(): Promise<Record<string, any>> {
    try {
      const supabaseService = await getSupabaseService();
      const posts = await supabaseService.getAllPosts();
      
      const analytics: Record<string, any> = {};
      
      for (const post of posts) {
        analytics[post.id] = {
          postId: post.id,
          title: post.title,
          views: post.views || 0,
          likes: post.likes || 0,
          shares: post.shares || 0,
          comments: 0,
          publishedAt: post.publishedAt,
          lastUpdated: new Date().toISOString()
        };
      }
      
      return analytics;
    } catch (error) {
      console.error('Error getting all analytics:', error);
      throw error;
    }
  },

  // Search and filtering
  async searchPosts(query: string): Promise<BlogPost[]> {
    try {
      const supabaseService = await getSupabaseService();
      const posts = await supabaseService.getAllPosts();
      
      const lowercaseQuery = query.toLowerCase();
      return posts.filter(post => 
        post.title.toLowerCase().includes(lowercaseQuery) ||
        post.excerpt.toLowerCase().includes(lowercaseQuery) ||
        post.content.toLowerCase().includes(lowercaseQuery) ||
        post.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
      );
    } catch (error) {
      console.error('Error searching posts:', error);
      throw error;
    }
  },

  async getPostsByTag(tag: string): Promise<BlogPost[]> {
    try {
      const supabaseService = await getSupabaseService();
      const posts = await supabaseService.getAllPosts();
      
      return posts.filter(post => 
        post.tags.some(postTag => postTag.toLowerCase() === tag.toLowerCase())
      );
    } catch (error) {
      console.error('Error getting posts by tag:', error);
      throw error;
    }
  }
};

// Initialize on import (with error handling)
blogService.init().catch(error => {
  console.error('Failed to initialize blog service:', error);
}); 