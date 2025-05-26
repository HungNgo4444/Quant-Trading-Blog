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
  const [selectedTag, setSelectedTag] = useState('');

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
    setSelectedTag(''); // Clear tag filter when searching
    
    if (!query.trim()) {
      setFilteredPosts(posts);
      return;
    }

    try {
      const searchResults = await blogService.searchPosts(query);
      setFilteredPosts(searchResults);
    } catch (error) {
      console.error('Error searching posts:', error);
    }
  };

  const handleTagFilter = async (tag: string) => {
    setSelectedTag(tag);
    setSearchQuery(''); // Clear search when filtering by tag
    
    if (!tag) {
      setFilteredPosts(posts);
      return;
    }

    try {
      const tagResults = await blogService.getPostsByTag(tag);
      setFilteredPosts(tagResults);
    } catch (error) {
      console.error('Error filtering by tag:', error);
    }
  };

  // Get all unique tags from posts
  const allTags = Array.from(new Set(posts.flatMap(post => post.tags)));

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
            availableTags={allTags}
            searchQuery={searchQuery}
            selectedTag={selectedTag}
          />
        </div>

        {/* Results Info */}
        {(searchQuery || selectedTag) && (
          <div className="mb-6">
            <p className="text-gray-600">
              {searchQuery && `Kết quả tìm kiếm cho "${searchQuery}": `}
              {selectedTag && `Bài viết với tag "${selectedTag}": `}
              <span className="font-semibold">{filteredPosts.length} bài viết</span>
            </p>
            {(searchQuery || selectedTag) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedTag('');
                  setFilteredPosts(posts);
                }}
                className="mt-2"
              >
                Xóa bộ lọc
              </Button>
            )}
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
              {searchQuery || selectedTag 
                ? 'Không tìm thấy bài viết nào phù hợp với tiêu chí tìm kiếm.'
                : 'Chưa có bài viết nào.'
              }
            </div>
            {(searchQuery || selectedTag) && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedTag('');
                  setFilteredPosts(posts);
                }}
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
              <h3 className="text-lg font-semibold mb-4">Chủ đề</h3>
              <div className="flex flex-wrap gap-2">
                {allTags.slice(0, 6).map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagFilter(tag)}
                    className="text-sm bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded-full transition-colors"
                  >
                    {tag}
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
