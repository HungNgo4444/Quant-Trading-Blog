import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Tag, X } from 'lucide-react';

interface SearchAndFilterProps {
  onSearch: (query: string) => void;
  onTagFilter: (tag: string) => void;
  availableTags: string[];
  searchQuery: string;
  selectedTag: string;
}

const SearchAndFilter = ({ 
  onSearch, 
  onTagFilter, 
  availableTags, 
  searchQuery, 
  selectedTag 
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
    if (selectedTag === tag) {
      onTagFilter(''); // Deselect if already selected
    } else {
      onTagFilter(tag);
    }
  };

  const clearFilters = () => {
    setSearchInput('');
    onSearch('');
    onTagFilter('');
  };

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

          {/* Tags */}
          {availableTags.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Tag className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Chủ đề:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTag === tag ? "default" : "outline"}
                    className="cursor-pointer hover:bg-blue-100 transition-colors"
                    onClick={() => handleTagClick(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Active filters */}
          {(searchQuery || selectedTag) && (
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex items-center gap-2 flex-wrap">
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
                {selectedTag && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Tag: {selectedTag}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => onTagFilter('')}
                    />
                  </Badge>
                )}
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
