import { useEffect } from 'react';
import { observer, useLocalStore } from 'mobx-react-lite';
import './App.css';
import { MeterStore } from './models/MeterModel';

// Определяем тип возвращаемого объекта
const App = observer(() => {
  const store = useLocalStore(() =>
    MeterStore.create({
      data: [],
      currentPage: 1,
      loading: true,
      itemsPerPage: 20,
      totalItems: 200,
    })
  );

  useEffect(() => {
    store.fetchData();
  }, [store, store.currentPage]);

  const totalPages = Math.ceil(store.totalItems / store.itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      store.setCurrentPage(page);
    }
  };

  const paginationRange = () => {
    const range = [];
    const startPage = Math.max(1, store.currentPage - 2);
    const endPage = Math.min(totalPages, store.currentPage + 2);

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
      {store.loading ? (
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
              {store.data.map((meter, index) => (
                <tr key={meter.id}>
                  <td className="sequence-number">
                    {(store.currentPage - 1) * store.itemsPerPage + index + 1}
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
                      onClick={() => store.deleteMeter(meter.id)}
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
                          page === store.currentPage ? 'active' : ''
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
});

export default App;
