import api from '../api'

const register = {
  async register(data) {
      return api.post('/auth/register', data);
  },

  async login(data) {
    return api.post('/auth/login', data);
  },

  async recover(data) {
    return api.post('/auth/recover', data);
  },

  async logout() {
    return api.post('/auth/logout');
  }
}

export default register;