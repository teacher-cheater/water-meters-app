import { types, flow, Instance } from 'mobx-state-tree';
import MeterModel from './MeterModel';
import axios from 'axios';

const MeterStore = types
  .model('MeterStore', {
    data: types.array(MeterModel),
    currentPage: types.number,
    loading: types.boolean,
    itemsPerPage: types.number,
    totalItems: types.number,
  })
  .actions((self) => ({
    setCurrentPage(page: number) {
      self.currentPage = page;
    },
    fetchData: flow(function* () {
      self.loading = true;
      try {
        const response = yield axios.get(
          'http://showroom.eis24.me/api/v4/test/meters/',
          {
            params: {
              limit: self.itemsPerPage,
              offset: (self.currentPage - 1) * self.itemsPerPage,
            },
          }
        );
        self.data.replace(
          response.data.results as Instance<typeof MeterModel>[]
        );
        self.totalItems = response.data.count || 0;
      } catch (error) {
        console.error('Ошибка при получении данных:', error);
      } finally {
        self.loading = false;
      }
    }),
    deleteMeter: flow(function* (id: string) {
      try {
        yield axios.delete(
          `http://showroom.eis24.me/api/v4/test/meters/${id}/`
        );
        const meterToRemove = self.data.find((meter) => meter.id === id);
        if (meterToRemove) {
          self.data.remove(meterToRemove);
        }
      } catch (error) {
        console.error('Ошибка при удалении счетчика:', error);
      }
    }),
  }));

export default MeterStore;
