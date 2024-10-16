import api from '../api';

const room = {
  async create(data) {
    return await api.post('/room', data);
  },

  async update(data, id) {
    return await api.put(`/room/${id}`, data);
  },

  async getAll() {
    return await api.get('/room');
  },

  async findById(id) {
    return await api.get(`/room/${id}`);
  },

  async delete(id) {
    return await api.delete(`/room/${id}`);
  }
}

export default room;