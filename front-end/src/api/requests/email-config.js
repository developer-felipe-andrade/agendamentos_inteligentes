import api from '../api';

const emailConfig = {
  async testConnection(params) {
    const queryParams = new URLSearchParams(params).toString();
    return api.get(`/email-config/authenticate?${queryParams}`);
  },

  async save(data) {
    return api.post('/email-config', data);
  },

  async delete() {
    return api.delete('/email-config');
  },

  async findConfig() {
    return api.get('/email-config');
  }
}

export default emailConfig;