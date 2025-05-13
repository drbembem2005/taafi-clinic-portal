
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBlogPostBySlug, BlogPost } from '@/services/blogService';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight } from 'lucide-react';

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      
      setLoading(true);
      const fetchedPost = await getBlogPostBySlug(slug);
      setPost(fetchedPost);
      setLoading(false);
    };

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-12 w-3/4 mx-auto mb-4" />
        <Skeleton className="h-6 w-1/3 mx-auto mb-8" />
        <Skeleton className="h-64 w-full mb-8" />
        <div className="space-y-4">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-3/4" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">المقال غير موجود</h1>
        <p className="mb-6">عذراً، لم يتم العثور على المقال المطلوب</p>
        <Link to="/blog" className="text-brand flex items-center justify-center gap-2">
          <ArrowRight size={16} className="transform rotate-180" />
          <span>العودة إلى المدونة</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <Link to="/blog" className="text-brand mb-4 flex items-center gap-2">
          <ArrowRight size={16} className="transform rotate-180" />
          <span>العودة إلى المدونة</span>
        </Link>
        
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
        <p className="text-gray-500 mb-8">
          نُشر في {format(new Date(post.published_at), 'PPP', { locale: ar })}
        </p>
        
        {post.image && (
          <div className="mb-8 rounded-lg overflow-hidden">
            <img 
              src={post.image} 
              alt={post.title} 
              className="w-full h-auto object-cover"
            />
          </div>
        )}
        
        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </div>
  );
};

export default BlogPostPage;
