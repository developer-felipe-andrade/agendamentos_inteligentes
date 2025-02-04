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

  async delete(id) {
    return await api.delete(`/classroom/${id}`);
  } 
}

export default classroom;