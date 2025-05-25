
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
}

export interface BlogFilter {
  search: string;
  tags: string[];
  sortBy: 'newest' | 'oldest' | 'popular';
}
