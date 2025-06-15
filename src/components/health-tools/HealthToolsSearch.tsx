import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, XCircle, Filter, CheckCircle } from 'lucide-react';
import { trackUserInteraction } from '@/utils/analytics';

interface HealthToolsSearchProps {
  tools: any[];
  onFilteredToolsChange: (tools: any[]) => void;
  selectedCategory: string | null;
  onCategoryChange?: (categoryId: string | null) => void;
}

const HealthToolsSearch = ({ tools, onFilteredToolsChange, selectedCategory, onCategoryChange }: HealthToolsSearchProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string | 'all'>(selectedCategory || 'all');
  const searchTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    setSelectedFilter(selectedCategory || 'all');
  }, [selectedCategory]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // Track search queries (debounced)
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      if (query.trim()) {
        const filteredResults = tools.filter(tool =>
          tool.title.toLowerCase().includes(query.toLowerCase()) ||
          tool.description.toLowerCase().includes(query.toLowerCase()) ||
          tool.keywords?.some(keyword => keyword.toLowerCase().includes(query.toLowerCase()))
        );
        
        // Track the search with results count
        trackUserInteraction.search(
          query.trim(),
          filteredResults.length,
          'health-tools',
          selectedCategory || undefined
        );
        
        onFilteredToolsChange(filteredResults);
      } else {
        onFilteredToolsChange(tools);
      }
    }, 500);
  };

  const handleCategorySelect = (categoryId: string) => {
    // Track category selection
    trackUserInteraction.click(
      'Health Tools Category',
      'health-tools',
      categoryId,
      'category-filter'
    );
    
    setSelectedFilter(categoryId);
    onCategoryChange?.(categoryId);
    
    const filteredTools = tools.filter(tool => tool.category === categoryId);
    onFilteredToolsChange(filteredTools);
  };

  const handleClearFilters = () => {
    // Track filter clearing
    trackUserInteraction.click(
      'Clear Filters',
      'health-tools',
      undefined,
      'filter-action'
    );
    
    setSearchQuery('');
    setSelectedFilter('all');
    onCategoryChange?.(null);
    onFilteredToolsChange(tools);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Search Input */}
      <div className="relative">
        <Input
          type="search"
          placeholder="ابحث عن أداة صحية..."
          className="rounded-full pl-12 pr-4 shadow-md border-gray-200 focus-visible:ring-brand focus-visible:ring-2"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <Search className="absolute top-1/2 transform -translate-y-1/2 left-4 h-5 w-5 text-gray-500" />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchQuery('');
              onFilteredToolsChange(tools);
            }}
            className="absolute top-1/2 transform -translate-y-1/2 right-2 h-8 w-8 rounded-full hover:bg-gray-100 transition-colors"
          >
            <XCircle className="h-4 w-4 text-gray-500" />
          </Button>
        )}
      </div>

      {/* Category Filters */}
      <Card className="border-0 shadow-md rounded-2xl">
        <CardHeader className="py-3 px-4">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-500" />
            تصفية حسب الفئة
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-40">
            <div className="flex flex-col gap-2 p-4">
              <Button
                variant="ghost"
                className={`flex justify-between w-full rounded-full hover:bg-gray-100 transition-colors ${selectedFilter === 'all' ? 'text-brand font-semibold' : 'text-gray-700'}`}
                onClick={handleClearFilters}
              >
                <span>الكل</span>
                {selectedFilter === 'all' && <CheckCircle className="h-4 w-4 text-brand" />}
              </Button>
              {[...new Set(tools.map(tool => tool.category))].map((category: any) => (
                <Button
                  key={category}
                  variant="ghost"
                  className={`flex justify-between w-full rounded-full hover:bg-gray-100 transition-colors ${selectedFilter === category ? 'text-brand font-semibold' : 'text-gray-700'}`}
                  onClick={() => handleCategorySelect(category)}
                >
                  <span>{category}</span>
                  {selectedFilter === category && <CheckCircle className="h-4 w-4 text-brand" />}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default HealthToolsSearch;
