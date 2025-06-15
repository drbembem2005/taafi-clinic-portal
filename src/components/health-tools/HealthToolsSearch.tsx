
import React, { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HealthTool {
  id: string;
  title: string;
  description: string;
  category: string;
  keywords?: string[];
}

interface HealthToolsSearchProps {
  tools: HealthTool[];
  onFilteredToolsChange: (tools: HealthTool[]) => void;
  selectedCategory?: string;
  onCategoryChange?: (category: string | null) => void;
}

const categories = [
  { id: 'calculation', name: 'الحاسبات الطبية', color: 'bg-blue-100 text-blue-800' },
  { id: 'assessment', name: 'تقييم المخاطر', color: 'bg-red-100 text-red-800' },
  { id: 'mental', name: 'الصحة النفسية', color: 'bg-purple-100 text-purple-800' },
  { id: 'pregnancy', name: 'صحة الحمل', color: 'bg-pink-100 text-pink-800' },
  { id: 'guidance', name: 'التوجيه الطبي', color: 'bg-green-100 text-green-800' }
];

const HealthToolsSearch = ({ 
  tools, 
  onFilteredToolsChange, 
  selectedCategory,
  onCategoryChange 
}: HealthToolsSearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('health-tools-favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const filteredTools = useMemo(() => {
    let filtered = tools;

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(tool => tool.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(tool => 
        tool.title.toLowerCase().includes(searchLower) ||
        tool.description.toLowerCase().includes(searchLower) ||
        (tool.keywords && tool.keywords.some(keyword => 
          keyword.toLowerCase().includes(searchLower)
        ))
      );
    }

    return filtered;
  }, [tools, selectedCategory, searchTerm]);

  React.useEffect(() => {
    onFilteredToolsChange(filteredTools);
  }, [filteredTools, onFilteredToolsChange]);

  const handleCategorySelect = (categoryId: string) => {
    if (selectedCategory === categoryId) {
      onCategoryChange?.(null);
    } else {
      onCategoryChange?.(categoryId);
    }
  };

  const toggleFavorite = (toolId: string) => {
    const newFavorites = favorites.includes(toolId)
      ? favorites.filter(id => id !== toolId)
      : [...favorites, toolId];
    
    setFavorites(newFavorites);
    localStorage.setItem('health-tools-favorites', JSON.stringify(newFavorites));
  };

  const clearFilters = () => {
    setSearchTerm('');
    onCategoryChange?.(null);
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input
          type="text"
          placeholder="ابحث في الأدوات الصحية..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pr-10 pl-4 py-3 text-lg rounded-xl border-2 border-gray-200 focus:border-brand"
        />
      </div>

      {/* Filter Toggle & Quick Actions */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="rounded-xl border-2"
          >
            <Filter className="h-4 w-4 ml-2" />
            تصفية
          </Button>
          
          {(searchTerm || selectedCategory) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl"
            >
              <X className="h-4 w-4 ml-1" />
              مسح الفلاتر
            </Button>
          )}
        </div>

        <div className="text-sm text-gray-600">
          {filteredTools.length} من {tools.length} أداة
        </div>
      </div>

      {/* Category Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-gray-50 p-4 rounded-xl border">
              <h3 className="font-semibold mb-3 text-gray-900">التصنيفات</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Badge
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                      selectedCategory === category.id 
                        ? 'bg-brand text-white border-brand' 
                        : `${category.color} border-current hover:shadow-md`
                    }`}
                    onClick={() => handleCategorySelect(category.id)}
                  >
                    {category.name}
                    {selectedCategory === category.id && (
                      <X className="h-3 w-3 mr-1" />
                    )}
                  </Badge>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Filters Display */}
      {(searchTerm || selectedCategory) && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-600">الفلاتر النشطة:</span>
          {searchTerm && (
            <Badge variant="secondary" className="rounded-lg">
              البحث: "{searchTerm}"
            </Badge>
          )}
          {selectedCategory && (
            <Badge variant="secondary" className="rounded-lg">
              {categories.find(cat => cat.id === selectedCategory)?.name}
            </Badge>
          )}
        </div>
      )}

      {/* No Results Message */}
      {filteredTools.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-400 text-lg mb-2">😔</div>
          <p className="text-gray-600">لم يتم العثور على أدوات تطابق البحث</p>
          <Button
            variant="ghost"
            onClick={clearFilters}
            className="mt-2 text-brand hover:text-brand-dark"
          >
            مسح الفلاتر والعرض الكل
          </Button>
        </div>
      )}
    </div>
  );
};

export default HealthToolsSearch;
