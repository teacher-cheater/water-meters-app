import { useEffect, useState } from 'react';
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
  console.log(data);

  useEffect(() => {
    fetch(`http://showroom.eis24.me/api/v4/test/meters/?limit=100&offset=100`)
      .then((res) => res.json())
      .then((arr) => {
        setData(arr.results);
      });
    window.scrollTo(0, 0);
  }, []);

  const onDelete = (id: string) => {
    fetch(`http://showroom.eis24.me/api/v4/test/meters/${id}/`, {
      method: 'DELETE',
    }).then(() => {
      setData((prevData) => prevData.filter((meter) => meter.id !== id));
    });
  };

  return (
    <div className="App">
      <header>
        <h1>Список счетчиков</h1>
      </header>
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
              <td>{index + 1}</td>
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
              <td>{new Date(meter.installation_date).toLocaleDateString()}</td>
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
                      fill-opacity="1.000000"
                      fill-rule="evenodd"
                    />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
