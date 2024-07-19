import { types, flow, Instance } from 'mobx-state-tree';
import axios from 'axios';

// Определение модели для Area
const AreaModel = types.model({
  id: types.string,
});

// Определение модели для Meter
const MeterModel = types.model('Meter', {
  area: AreaModel,
  brand_name: types.maybeNull(types.string),
  communication: types.string,
  description: types.string,
  id: types.string,
  initial_values: types.array(types.number),
  installation_date: types.string,
  is_automatic: types.maybeNull(types.string),
  model_name: types.maybeNull(types.string),
  serial_number: types.string,
  _type: types.array(types.string),
});

// Определение модели Store для управления состоянием счетчиков
const MeterStore = types
  .model('MeterStore', {
    data: types.array(MeterModel),
    currentPage: types.number,
    loading: types.boolean,
    itemsPerPage: types.number,
    totalItems: types.number,
  })
  .actions((self) => ({
    // setData(meters: Instance<typeof MeterModel>[]) {
    //   self.data.replace(meters);
    // },
    setLoading(loading: boolean) {
      self.loading = loading;
    },
    setCurrentPage(page: number) {
      self.currentPage = page;
    },
    setTotalItems(total: number) {
      self.totalItems = total;
    },
    fetchData: flow(function* () {
      //@ts-ignore
      self.setLoading(true);
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
        console.log('results', response.data);
        // self.setData(response.data.results);
        self.data.replace(response.data.results)
        //@ts-ignore
        self.setTotalItems(response.data.count || 0);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        //@ts-ignore
        self.setLoading(false);
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
        console.error('Error deleting meter:', error);
      }
    }),
  }));

export { MeterModel, MeterStore };
