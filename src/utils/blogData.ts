
import { BlogPost } from '@/types/blog';

export const mockBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Hướng dẫn React Hooks từ cơ bản đến nâng cao',
    content: `React Hooks đã thay đổi cách chúng ta viết React components. Trong bài viết này, chúng ta sẽ tìm hiểu từ useState, useEffect đến các custom hooks phức tạp.

## useState - Quản lý state cơ bản

useState là hook cơ bản nhất để quản lý state trong functional components:

\`\`\`javascript
const [count, setCount] = useState(0);
\`\`\`

## useEffect - Xử lý side effects

useEffect giúp chúng ta xử lý các side effects như API calls, subscriptions:

\`\`\`javascript
useEffect(() => {
  fetchData();
}, [dependency]);
\`\`\`

## Custom Hooks

Tạo custom hooks để tái sử dụng logic:

\`\`\`javascript
const useCounter = (initialValue = 0) => {
  const [count, setCount] = useState(initialValue);
  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  return { count, increment, decrement };
};
\`\`\``,
    excerpt: 'Tìm hiểu cách sử dụng React Hooks hiệu quả từ cơ bản đến nâng cao với các ví dụ thực tế.',
    tags: ['React', 'JavaScript', 'Frontend', 'Hooks'],
    author: 'Nguyễn Văn A',
    publishedAt: '2024-01-15',
    readTime: 8,
    coverImage: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop',
    featured: true,
    category: 'Frontend',
    likes: 42,
    views: 856
  },
  {
    id: '2',
    title: 'TypeScript Best Practices cho dự án lớn',
    content: `TypeScript giúp tăng tính bảo mật và maintainability cho dự án JavaScript. Dưới đây là những best practices quan trọng.

## Interface vs Type

Khi nào dùng interface, khi nào dùng type:

\`\`\`typescript
interface User {
  id: string;
  name: string;
  email: string;
}

type Status = 'pending' | 'approved' | 'rejected';
\`\`\`

## Generic Types

Sử dụng generic để tạo code linh hoạt:

\`\`\`typescript
function identity<T>(arg: T): T {
  return arg;
}
\`\`\``,
    excerpt: 'Những thực hành tốt nhất khi sử dụng TypeScript trong dự án lớn.',
    tags: ['TypeScript', 'JavaScript', 'Best Practices'],
    author: 'Trần Thị B',
    publishedAt: '2024-01-12',
    readTime: 6,
    coverImage: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop',
    featured: false,
    category: 'Programming',
    likes: 28,
    views: 543
  },
  {
    id: '3',
    title: 'CSS Grid Layout - Bí quyết tạo layout hiện đại',
    content: `CSS Grid là công cụ mạnh mẽ để tạo layout phức tạp một cách dễ dàng.

## Grid Container

Tạo grid container:

\`\`\`css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;
}
\`\`\`

## Grid Areas

Định nghĩa areas cho layout:

\`\`\`css
.layout {
  display: grid;
  grid-template-areas: 
    "header header header"
    "sidebar main main"
    "footer footer footer";
}
\`\`\``,
    excerpt: 'Học cách sử dụng CSS Grid để tạo những layout phức tạp và responsive.',
    tags: ['CSS', 'Layout', 'Frontend', 'Grid'],
    author: 'Lê Văn C',
    publishedAt: '2024-01-10',
    readTime: 5,
    coverImage: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=400&fit=crop',
    featured: true,
    category: 'Frontend',
    likes: 35,
    views: 724
  },
  {
    id: '4',
    title: 'Node.js Performance Optimization',
    content: `Tối ưu hóa performance cho ứng dụng Node.js với các kỹ thuật nâng cao.

## Event Loop Understanding

Hiểu về event loop để tối ưu code:

\`\`\`javascript
// Blocking operation
const result = heavyOperation();

// Non-blocking operation
heavyOperationAsync((err, result) => {
  // Handle result
});
\`\`\`

## Memory Management

Quản lý memory hiệu quả:

\`\`\`javascript
// Avoid memory leaks
process.on('exit', () => {
  cleanup();
});
\`\`\``,
    excerpt: 'Các kỹ thuật tối ưu hóa performance cho ứng dụng Node.js.',
    tags: ['Node.js', 'Backend', 'Performance', 'JavaScript'],
    author: 'Phạm Văn D',
    publishedAt: '2024-01-08',
    readTime: 7,
    coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=400&fit=crop',
    featured: false,
    category: 'Backend',
    likes: 19,
    views: 432
  },
  {
    id: '5',
    title: 'Database Design Patterns với MongoDB',
    content: `Thiết kế database hiệu quả với MongoDB và các patterns phổ biến.

## Schema Design

Thiết kế schema linh hoạt:

\`\`\`javascript
const userSchema = new Schema({
  name: String,
  email: { type: String, unique: true },
  profile: {
    avatar: String,
    bio: String,
    preferences: {
      theme: { type: String, default: 'light' }
    }
  }
});
\`\`\`

## Indexing Strategies

Tối ưu queries với indexing:

\`\`\`javascript
// Compound index
db.users.createIndex({ "name": 1, "email": 1 });
\`\`\``,
    excerpt: 'Học cách thiết kế database MongoDB hiệu quả với các patterns phổ biến.',
    tags: ['MongoDB', 'Database', 'Backend', 'NoSQL'],
    author: 'Hoàng Thị E',
    publishedAt: '2024-01-05',
    readTime: 9,
    coverImage: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=400&fit=crop',
    featured: false,
    category: 'Database',
    likes: 31,
    views: 612
  }
];

let blogPosts = [...mockBlogPosts];

export const getAllPosts = (): BlogPost[] => {
  return blogPosts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
};

export const getPostById = (id: string): BlogPost | undefined => {
  return blogPosts.find(post => post.id === id);
};

export const getFeaturedPosts = (): BlogPost[] => {
  return blogPosts.filter(post => post.featured);
};

export const getAllTags = (): string[] => {
  const allTags = blogPosts.flatMap(post => post.tags);
  return [...new Set(allTags)].sort();
};

export const getAllCategories = (): string[] => {
  const allCategories = blogPosts.map(post => post.category);
  return [...new Set(allCategories)].sort();
};

export const addPost = (post: Omit<BlogPost, 'id' | 'likes' | 'views'>): BlogPost => {
  const newPost: BlogPost = {
    ...post,
    id: Date.now().toString(),
    likes: 0,
    views: 0,
  };
  blogPosts.unshift(newPost);
  return newPost;
};

export const updatePost = (id: string, updates: Partial<BlogPost>): BlogPost | null => {
  const index = blogPosts.findIndex(post => post.id === id);
  if (index === -1) return null;
  
  blogPosts[index] = { ...blogPosts[index], ...updates };
  return blogPosts[index];
};

export const deletePost = (id: string): boolean => {
  const index = blogPosts.findIndex(post => post.id === id);
  if (index === -1) return false;
  
  blogPosts.splice(index, 1);
  return true;
};

export const searchPosts = (query: string, tags: string[] = [], category: string = ''): BlogPost[] => {
  return blogPosts.filter(post => {
    const matchesQuery = query === '' || 
      post.title.toLowerCase().includes(query.toLowerCase()) ||
      post.content.toLowerCase().includes(query.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(query.toLowerCase());
    
    const matchesTags = tags.length === 0 || 
      tags.some(tag => post.tags.includes(tag));
    
    const matchesCategory = category === '' || post.category === category;
    
    return matchesQuery && matchesTags && matchesCategory;
  });
};

export const likePost = (id: string): boolean => {
  const post = getPostById(id);
  if (!post) return false;
  
  updatePost(id, { likes: post.likes + 1 });
  return true;
};

export const incrementViews = (id: string): boolean => {
  const post = getPostById(id);
  if (!post) return false;
  
  updatePost(id, { views: post.views + 1 });
  return true;
};
