
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBlogPostBySlug, getBlogPosts, BlogPost } from '@/services/blogService';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, Calendar, Clock, Share2, User, Eye } from 'lucide-react';
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <Skeleton className="h-6 w-32 mb-4" />
              <Skeleton className="h-16 w-full mb-6" />
              <div className="flex gap-4 mb-8">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-24" />
              </div>
              <Skeleton className="h-80 w-full mb-8 rounded-xl" />
              <div className="space-y-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-3/4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-lg p-12 max-w-md mx-4">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Eye className="h-10 w-10 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold mb-4 text-gray-900">المقال غير موجود</h1>
          <p className="mb-8 text-gray-600 leading-relaxed">عذراً، لم يتم العثور على المقال المطلوب</p>
          <Link 
            to="/blog" 
            className="inline-flex items-center gap-2 bg-brand text-white px-6 py-3 rounded-xl hover:bg-brand-dark transition-all font-medium"
          >
            <ArrowRight size={16} className="transform rotate-180" />
            <span>العودة إلى المدونة</span>
          </Link>
        </div>
      </div>
    );
  }

  // Calculate reading time
  const wordCount = post.content.replace(/<[^>]*>/g, '').split(' ').length;
  const readingTime = Math.ceil(wordCount / 200);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Navigation */}
          <div className="mb-8">
            <Link 
              to="/blog" 
              className="inline-flex items-center gap-2 text-brand hover:text-brand-dark transition-colors font-medium text-lg group"
            >
              <ArrowRight size={20} className="transform rotate-180 group-hover:-translate-x-1 transition-transform" />
              <span>العودة إلى المدونة</span>
            </Link>
          </div>
          
          {/* Main Article Card */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            {/* Article Header */}
            <header className="p-8 md:p-12 border-b border-gray-100">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight text-gray-900">
                {post.title}
              </h1>
              
              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8">
                <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-full">
                  <Calendar className="h-5 w-5 text-brand" />
                  <span className="font-medium">{format(new Date(post.published_at), 'PPP', { locale: ar })}</span>
                </div>
                <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-full">
                  <Clock className="h-5 w-5 text-brand" />
                  <span className="font-medium">{readingTime} دقائق قراءة</span>
                </div>
                <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-full">
                  <User className="h-5 w-5 text-brand" />
                  <span className="font-medium">فريق طبي متخصص</span>
                </div>
              </div>

              {/* Excerpt */}
              <div className="bg-gradient-to-l from-blue-50 to-brand/5 p-6 rounded-2xl border-r-4 border-brand mb-8">
                <p className="text-xl text-gray-700 leading-relaxed font-medium">
                  {post.excerpt}
                </p>
              </div>
              
              {/* Share Button */}
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  onClick={handleShare}
                  className="flex items-center gap-3 px-6 py-3 rounded-xl border-2 border-brand text-brand hover:bg-brand hover:text-white transition-all font-medium"
                >
                  <Share2 className="h-5 w-5" />
                  <span>مشاركة المقال</span>
                </Button>
              </div>
            </header>
            
            {/* Featured Image */}
            {post.image && (
              <div className="px-8 md:px-12 pt-8">
                <div className="rounded-2xl overflow-hidden shadow-lg">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            )}
            
            {/* Article Content */}
            <article className="p-8 md:p-12">
              <BlogContent content={post.content} />
            </article>
          </div>
          
          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section className="mt-16">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4 text-gray-900">مقالات ذات صلة</h2>
                <div className="w-24 h-1 bg-brand mx-auto rounded-full"></div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                {relatedPosts.map((relatedPost) => (
                  <Card key={relatedPost.id} className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden border-0 shadow-lg rounded-2xl bg-white">
                    <Link to={`/blog/${relatedPost.slug}`}>
                      <div className="aspect-video bg-gradient-to-br from-brand/10 via-blue-50 to-indigo-100 relative overflow-hidden">
                        {relatedPost.image ? (
                          <>
                            <img 
                              src={relatedPost.image} 
                              alt={relatedPost.title} 
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent group-hover:from-black/40 transition-all duration-500" />
                          </>
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <span className="text-brand font-bold text-center px-4 text-lg">
                              {relatedPost.title}
                            </span>
                          </div>
                        )}
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg line-clamp-2 hover:text-brand transition-colors leading-tight">
                          {relatedPost.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
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
    </div>
  );
};

export default BlogPostPage;
