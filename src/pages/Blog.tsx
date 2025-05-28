
import { useState, useEffect, useMemo } from 'react';
import { getBlogPosts, BlogPost } from '@/services/blogService';
import { Skeleton } from '@/components/ui/skeleton';
import BlogCard from '@/components/blog/BlogCard';
import BlogSearch from '@/components/blog/BlogSearch';
import BlogPagination from '@/components/blog/BlogPagination';
import { Sparkles, TrendingUp } from 'lucide-react';

const POSTS_PER_PAGE = 6;

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const fetchedPosts = await getBlogPosts();
      setPosts(fetchedPosts);
      setLoading(false);
    };

    fetchPosts();
  }, []);

  // Filter posts based on search term
  const filteredPosts = useMemo(() => {
    if (!searchTerm) return posts;
    
    return posts.filter(post => 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [posts, searchTerm]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const currentPosts = filteredPosts.slice(startIndex, endIndex);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-brand to-brand-dark text-white py-20">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="h-8 w-8" />
              <span className="text-lg font-medium">المدونة الطبية</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              رحلتك نحو الصحة تبدأ هنا
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              اكتشف أحدث المقالات والنصائح الطبية من خبرائنا المتخصصين لحياة أكثر صحة وسعادة
            </p>
            <div className="flex items-center justify-center gap-4 mt-8 text-blue-200">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                <span>{posts.length} مقال متاح</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-blue-300"></div>
              <span>محدث يومياً</span>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-blue-50 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Search Section */}
        <div className="max-w-2xl mx-auto mb-16">
          <BlogSearch 
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            onClearSearch={handleClearSearch}
          />
        </div>

        {/* Search Results Info */}
        {searchTerm && (
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-sm border">
              <span className="text-gray-600">
                تم العثور على <span className="font-bold text-brand">{filteredPosts.length}</span> مقال{filteredPosts.length === 1 ? '' : 'ة'} 
                للبحث عن <span className="font-semibold">"{searchTerm}"</span>
              </span>
            </div>
          </div>
        )}
        
        {/* Blog Posts Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-sm">
                <Skeleton className="h-56 w-full" />
                <div className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-3" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <Skeleton className="h-20 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : currentPosts.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
            
            <div className="mt-16">
              <BlogPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {searchTerm ? 'لم يتم العثور على نتائج' : 'لا توجد مقالات متاحة'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm 
                  ? `لم يتم العثور على مقالات تحتوي على "${searchTerm}"`
                  : 'لا توجد مقالات متاحة حالياً. تحقق مرة أخرى قريباً!'
                }
              </p>
              {searchTerm && (
                <button
                  onClick={handleClearSearch}
                  className="bg-brand text-white px-6 py-3 rounded-full hover:bg-brand-dark transition-colors font-medium"
                >
                  إظهار جميع المقالات
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
