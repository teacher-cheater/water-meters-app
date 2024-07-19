import axios from 'axios';

const api = axios.create({
  baseURL: 'http://showroom.eis24.me/api/v4/test/',
});

export default api;
