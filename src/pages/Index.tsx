
import { useState, useMemo } from 'react';
import Header from '@/components/Header';
import BlogCard from '@/components/BlogCard';
import SearchAndFilter from '@/components/SearchAndFilter';
import { getAllPosts, getAllTags, getFeaturedPosts, searchPosts } from '@/utils/blogData';
import { BlogFilter } from '@/types/blog';

const Index = () => {
  const [filter, setFilter] = useState<BlogFilter>({
    search: '',
    tags: [],
    sortBy: 'newest'
  });

  const allPosts = getAllPosts();
  const featuredPosts = getFeaturedPosts();
  const availableTags = getAllTags();

  const filteredPosts = useMemo(() => {
    let posts = searchPosts(filter.search, filter.tags);
    
    switch (filter.sortBy) {
      case 'oldest':
        posts = posts.sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime());
        break;
      case 'popular':
        posts = posts.sort((a, b) => b.readTime - a.readTime);
        break;
      default: // newest
        posts = posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    }
    
    return posts;
  }, [filter]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Chia sẻ kiến thức
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Khám phá những bài viết chất lượng về công nghệ, lập trình và phát triển phần mềm
          </p>
        </div>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Bài viết nổi bật</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPosts.map((post) => (
                <BlogCard key={post.id} post={post} featured />
              ))}
            </div>
          </section>
        )}

        {/* Search and Filter */}
        <SearchAndFilter
          filter={filter}
          onFilterChange={setFilter}
          availableTags={availableTags}
        />

        {/* All Posts */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Tất cả bài viết ({filteredPosts.length})
            </h2>
          </div>
          
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-4">Không tìm thấy bài viết nào</p>
              <p className="text-gray-400">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Index;
