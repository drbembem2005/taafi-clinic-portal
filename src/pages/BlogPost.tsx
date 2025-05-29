
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
        <div className="w-full px-4 py-8">
          <div className="max-w-5xl mx-auto">
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section with Background Pattern */}
      <div className="relative bg-gradient-to-l from-brand/10 via-blue-50 to-indigo-100 border-b border-gray-100">
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231373b4' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
        
        <div className="relative w-full px-4 py-6 md:py-12">
          <div className="max-w-5xl mx-auto">
            {/* Back Navigation */}
            <div className="mb-6 md:mb-8">
              <Link 
                to="/blog" 
                className="inline-flex items-center gap-2 text-brand hover:text-brand-dark transition-colors font-medium text-base md:text-lg group bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-white/50"
              >
                <ArrowRight size={18} className="md:w-5 md:h-5 transform rotate-180 group-hover:-translate-x-1 transition-transform" />
                <span>العودة إلى المدونة</span>
              </Link>
            </div>
            
            {/* Article Header */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl md:rounded-3xl shadow-xl border border-white/50 p-6 md:p-10">
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 leading-tight text-gray-900">
                {post.title}
              </h1>
              
              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-3 md:gap-4 text-gray-600 mb-6 md:mb-8">
                <div className="flex items-center gap-2 bg-brand/10 px-4 py-2 rounded-full text-sm md:text-base border border-brand/20">
                  <Clock className="h-4 w-4 md:h-5 md:w-5 text-brand" />
                  <span className="font-medium">{readingTime} دقائق قراءة</span>
                </div>
              </div>

              {/* Excerpt */}
              <div className="bg-gradient-to-l from-blue-50 to-brand/5 p-6 md:p-8 rounded-2xl border border-brand/10 mb-6 md:mb-8">
                <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-medium">
                  {post.excerpt}
                </p>
              </div>
              
              {/* Share Button */}
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  onClick={handleShare}
                  className="flex items-center gap-3 px-6 py-3 rounded-xl border-2 border-brand text-brand hover:bg-brand hover:text-white transition-all font-medium shadow-sm"
                >
                  <Share2 className="h-5 w-5" />
                  <span>مشاركة المقال</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="w-full px-4 py-8 md:py-12">
        <div className="max-w-5xl mx-auto">
          {/* Featured Image */}
          {post.image && (
            <div className="mb-8 md:mb-12">
              <div className="rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-64 md:h-80 lg:h-96 object-cover"
                />
              </div>
            </div>
          )}
          
          {/* Article Content */}
          <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl p-6 md:p-10 lg:p-12 mb-8 md:mb-16 border border-gray-100">
            <BlogContent content={post.content} />
          </div>
          
          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section>
              <div className="text-center mb-8 md:mb-12">
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">مقالات ذات صلة</h2>
                <div className="w-24 h-1 bg-gradient-to-r from-brand to-brand-light mx-auto rounded-full"></div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 md:gap-8">
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
