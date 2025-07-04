import api from '../api';

const reservation = {
  async register(data) {
    return api.post('/reservations', data);
  },

  async reject(data) {
    return api.post('/reservations/reject', data);
  },

  async update(id, data) {
    return api.put(`/reservations/${id}`, data);
  },

  async approve(data) {
    return api.put('/reservations/approve', data);
  },

  async delete(id) {
    return api.delete(`reservations/${id}`);
  },

  async findById(id) {
    return api.get(`/reservations/${id}`);
  },

  async findByClassroom(id, page = 0, size = 99999999) {
    return api.get(`reservations/classroom/${id}`, {
      params: {
        page,
        size
      }
    });
  },

  async findByResponsible(page = 0, size = 99999999) {
    return api.get(`/reservations/pending`, {
      params: {
        page,
        size
      }
    });
  },

  async findAll({ dtStart, dtEnd, page = 0, size = 99999999 }) {
    const queryParams = new URLSearchParams();

    if (dtStart) queryParams.append("dtStart", dtStart);
    if (dtEnd) queryParams.append("dtEnd", dtEnd);
    queryParams.append("page", page.toString());
    queryParams.append("size", size.toString());

    return api.get(`/reservations?${queryParams.toString()}`);
  }

}

export default reservation;