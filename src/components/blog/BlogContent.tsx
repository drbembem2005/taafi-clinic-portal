
import React from 'react';

interface BlogContentProps {
  content: string;
  className?: string;
}

const BlogContent = ({ content, className = '' }: BlogContentProps) => {
  return (
    <div className={`blog-content ${className}`}>
      <div 
        className="prose prose-lg max-w-none
          prose-headings:font-cairo prose-headings:text-gray-900
          prose-h1:text-3xl prose-h1:font-bold prose-h1:mb-6 prose-h1:pb-3 prose-h1:border-b-2 prose-h1:border-brand
          prose-h2:text-2xl prose-h2:font-semibold prose-h2:text-brand prose-h2:mb-4 prose-h2:mt-8
          prose-h3:text-xl prose-h3:font-medium prose-h3:text-gray-800 prose-h3:mb-3 prose-h3:mt-6
          prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
          prose-a:text-brand prose-a:font-medium hover:prose-a:text-brand-dark
          prose-strong:text-gray-900 prose-strong:font-semibold
          prose-ul:mb-4 prose-ol:mb-4
          prose-li:text-gray-700 prose-li:mb-1
          prose-blockquote:border-r-4 prose-blockquote:border-brand prose-blockquote:bg-blue-50
          prose-blockquote:p-4 prose-blockquote:my-4 prose-blockquote:rounded
          prose-table:border-collapse prose-table:w-full prose-table:border prose-table:border-gray-200
          prose-th:border prose-th:border-gray-300 prose-th:bg-brand prose-th:text-white prose-th:p-3 prose-th:text-right
          prose-td:border prose-td:border-gray-200 prose-td:p-3 prose-td:text-right
          prose-img:rounded prose-img:shadow-md prose-img:my-6"
        dangerouslySetInnerHTML={{ __html: content }}
        dir="rtl"
      />
    </div>
  );
};

export default BlogContent;
