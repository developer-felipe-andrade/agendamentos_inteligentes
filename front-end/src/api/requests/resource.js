import api from '../api';

const resource = {
    async create(data) {
        return await api.post('/resource', data);
      },
    
      async update(data, id) {
        return await api.put(`/resource/${id}`, data);
      },
    
      async getAll() {
        return await api.get('/resource');
      },
    
      async findById(id) {
        return await api.get(`/resource/${id}`);
      },
    
      async delete(id) {
        return await api.delete(`/resource/${id}`);
      }
}

export default resource;