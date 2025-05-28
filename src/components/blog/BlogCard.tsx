
import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Clock, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BlogPost } from '@/services/blogService';

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard = ({ post }: BlogCardProps) => {
  // Calculate reading time (rough estimate: 200 words per minute)
  const wordCount = post.content.replace(/<[^>]*>/g, '').split(' ').length;
  const readingTime = Math.ceil(wordCount / 200);

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      <Link to={`/blog/${post.slug}`}>
        <div className="aspect-video bg-gradient-to-r from-blue-100 to-brand-light/30 relative overflow-hidden">
          {post.image ? (
            <img 
              src={post.image} 
              alt={post.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <span className="text-brand/70 font-bold text-xl text-center px-4">
                {post.title}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        </div>
        
        <CardHeader className="pb-3">
          <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-brand transition-colors line-clamp-2">
            {post.title}
          </CardTitle>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(post.published_at), 'PPP', { locale: ar })}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{readingTime} دقائق قراءة</span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <CardDescription className="text-gray-600 line-clamp-3 leading-relaxed">
            {post.excerpt}
          </CardDescription>
        </CardContent>
      </Link>
    </Card>
  );
};

export default BlogCard;
