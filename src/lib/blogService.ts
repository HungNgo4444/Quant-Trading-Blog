import { BlogPost } from '@/data/blogPosts';
import { supabaseService } from './supabaseService';

// Export types from supabaseService
export type { PostInteraction, Comment } from './supabaseService';

// Blog service functions - now using Supabase
export const blogService = {
  // Initialize
  async init(): Promise<void> {
    await supabaseService.initializeDefaultData();
  },

  // Posts CRUD
  async getAllPosts(): Promise<BlogPost[]> {
    return await supabaseService.getAllPosts();
  },

  async getPostById(id: string): Promise<BlogPost | null> {
    return await supabaseService.getPostById(id);
  },

  async createPost(postData: Omit<BlogPost, 'id' | 'publishedAt'>): Promise<BlogPost | null> {
    return await supabaseService.createPost(postData);
  },

  async updatePost(id: string, updates: Partial<BlogPost>): Promise<BlogPost | null> {
    return await supabaseService.updatePost(id, updates);
  },

  async deletePost(id: string): Promise<boolean> {
    return await supabaseService.deletePost(id);
  },

  // Interactions
  async recordView(postId: string, userId: string): Promise<void> {
    await supabaseService.recordView(postId, userId);
  },

  async toggleLike(postId: string, userId: string): Promise<boolean> {
    return await supabaseService.toggleLike(postId, userId);
  },

  async recordShare(postId: string, userId: string): Promise<void> {
    await supabaseService.recordShare(postId, userId);
  },

  // Comments
  async getComments(postId: string): Promise<any[]> {
    return await supabaseService.getComments(postId);
  },

  async addComment(postId: string, userId: string, userName: string, content: string, parentId?: string): Promise<any> {
    return await supabaseService.addComment(postId, userId, userName, content, parentId);
  },

  async deleteComment(commentId: string): Promise<boolean> {
    return await supabaseService.deleteComment(commentId);
  },

  // Analytics
  async getPostAnalytics(postId: string): Promise<any> {
    // For compatibility with existing code
    const post = await supabaseService.getPostById(postId);
    if (!post) return null;
    
    return {
      postId: post.id,
      views: post.views || 0,
      likes: post.likes || 0,
      shares: post.shares || 0,
      comments: 0, // Will be calculated from comments table
      lastUpdated: new Date().toISOString()
    };
  },

  async getAllAnalytics(): Promise<Record<string, any>> {
    const posts = await supabaseService.getAllPosts();
    const analytics: Record<string, any> = {};
    
    posts.forEach(post => {
      analytics[post.id] = {
        postId: post.id,
        views: post.views || 0,
        likes: post.likes || 0,
        shares: post.shares || 0,
        comments: 0,
        lastUpdated: new Date().toISOString()
      };
    });
    
    return analytics;
  },

  // Search and filter
  async searchPosts(query: string): Promise<BlogPost[]> {
    return await supabaseService.searchPosts(query);
  },

  async getPostsByTag(tag: string): Promise<BlogPost[]> {
    return await supabaseService.getPostsByTag(tag);
  }
};

// Initialize on import (with error handling)
blogService.init().catch(error => {
  console.error('Failed to initialize blog service:', error);
}); 