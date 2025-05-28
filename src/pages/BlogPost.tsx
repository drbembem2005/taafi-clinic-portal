
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBlogPostBySlug, getBlogPosts, BlogPost } from '@/services/blogService';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, Calendar, Clock, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BlogContent from '@/components/blog/BlogContent';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      
      setLoading(true);
      const [fetchedPost, allPosts] = await Promise.all([
        getBlogPostBySlug(slug),
        getBlogPosts()
      ]);
      
      setPost(fetchedPost);
      
      // Get related posts (excluding current post)
      if (fetchedPost) {
        const related = allPosts
          .filter(p => p.id !== fetchedPost.id)
          .slice(0, 3);
        setRelatedPosts(related);
      }
      
      setLoading(false);
    };

    fetchPost();
  }, [slug]);

  const handleShare = async () => {
    if (navigator.share && post) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // You might want to show a toast here
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-6 w-32 mb-4" />
          <Skeleton className="h-12 w-full mb-4" />
          <Skeleton className="h-6 w-1/3 mb-8" />
          <Skeleton className="h-64 w-full mb-8" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-3/4" />
          </div>
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

  // Calculate reading time
  const wordCount = post.content.replace(/<[^>]*>/g, '').split(' ').length;
  const readingTime = Math.ceil(wordCount / 200);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Navigation */}
        <Link to="/blog" className="text-brand mb-6 flex items-center gap-2 hover:underline">
          <ArrowRight size={16} className="transform rotate-180" />
          <span>العودة إلى المدونة</span>
        </Link>
        
        {/* Article Header */}
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">{post.title}</h1>
          
          <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span>{format(new Date(post.published_at), 'PPP', { locale: ar })}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span>{readingTime} دقائق قراءة</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="flex items-center gap-2"
            >
              <Share2 className="h-4 w-4" />
              <span>مشاركة</span>
            </Button>
          </div>
          
          {post.image && (
            <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
              <img 
                src={post.image} 
                alt={post.title} 
                className="w-full h-auto object-cover"
              />
            </div>
          )}
        </header>
        
        {/* Article Content */}
        <article className="mb-12">
          <BlogContent content={post.content} />
        </article>
        
        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="border-t pt-12">
            <h2 className="text-2xl font-bold mb-6">مقالات ذات صلة</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Card key={relatedPost.id} className="hover:shadow-md transition-shadow">
                  <Link to={`/blog/${relatedPost.slug}`}>
                    <div className="aspect-video bg-gradient-to-r from-blue-100 to-brand-light/30 relative overflow-hidden">
                      {relatedPost.image ? (
                        <img 
                          src={relatedPost.image} 
                          alt={relatedPost.title} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <span className="text-brand/70 font-bold text-center px-4">
                            {relatedPost.title}
                          </span>
                        </div>
                      )}
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg line-clamp-2 hover:text-brand transition-colors">
                        {relatedPost.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {relatedPost.excerpt}
                      </p>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default BlogPostPage;
