import api from '../api';

const reservation = {
  async register(data) {
    return api.post('/reservations', data);
  },

  async update(id, data) {
    return api.put(`/reservations/${id}`, data);
  },

  async setActiveStatus(id) {
    return api.patch(`reservations/${id}`);
  },

  async delete(id) {
    return api.delete(`reservations/${id}`);
  },

  async findById(id) {
    return api.get(`/reservations/${id}`);
  },

  async findByClassroom(id) {
    return api.get(`reservations/classroom/${id}`);
  },

  async findByResponsible(id) {
    return api.get(`/reservations/responsible/${id}`)
  }
}

export default reservation;