import api from "../api";

const review = {
  async register(id, data) {
    return api.put(`/reviews/${id}`, data);
  }
};

export default review;