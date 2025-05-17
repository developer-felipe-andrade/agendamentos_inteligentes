import api from '../api';

const user = {
  async me() {
    return api.get('user/me');
  },

  async pendingUsers() {
    return api.get('user/pending-release');
  },

  async responsibles() {
    return api.get('user/responsibles');
  },

  async release(users) {
    return api.post('/user/release', users);
  }, 

  async delete(id) {
    return api.delete(`/user/${id}`);
  },

  async importUsers(file) {
    const formData = new FormData();
    formData.append('file', file);
    
    return api.post('/user/import-users', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
};

export default user;