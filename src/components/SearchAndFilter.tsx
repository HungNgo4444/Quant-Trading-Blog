
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Tag } from 'lucide-react';
import { BlogFilter } from '@/types/blog';

interface SearchAndFilterProps {
  filter: BlogFilter;
  onFilterChange: (filter: BlogFilter) => void;
  availableTags: string[];
}

const SearchAndFilter = ({ filter, onFilterChange, availableTags }: SearchAndFilterProps) => {
  const [searchInput, setSearchInput] = useState(filter.search);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onFilterChange({ ...filter, search: searchInput });
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchInput]);

  const toggleTag = (tag: string) => {
    const newTags = filter.tags.includes(tag)
      ? filter.tags.filter(t => t !== tag)
      : [...filter.tags, tag];
    onFilterChange({ ...filter, tags: newTags });
  };

  const clearFilters = () => {
    setSearchInput('');
    onFilterChange({ search: '', tags: [], sortBy: 'newest' });
  };

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Tìm kiếm bài viết..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Sort */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">Sắp xếp:</span>
            <Select value={filter.sortBy} onValueChange={(value: 'newest' | 'oldest' | 'popular') => 
              onFilterChange({ ...filter, sortBy: value })
            }>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Mới nhất</SelectItem>
                <SelectItem value="oldest">Cũ nhất</SelectItem>
                <SelectItem value="popular">Phổ biến</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tags */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Tag className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Tags:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={filter.tags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-blue-100 transition-colors"
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Active filters */}
          {(filter.search || filter.tags.length > 0) && (
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Bộ lọc đang áp dụng:</span>
                {filter.search && (
                  <Badge variant="secondary">Tìm kiếm: "{filter.search}"</Badge>
                )}
                {filter.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Xóa bộ lọc
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchAndFilter;
