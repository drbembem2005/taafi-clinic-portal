
import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface BlogPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const BlogPagination = ({ currentPage, totalPages, onPageChange }: BlogPaginationProps) => {
  if (totalPages <= 1) return null;

  const renderPageNumbers = () => {
    const pages = [];
    const showEllipsis = totalPages > 7;
    
    if (!showEllipsis) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => onPageChange(i)}
              isActive={currentPage === i}
              className={`cursor-pointer w-12 h-12 rounded-xl border-0 ${
                currentPage === i 
                  ? 'bg-brand text-white shadow-lg shadow-brand/25' 
                  : 'bg-white hover:bg-brand hover:text-white text-gray-700 shadow-sm'
              } transition-all duration-300`}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Show first page
      pages.push(
        <PaginationItem key={1}>
          <PaginationLink
            onClick={() => onPageChange(1)}
            isActive={currentPage === 1}
            className={`cursor-pointer w-12 h-12 rounded-xl border-0 ${
              currentPage === 1 
                ? 'bg-brand text-white shadow-lg shadow-brand/25' 
                : 'bg-white hover:bg-brand hover:text-white text-gray-700 shadow-sm'
            } transition-all duration-300`}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      // Show ellipsis if needed
      if (currentPage > 3) {
        pages.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis className="w-12 h-12 rounded-xl bg-white shadow-sm" />
          </PaginationItem>
        );
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => onPageChange(i)}
              isActive={currentPage === i}
              className={`cursor-pointer w-12 h-12 rounded-xl border-0 ${
                currentPage === i 
                  ? 'bg-brand text-white shadow-lg shadow-brand/25' 
                  : 'bg-white hover:bg-brand hover:text-white text-gray-700 shadow-sm'
              } transition-all duration-300`}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      // Show ellipsis if needed
      if (currentPage < totalPages - 2) {
        pages.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis className="w-12 h-12 rounded-xl bg-white shadow-sm" />
          </PaginationItem>
        );
      }

      // Show last page
      if (totalPages > 1) {
        pages.push(
          <PaginationItem key={totalPages}>
            <PaginationLink
              onClick={() => onPageChange(totalPages)}
              isActive={currentPage === totalPages}
              className={`cursor-pointer w-12 h-12 rounded-xl border-0 ${
                currentPage === totalPages 
                  ? 'bg-brand text-white shadow-lg shadow-brand/25' 
                  : 'bg-white hover:bg-brand hover:text-white text-gray-700 shadow-sm'
              } transition-all duration-300`}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    return pages;
  };

  return (
    <div className="flex justify-center">
      <Pagination className="bg-white rounded-2xl shadow-lg p-4 border-0">
        <PaginationContent className="gap-2">
          <PaginationItem>
            <PaginationPrevious
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              className={`cursor-pointer px-6 py-3 rounded-xl border-0 bg-white hover:bg-brand hover:text-white text-gray-700 shadow-sm transition-all duration-300 ${
                currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              السابق
            </PaginationPrevious>
          </PaginationItem>
          
          {renderPageNumbers()}
          
          <PaginationItem>
            <PaginationNext
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              className={`cursor-pointer px-6 py-3 rounded-xl border-0 bg-white hover:bg-brand hover:text-white text-gray-700 shadow-sm transition-all duration-300 ${
                currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              التالي
            </PaginationNext>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default BlogPagination;
