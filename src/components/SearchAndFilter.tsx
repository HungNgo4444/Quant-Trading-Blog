import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Tag, X, Filter, FolderOpen } from 'lucide-react';

interface SearchAndFilterProps {
  onSearch: (query: string) => void;
  onTagFilter: (tags: string[]) => void;
  onTopicFilter: (topics: string[]) => void;
  availableTags: string[];
  availableTopics: string[];
  searchQuery: string;
  selectedTags: string[];
  selectedTopics: string[];
}

const SearchAndFilter = ({ 
  onSearch, 
  onTagFilter,
  onTopicFilter,
  availableTags, 
  availableTopics,
  searchQuery, 
  selectedTags,
  selectedTopics
}: SearchAndFilterProps) => {
  const [searchInput, setSearchInput] = useState(searchQuery);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchInput);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    
    // Auto search when input is cleared
    if (value === '') {
      onSearch('');
    }
  };

  const handleTagClick = (tag: string) => {
    const newSelectedTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    onTagFilter(newSelectedTags);
  };

  const handleTopicClick = (topic: string) => {
    const newSelectedTopics = selectedTopics.includes(topic)
      ? selectedTopics.filter(t => t !== topic)
      : [...selectedTopics, topic];
    onTopicFilter(newSelectedTopics);
  };

  const clearFilters = () => {
    setSearchInput('');
    onSearch('');
    onTagFilter([]);
    onTopicFilter([]);
  };

  const hasActiveFilters = searchQuery || selectedTags.length > 0 || selectedTopics.length > 0;

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Search */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Tìm kiếm bài viết..."
              value={searchInput}
              onChange={handleSearchChange}
              className="pl-10 pr-10"
            />
            {searchInput && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchInput('');
                  onSearch('');
                }}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </form>

          {/* Topics */}
          {availableTopics.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <FolderOpen className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Chủ đề:</span>
                {selectedTopics.length > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {selectedTopics.length} đã chọn
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {availableTopics.map((topic) => (
                  <Badge
                    key={topic}
                    variant={selectedTopics.includes(topic) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-blue-100 transition-colors"
                    onClick={() => handleTopicClick(topic)}
                  >
                    {topic}
                    {selectedTopics.includes(topic) && (
                      <X className="ml-1 h-3 w-3" />
                    )}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {availableTags.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Tag className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Tags:</span>
                {selectedTags.length > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {selectedTags.length} đã chọn
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-green-100 transition-colors"
                    onClick={() => handleTagClick(tag)}
                  >
                    {tag}
                    {selectedTags.includes(tag) && (
                      <X className="ml-1 h-3 w-3" />
                    )}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Active filters */}
          {hasActiveFilters && (
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex items-center gap-2 flex-wrap">
                <Filter className="h-4 w-4 text-gray-600" />
                <span className="text-sm text-gray-600">Bộ lọc đang áp dụng:</span>
                
                {searchQuery && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Tìm kiếm: "{searchQuery}"
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => {
                        setSearchInput('');
                        onSearch('');
                      }}
                    />
                  </Badge>
                )}
                
                {selectedTopics.map(topic => (
                  <Badge key={topic} variant="secondary" className="flex items-center gap-1">
                    Chủ đề: {topic}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => handleTopicClick(topic)}
                    />
                  </Badge>
                ))}
                
                {selectedTags.map(tag => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    Tag: {tag}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => handleTagClick(tag)}
                    />
                  </Badge>
                ))}
              </div>
              
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Xóa tất cả bộ lọc
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchAndFilter;
