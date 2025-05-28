
import { useState, useEffect, useMemo } from 'react';
import { getBlogPosts, BlogPost } from '@/services/blogService';
import { Skeleton } from '@/components/ui/skeleton';
import BlogCard from '@/components/blog/BlogCard';
import BlogSearch from '@/components/blog/BlogSearch';
import BlogPagination from '@/components/blog/BlogPagination';

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
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">المدونة الطبية</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          اكتشف أحدث المقالات والنصائح الطبية من خبرائنا المتخصصين
        </p>
      </div>
      
      <BlogSearch 
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onClearSearch={handleClearSearch}
      />

      {searchTerm && (
        <div className="text-center mb-6">
          <p className="text-gray-600">
            تم العثور على {filteredPosts.length} مقال{filteredPosts.length === 1 ? '' : 'ة'} 
            {searchTerm && ` للبحث عن "${searchTerm}"`}
          </p>
        </div>
      )}
      
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="border rounded-lg overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <div className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <Skeleton className="h-20 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : currentPosts.length > 0 ? (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
          
          <BlogPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <div className="text-center py-20">
          <p className="text-xl text-gray-500">
            {searchTerm ? `لم يتم العثور على مقالات تحتوي على "${searchTerm}"` : 'لا توجد مقالات متاحة حالياً'}
          </p>
          {searchTerm && (
            <button
              onClick={handleClearSearch}
              className="mt-4 text-brand hover:underline"
            >
              إظهار جميع المقالات
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Blog;
