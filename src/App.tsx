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
    fetch(`http://showroom.eis24.me/api/v4/test/meters/?limit=20&offset=20`)
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
                {meter._type.includes('ColdWaterAreaMeter') ? 'ХВС' : 'ГВС'}
              </td>
              <td>{new Date(meter.installation_date).toLocaleDateString()}</td>
              <td>{meter.is_automatic ? 'Да' : 'Нет'}</td>
              <td>{meter.initial_values.join(', ')}</td>
              <td>{meter.area.id}</td>
              <td>{meter.description}</td>
              <td>
                <button onClick={() => onDelete(meter.id)}>Удалить</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
