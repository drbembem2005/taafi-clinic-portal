
import React from 'react';

interface BlogContentProps {
  content: string;
  className?: string;
}

const BlogContent = ({ content, className = '' }: BlogContentProps) => {
  return (
    <div className={`blog-content-enhanced ${className}`}>
      <div 
        className="prose prose-lg max-w-none
          prose-headings:font-cairo prose-headings:text-gray-900
          prose-h1:text-3xl md:prose-h1:text-4xl prose-h1:font-bold prose-h1:mb-8 prose-h1:pb-4 prose-h1:border-b-2 prose-h1:border-gradient-to-r prose-h1:from-brand prose-h1:to-brand-light
          prose-h2:text-2xl md:prose-h2:text-3xl prose-h2:font-semibold prose-h2:text-brand prose-h2:mb-6 prose-h2:mt-12 prose-h2:relative prose-h2:pl-6 prose-h2:border-r-4 prose-h2:border-brand prose-h2:bg-gradient-to-l prose-h2:from-blue-50/50 prose-h2:py-3 prose-h2:rounded-r-lg
          prose-h3:text-xl md:prose-h3:text-2xl prose-h3:font-medium prose-h3:text-gray-800 prose-h3:mb-4 prose-h3:mt-8 prose-h3:pl-4 prose-h3:border-r-2 prose-h3:border-brand/50
          prose-p:text-gray-700 prose-p:leading-relaxed md:prose-p:leading-loose prose-p:mb-6 prose-p:text-base md:prose-p:text-lg
          prose-a:text-brand prose-a:font-medium prose-a:no-underline hover:prose-a:text-brand-dark hover:prose-a:underline prose-a:transition-all
          prose-strong:text-gray-900 prose-strong:font-semibold prose-strong:bg-yellow-50 prose-strong:px-1 prose-strong:py-0.5 prose-strong:rounded
          prose-ul:mb-6 prose-ol:mb-6 prose-ul:space-y-2 prose-ol:space-y-2
          prose-li:text-gray-700 prose-li:text-base md:prose-li:text-lg prose-li:leading-relaxed prose-li:pl-2
          prose-blockquote:border-r-4 prose-blockquote:border-brand prose-blockquote:bg-gradient-to-l prose-blockquote:from-blue-50 prose-blockquote:to-brand/5
          prose-blockquote:p-6 md:prose-blockquote:p-8 prose-blockquote:my-8 prose-blockquote:rounded-2xl prose-blockquote:shadow-sm prose-blockquote:border prose-blockquote:border-brand/10
          prose-blockquote:text-gray-700 prose-blockquote:text-lg prose-blockquote:font-medium prose-blockquote:italic
          prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:text-brand-dark
          prose-pre:bg-gray-900 prose-pre:text-white prose-pre:p-6 prose-pre:rounded-xl prose-pre:overflow-x-auto prose-pre:shadow-lg
          prose-table:border-collapse prose-table:w-full prose-table:border prose-table:border-gray-200 prose-table:rounded-xl prose-table:overflow-hidden prose-table:shadow-sm
          prose-th:border prose-th:border-gray-300 prose-th:bg-brand prose-th:text-white prose-th:p-4 prose-th:text-right prose-th:font-semibold
          prose-td:border prose-td:border-gray-200 prose-td:p-4 prose-td:text-right prose-td:bg-white
          prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8 prose-img:border prose-img:border-gray-100"
        dangerouslySetInnerHTML={{ __html: content }}
        dir="rtl"
      />
    </div>
  );
};

export default BlogContent;
