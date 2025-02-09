import api from '../api';

const reservation = {
  async register(data) {
    return api.post('/reservations', data);
  },

  async update(data) {
    return api.put('/reservations', data);
  },

  async setActiveStatus(id) {
    return api.patch(`reservations/${id}`);
  },

  async delete(id) {
    return api.delete(`reservations/${id}`);
  },

  async findByClassroom(id) {
    return api.get(`reservations/classroom/${id}`);
  },

  async findByPending() {
    return api.get('reservations/status/pending');
  }
}

export default reservation;