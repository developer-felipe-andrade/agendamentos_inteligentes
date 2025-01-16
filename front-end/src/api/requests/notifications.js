import api from '../api';

const notifications = {
    async sendEmail(data) {
        return await api.post('email/send', data);
    },

    async sendWhatsappMessage(data) {
        return await api.post('whatsapp/send', data);
    }
};

export default notifications;