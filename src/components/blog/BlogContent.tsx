
import React from 'react';

interface BlogContentProps {
  content: string;
  className?: string;
}

const BlogContent = ({ content, className = '' }: BlogContentProps) => {
  return (
    <div className={`blog-content-wrapper ${className}`}>
      <div 
        className={`prose prose-xl max-w-none
          prose-headings:font-cairo prose-headings:text-gray-900 prose-headings:font-bold
          prose-h1:text-4xl prose-h1:mb-8 prose-h1:mt-12 prose-h1:leading-tight prose-h1:border-b-4 prose-h1:border-brand prose-h1:pb-4
          prose-h2:text-3xl prose-h2:mb-6 prose-h2:mt-10 prose-h2:text-brand prose-h2:leading-snug
          prose-h3:text-2xl prose-h3:mb-4 prose-h3:mt-8 prose-h3:text-gray-800 prose-h3:border-r-4 prose-h3:border-brand-light prose-h3:pr-4
          prose-h4:text-xl prose-h4:mb-3 prose-h4:mt-6 prose-h4:text-gray-700 prose-h4:font-semibold
          prose-h5:text-lg prose-h5:mb-2 prose-h5:mt-4 prose-h5:text-gray-600
          prose-h6:text-base prose-h6:mb-2 prose-h6:mt-4 prose-h6:text-gray-500 prose-h6:uppercase prose-h6:tracking-wide
          
          prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6 prose-p:text-lg prose-p:font-normal
          prose-p:first-of-type:text-xl prose-p:first-of-type:text-gray-600 prose-p:first-of-type:leading-relaxed prose-p:first-of-type:mb-8
          
          prose-a:text-brand prose-a:font-medium prose-a:no-underline prose-a:border-b-2 prose-a:border-brand/30 
          hover:prose-a:border-brand hover:prose-a:bg-brand/5 prose-a:transition-all prose-a:px-1 prose-a:rounded-sm
          
          prose-strong:text-gray-900 prose-strong:font-bold prose-strong:bg-yellow-50 prose-strong:px-1 prose-strong:rounded
          prose-em:text-brand prose-em:font-medium prose-em:not-italic
          
          prose-ul:my-8 prose-ul:space-y-3 prose-ul:list-none prose-ul:pr-0
          prose-ol:my-8 prose-ol:space-y-3 prose-ol:pr-6
          prose-li:text-gray-700 prose-li:text-lg prose-li:leading-relaxed prose-li:relative
          prose-li:before:content-['•'] prose-li:before:text-brand prose-li:before:font-bold prose-li:before:text-xl
          prose-li:before:absolute prose-li:before:-right-6 prose-li:before:top-0
          
          prose-blockquote:border-r-4 prose-blockquote:border-brand prose-blockquote:bg-gradient-to-l 
          prose-blockquote:from-blue-50 prose-blockquote:to-brand/5 prose-blockquote:p-6 prose-blockquote:my-8
          prose-blockquote:rounded-lg prose-blockquote:shadow-sm prose-blockquote:text-gray-800 
          prose-blockquote:text-lg prose-blockquote:leading-relaxed prose-blockquote:font-medium
          prose-blockquote:before:content-['"'] prose-blockquote:before:text-4xl prose-blockquote:before:text-brand 
          prose-blockquote:before:font-bold prose-blockquote:before:absolute prose-blockquote:before:-top-2 prose-blockquote:before:right-4
          prose-blockquote:relative
          
          prose-code:bg-gray-100 prose-code:px-3 prose-code:py-1 prose-code:rounded-md prose-code:text-sm 
          prose-code:text-brand prose-code:font-medium prose-code:border prose-code:border-gray-200
          
          prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-6 prose-pre:rounded-xl prose-pre:shadow-lg
          prose-pre:my-8 prose-pre:overflow-x-auto prose-pre:text-sm prose-pre:leading-relaxed
          
          prose-img:rounded-xl prose-img:shadow-lg prose-img:my-10 prose-img:border prose-img:border-gray-200
          prose-img:max-w-full prose-img:h-auto prose-img:mx-auto
          
          prose-table:border-collapse prose-table:w-full prose-table:my-8 prose-table:bg-white 
          prose-table:rounded-lg prose-table:overflow-hidden prose-table:shadow-sm prose-table:border prose-table:border-gray-200
          prose-th:border prose-th:border-gray-300 prose-th:bg-brand prose-th:text-white prose-th:p-4 
          prose-th:text-right prose-th:font-bold prose-th:text-sm prose-th:uppercase prose-th:tracking-wide
          prose-td:border prose-td:border-gray-200 prose-td:p-4 prose-td:text-gray-700 prose-td:text-right
          prose-tbody:prose-tr:hover:bg-gray-50 prose-tbody:prose-tr:transition-colors
          
          rtl:prose-blockquote:border-r-0 rtl:prose-blockquote:border-l-4
          rtl:prose-h3:border-r-0 rtl:prose-h3:border-l-4 rtl:prose-h3:pr-0 rtl:prose-h3:pl-4
          rtl:prose-li:before:-left-6 rtl:prose-li:before:right-auto
          rtl:prose-blockquote:before:right-auto rtl:prose-blockquote:before:left-4
          
          medical-content`}
        dangerouslySetInnerHTML={{ __html: content }}
        dir="rtl"
      />
      
      {/* Medical Content Styling */}
      <style jsx>{`
        .medical-content h2 + p:first-of-type {
          font-size: 1.125rem;
          color: #4b5563;
          font-weight: 500;
          margin-bottom: 2rem;
          padding: 1rem;
          background: linear-gradient(to left, #eff6ff, #dbeafe);
          border-radius: 0.75rem;
          border-right: 4px solid #1373b4;
        }
        
        .medical-content h3:has(+ ul) {
          background: linear-gradient(to left, #1373b4, #0e5991);
          color: white;
          padding: 1rem 1.5rem;
          border-radius: 0.75rem;
          border: none;
          margin-bottom: 1rem;
        }
        
        .medical-content ul + h3,
        .medical-content ol + h3 {
          margin-top: 3rem;
        }
        
        .medical-content table {
          font-family: 'Cairo', sans-serif;
        }
        
        .medical-content table th:first-child {
          border-top-right-radius: 0.5rem;
        }
        
        .medical-content table th:last-child {
          border-top-left-radius: 0.5rem;
        }
        
        .medical-content table tr:last-child td:first-child {
          border-bottom-right-radius: 0.5rem;
        }
        
        .medical-content table tr:last-child td:last-child {
          border-bottom-left-radius: 0.5rem;
        }
      `}</style>
    </div>
  );
};

export default BlogContent;
