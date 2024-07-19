import React from 'react';
import { Instance } from 'mobx-state-tree';
import MeterModel from '../models/MeterModel';

interface TableRowProps {
  meter: Instance<typeof MeterModel>; 
  index: number;
  currentPage: number;
  itemsPerPage: number;
  onDelete: (id: string) => void;
}

const TableRow: React.FC<TableRowProps> = ({
  meter,
  index,
  currentPage,
  itemsPerPage,
  onDelete,
}) => (
  <tr>
    <td className="sequence-number">
      {(currentPage - 1) * itemsPerPage + index + 1}
    </td>
    <td>
      <span
        className={
          meter._type.includes('ColdWaterAreaMeter') ? 'icon-cold' : 'icon-hot'
        }
      />
      {meter._type.includes('ColdWaterAreaMeter') ? 'ХВС' : 'ГВС'}
    </td>
    <td>{new Date(meter.installation_date).toLocaleDateString()}</td>
    <td>{meter.is_automatic ? 'Да' : 'Нет'}</td>
    <td>{meter.initial_values.join(', ')}</td>
    <td>{meter.area.id}</td>
    <td>{meter.description}</td>
    <td>
      <button className="delete-button" onClick={() => onDelete(meter.id)}>
        <svg
          width="20.000000"
          height="22.000000"
          viewBox="0 0 20 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            id="Icon"
            d="M14.72 0L5.27 0L4.27 3L0 3L0 5L2 5L3 22L17 22L18 5L20 5L20 3L15.72 3L14.72 0ZM13.61 3L6.38 3L6.72 2L13.27 2L13.61 3ZM5 20L4 5L16 5L15 20L5 20ZM9 8L9 17L7 17L7 8L9 8ZM13 8L13 17L11 17L11 8L13 8Z"
            fill="#697180"
            fillOpacity="1.000000"
            fillRule="evenodd"
          />
        </svg>
      </button>
    </td>
  </tr>
);

export default TableRow;
