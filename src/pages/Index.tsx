import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import SearchAndFilter from '@/components/SearchAndFilter';
import BlogCard from '@/components/BlogCard';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Info } from 'lucide-react';
import { BlogPost } from '@/data/blogPosts';
import { blogService } from '@/lib/blogService';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { isSupabaseEnabled } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setIsLoading(true);
    try {
      const allPosts = await blogService.getAllPosts();
      setPosts(allPosts);
      setFilteredPosts(allPosts);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    applyFilters(query, selectedTags, selectedTopics);
  };

  const handleTagFilter = async (tags: string[]) => {
    setSelectedTags(tags);
    applyFilters(searchQuery, tags, selectedTopics);
  };

  const handleTopicFilter = async (topics: string[]) => {
    setSelectedTopics(topics);
    applyFilters(searchQuery, selectedTags, topics);
  };

  const applyFilters = async (query: string, tags: string[], topics: string[]) => {
    try {
      let filtered = [...posts];

      // Apply search filter
      if (query.trim()) {
        const searchResults = await blogService.searchPosts(query);
        filtered = searchResults;
      }

      // Apply tag filter
      if (tags.length > 0) {
        filtered = filtered.filter(post => 
          tags.some(tag => post.tags.includes(tag))
        );
      }

      // Apply topic filter (assuming topics are a subset of tags or a separate field)
      if (topics.length > 0) {
        filtered = filtered.filter(post => 
          topics.some(topic => 
            post.tags.includes(topic) || 
            post.title.toLowerCase().includes(topic.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(topic.toLowerCase())
          )
        );
      }

      setFilteredPosts(filtered);
    } catch (error) {
      console.error('Error applying filters:', error);
    }
  };

  // Get all unique tags from posts
  const allTags = Array.from(new Set(posts.flatMap(post => post.tags)));
  
  // Define available topics (categories)
  const availableTopics = [
    'Quantitative Trading',
    'Python',
    'Machine Learning', 
    'Data Analysis',
    'Backtesting',
    'Strategy',
    'Programming',
    'Tài chính',
    'Phân tích dữ liệu',
    'Giao dịch định lượng'
  ];

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedTags([]);
    setSelectedTopics([]);
    setFilteredPosts(posts);
  };

  const hasActiveFilters = searchQuery || selectedTags.length > 0 || selectedTopics.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Quantitative Trading Blog
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Khám phá thế giới giao dịch định lượng với Python và Machine Learning
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" id="posts">
        
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Bài viết mới nhất</h2>
          <p className="text-gray-600">
            Khám phá các chiến lược giao dịch định lượng, phân tích dữ liệu và lập trình Python
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8">
          <SearchAndFilter
            onSearch={handleSearch}
            onTagFilter={handleTagFilter}
            onTopicFilter={handleTopicFilter}
            availableTags={allTags}
            availableTopics={availableTopics}
            searchQuery={searchQuery}
            selectedTags={selectedTags}
            selectedTopics={selectedTopics}
          />
        </div>

        {/* Results Info */}
        {hasActiveFilters && (
          <div className="mb-6">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-gray-600">Kết quả lọc:</span>
              <span className="font-semibold text-blue-600">{filteredPosts.length} bài viết</span>
              
              {searchQuery && (
                <span className="text-sm text-gray-500">
                  • Tìm kiếm: "{searchQuery}"
                </span>
              )}
              
              {selectedTopics.length > 0 && (
                <span className="text-sm text-gray-500">
                  • Chủ đề: {selectedTopics.join(', ')}
                </span>
              )}
              
              {selectedTags.length > 0 && (
                <span className="text-sm text-gray-500">
                  • Tags: {selectedTags.join(', ')}
                </span>
              )}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllFilters}
              className="mt-2"
            >
              Xóa tất cả bộ lọc
            </Button>
          </div>
        )}

        {/* Posts Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Đang tải bài viết...</span>
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              {hasActiveFilters 
                ? 'Không tìm thấy bài viết nào phù hợp với tiêu chí lọc.'
                : 'Chưa có bài viết nào.'
              }
            </div>
            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={clearAllFilters}
              >
                Xem tất cả bài viết
              </Button>
            )}
          </div>
        )}

        {/* Load More Button (for future pagination) */}
        {filteredPosts.length > 0 && filteredPosts.length >= 9 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Xem thêm bài viết
            </Button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Quantitative Trading Blog</h3>
              <p className="text-gray-400">
                Chia sẻ kiến thức về giao dịch định lượng, phân tích dữ liệu và lập trình Python.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Chủ đề phổ biến</h3>
              <div className="flex flex-wrap gap-2">
                {availableTopics.slice(0, 6).map((topic) => (
                  <button
                    key={topic}
                    onClick={() => handleTopicFilter([topic])}
                    className="text-sm bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded-full transition-colors"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Liên hệ</h3>
              <p className="text-gray-400">
                Email: contact@quantblog.com<br />
                GitHub: @quanttrader
              </p>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Quantitative Trading Blog. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
