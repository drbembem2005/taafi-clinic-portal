
import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Clock, Calendar, ArrowLeft, Bookmark } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { BlogPost } from '@/services/blogService';

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard = ({ post }: BlogCardProps) => {
  // Calculate reading time (rough estimate: 200 words per minute)
  const wordCount = post.content.replace(/<[^>]*>/g, '').split(' ').length;
  const readingTime = Math.ceil(wordCount / 200);

  return (
    <Card className="group bg-white hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden border-0 shadow-lg rounded-2xl">
      <Link to={`/blog/${post.slug}`} className="block">
        {/* Image Section */}
        <div className="aspect-[16/10] bg-gradient-to-br from-brand/10 via-blue-50 to-indigo-100 relative overflow-hidden">
          {post.image ? (
            <>
              <img 
                src={post.image} 
                alt={post.title} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent group-hover:from-black/40 transition-all duration-500" />
            </>
          ) : (
            <div className="flex items-center justify-center h-full p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-brand/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bookmark className="h-8 w-8 text-brand" />
                </div>
                <h3 className="text-brand font-bold text-lg leading-tight">
                  {post.title}
                </h3>
              </div>
            </div>
          )}
          
          {/* Reading Time Badge */}
          <div className="absolute top-4 right-4">
            <div className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
              <div className="flex items-center gap-1.5 text-sm text-gray-700">
                <Clock className="h-3.5 w-3.5" />
                <span className="font-medium">{readingTime} دقائق</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Content Section */}
        <CardContent className="p-6">
          {/* Date */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
            <Calendar className="h-4 w-4" />
            <span>{format(new Date(post.published_at), 'PPP', { locale: ar })}</span>
          </div>
          
          {/* Title */}
          <h2 className="text-xl font-bold text-gray-900 group-hover:text-brand transition-colors line-clamp-2 leading-tight mb-3">
            {post.title}
          </h2>
          
          {/* Excerpt */}
          <p className="text-gray-600 line-clamp-3 leading-relaxed mb-4 text-sm">
            {post.excerpt}
          </p>
          
          {/* Read More Button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-brand font-medium text-sm group-hover:gap-3 transition-all">
              <span>اقرأ المزيد</span>
              <ArrowLeft className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default BlogCard;
