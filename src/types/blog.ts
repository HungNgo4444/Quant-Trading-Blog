
export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  tags: string[];
  author: string;
  publishedAt: string;
  readTime: number;
  coverImage?: string;
  featured: boolean;
  category: string;
  likes: number;
  views: number;
}

export interface BlogFilter {
  search: string;
  tags: string[];
  category: string;
  sortBy: 'newest' | 'oldest' | 'popular' | 'most-liked';
}
