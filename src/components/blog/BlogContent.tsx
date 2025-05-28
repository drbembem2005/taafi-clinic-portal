
import React from 'react';

interface BlogContentProps {
  content: string;
  className?: string;
}

const BlogContent = ({ content, className = '' }: BlogContentProps) => {
  return (
    <div 
      className={`prose prose-lg max-w-none prose-gray
        prose-headings:font-cairo prose-headings:text-gray-900
        prose-h1:text-3xl prose-h1:mb-6 prose-h1:mt-8
        prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-6
        prose-h3:text-xl prose-h3:mb-3 prose-h3:mt-5
        prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
        prose-a:text-brand prose-a:no-underline hover:prose-a:underline
        prose-strong:text-gray-900 prose-strong:font-semibold
        prose-ul:my-6 prose-ol:my-6
        prose-li:text-gray-700 prose-li:my-2
        prose-blockquote:border-r-4 prose-blockquote:border-brand
        prose-blockquote:bg-blue-50 prose-blockquote:p-4 prose-blockquote:my-6
        prose-blockquote:text-gray-800 prose-blockquote:italic
        prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded
        prose-code:text-sm prose-code:text-gray-800
        prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-4 prose-pre:rounded-lg
        prose-img:rounded-lg prose-img:shadow-md prose-img:my-6
        prose-table:border-collapse prose-table:w-full
        prose-th:border prose-th:border-gray-300 prose-th:bg-gray-50 prose-th:p-3
        prose-td:border prose-td:border-gray-300 prose-td:p-3
        rtl:prose-blockquote:border-r-0 rtl:prose-blockquote:border-l-4
        ${className}`}
      dangerouslySetInnerHTML={{ __html: content }}
      dir="rtl"
    />
  );
};

export default BlogContent;
