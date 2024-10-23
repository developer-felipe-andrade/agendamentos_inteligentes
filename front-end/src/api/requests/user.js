import api from '../api';

const user = {
  async me() {
    return api.get('user/me');
  },

  async pendingUsers() {
    return api.get('user/peding-release');
  },

  async release(users) {
    return api.post('/user/release', users);
  } 
};

export default user;