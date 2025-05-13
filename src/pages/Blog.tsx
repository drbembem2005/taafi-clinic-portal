
import { useState, useEffect } from 'react';
import { getBlogPosts, BlogPost } from '@/services/blogService';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const fetchedPosts = await getBlogPosts();
      setPosts(fetchedPosts);
      setLoading(false);
    };

    fetchPosts();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-10">المدونة الطبية</h1>
      
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
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
      ) : posts.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link 
              to={`/blog/${post.slug}`} 
              key={post.id}
              className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="h-48 bg-gray-200 relative">
                {post.image ? (
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gradient-to-r from-blue-100 to-brand-light/30">
                    <span className="text-brand/70 font-bold text-xl">مدونة المركز الطبي</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h2 className="text-xl font-bold mb-2 text-gray-800">{post.title}</h2>
                <p className="text-sm text-gray-500 mb-3">
                  {format(new Date(post.published_at), 'PPP', { locale: ar })}
                </p>
                <p className="text-gray-600 line-clamp-3">{post.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-xl text-gray-500">لا توجد مقالات متاحة حالياً</p>
        </div>
      )}
    </div>
  );
};

export default Blog;
