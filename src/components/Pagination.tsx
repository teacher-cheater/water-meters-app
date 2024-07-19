import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const paginationRange = () => {
    const range = [];
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    if (startPage > 1) {
      range.push(1);
      if (startPage > 2) range.push('...');
    }

    for (let i = startPage; i <= endPage; i++) {
      range.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) range.push('...');
      range.push(totalPages);
    }

    return range;
  };

  return (
    <div className="pagination">
      {paginationRange().map((page, index) => (
        <button
          key={index}
          className={`page-button ${page === currentPage ? 'active' : ''}`}
          onClick={() => typeof page === 'number' && onPageChange(page)}
          disabled={page === '...'}
        >
          {page}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
