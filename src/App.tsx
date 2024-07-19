import { useEffect } from 'react';
import { observer, useLocalStore } from 'mobx-react-lite';
import './App.css';
import './index.css';
import MeterStore from './models/MeterStore';
import Table from './components/Table';
import LoadingIndicator from './components/LoadingIndicator';

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

  return (
    <div className="App">
      <header>
        <h1>Список счетчиков</h1>
      </header>
      {store.loading ? (
        <LoadingIndicator />
      ) : (
        <Table
          data={store.data}
          currentPage={store.currentPage}
          itemsPerPage={store.itemsPerPage}
          onDeleteMeter={store.deleteMeter}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
});

export default App;
