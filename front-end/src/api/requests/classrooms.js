import api from '../api';

const classroom = {
  async create(data) {
    return await api.post('/classroom', data);
  },

  async update(data, id) {
    return await api.put(`/classroom/${id}`, data);
  },

  async getAll() {
    return await api.get('/classroom');
  },

  async findById(id) {
    return await api.get(`/classroom/${id}`);
  },

  async findAll() {
    return await api.get('/classroom');
  },

  async findAvailableClassrooms(params) {
    const queryParams = new URLSearchParams(params).toString();
    return await api.get(`/classroom/findAvailableClassrooms?${queryParams}`);
  },

  async delete(id) {
    return await api.delete(`/classroom/${id}`);
  } 
}

export default classroom;