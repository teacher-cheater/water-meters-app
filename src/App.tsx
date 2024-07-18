import { useEffect, useState } from 'react';
import axios from 'axios'; 
import './App.css';

interface Area {
  id: string;
}

interface Meter {
  area: Area;
  brand_name: string | null;
  communication: string;
  description: string;
  id: string;
  initial_values: number[];
  installation_date: string;
  is_automatic: boolean | null;
  model_name: string | null;
  serial_number: string;
  _type: string[];
}

function App() {
  const [data, setData] = useState<Meter[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 20;
  const totalItems = 200; 

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://showroom.eis24.me/api/v4/test/meters/`,
          {
            params: {
              limit: itemsPerPage,
              offset: (currentPage - 1) * itemsPerPage,
            },
          }
        );
        setData(response.data.results);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);

  const onDelete = async (id: string) => {
    try {
      await axios.delete(`http://showroom.eis24.me/api/v4/test/meters/${id}/`);
      setData((prevData) => prevData.filter((meter) => meter.id !== id));
    } catch (error) {
      console.error('Error deleting meter:', error);
    }
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

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
    <div className="App">
      <header>
        <h1>Список счетчиков</h1>
      </header>
      {loading ? (
        <p className="table-loading">Идёт загрузка...</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>№</th>
                <th>Тип</th>
                <th>Дата установки</th>
                <th>Автоматический</th>
                <th>Значение</th>
                <th>Адрес</th>
                <th>Примечание</th>
                <th>Действие</th>
              </tr>
            </thead>
            <tbody>
              {data.map((meter, index) => (
                <tr key={meter.id}>
                  <td className="sequence-number">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td>
                    <span
                      className={
                        meter._type.includes('ColdWaterAreaMeter')
                          ? 'icon-cold'
                          : 'icon-hot'
                      }
                    />
                    {meter._type.includes('ColdWaterAreaMeter') ? 'ХВС' : 'ГВС'}
                  </td>
                  <td>
                    {new Date(meter.installation_date).toLocaleDateString()}
                  </td>
                  <td>{meter.is_automatic ? 'Да' : 'Нет'}</td>
                  <td>{meter.initial_values.join(', ')}</td>
                  <td>{meter.area.id}</td>
                  <td>{meter.description}</td>
                  <td>
                    <button
                      className="delete-button"
                      onClick={() => onDelete(meter.id)}
                    >
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
                          typeof page === 'number' && handlePageChange(page)
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
      )}
    </div>
  );
}

export default App;
