import { types } from 'mobx-state-tree';
import AreaModel from './AreaModel';

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

export default MeterModel;
