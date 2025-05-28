
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';

interface BlogSearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onClearSearch: () => void;
}

const BlogSearch = ({ searchTerm, onSearchChange, onClearSearch }: BlogSearchProps) => {
  return (
    <div className="relative">
      <div className="relative bg-white rounded-2xl shadow-lg border-0 overflow-hidden">
        <div className="flex items-center">
          <div className="flex-1 relative">
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="ابحث في المقالات... مثل: صحة القلب، التغذية، الرياضة"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pr-12 pl-4 py-4 text-right border-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-lg bg-transparent"
              dir="rtl"
            />
          </div>
          {searchTerm && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClearSearch}
              className="mx-2 h-10 w-10 p-0 hover:bg-gray-100 rounded-full"
            >
              <X className="h-5 w-5 text-gray-500" />
            </Button>
          )}
        </div>
      </div>
      
      {/* Popular Search Terms */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500 mb-2">البحث الشائع:</p>
        <div className="flex flex-wrap justify-center gap-2">
          {['صحة القلب', 'التغذية السليمة', 'الرياضة', 'الصحة النفسية'].map((term) => (
            <button
              key={term}
              onClick={() => onSearchChange(term)}
              className="px-3 py-1 bg-white text-sm text-gray-600 rounded-full hover:bg-brand hover:text-white transition-colors shadow-sm border"
            >
              {term}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogSearch;
