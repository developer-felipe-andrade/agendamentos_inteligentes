import api from '../api';

const whatsapp = {
  async qrCode() {
    return await api.get('/whatsapp/qr-code');
  },

  async status() {
    return await api.get('/whatsapp/status');
  }
}

export default whatsapp;