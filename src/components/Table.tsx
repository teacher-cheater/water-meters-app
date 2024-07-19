import React from 'react';
import { Instance } from 'mobx-state-tree';
import MeterModel from '../models/MeterModel';
import TableHeader from './TableHeader';
import TableRow from './TableRow';

interface TableProps {
  data: Instance<typeof MeterModel>[];
  currentPage: number;
  itemsPerPage: number;
  onDeleteMeter: (id: string) => void;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Table: React.FC<TableProps> = ({
  data,
  currentPage,
  itemsPerPage,
  onDeleteMeter,
  totalPages,
  onPageChange,
}) => {
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
    <div className="table-container">
      <table>
        <TableHeader />
        <tbody>
          {data.map((meter, index) => (
            <TableRow
              key={meter.id}
              meter={meter}
              index={index}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              onDelete={onDeleteMeter}
            />
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={8}>
              <div className="pagination">
                {paginationRange().map((page, index) => (
                  <button
                    key={index}
                    className={`page-button ${
                      page === currentPage ? 'active' : ''
                    }`}
                    onClick={() =>
                      typeof page === 'number' && onPageChange(page)
                    }
                    disabled={page === '...'}
                  >
                    {page}
                  </button>
                ))}
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default Table;
