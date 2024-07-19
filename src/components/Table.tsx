import React from 'react';
import TableHeader from './TableHeader';
import TableRow from './TableRow';
import { Instance } from 'mobx-state-tree';
import MeterModel from '../models/MeterModel';

interface TableProps {
  data: Instance<typeof MeterModel>[]; 
  currentPage: number;
  itemsPerPage: number;
  onDeleteMeter: (id: string) => void;
}

const Table: React.FC<TableProps> = ({
  data,
  currentPage,
  itemsPerPage,
  onDeleteMeter,
}) => (
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
    </table>
  </div>
);

export default Table;
