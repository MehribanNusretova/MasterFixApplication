import api from '../api/axios';

const reviewService = {
  create: async (reviewData) => {
    const response = await api.post('/reviews', reviewData);
    return response.data;
  },
  getByMaster: async (masterId) => {
    const response = await api.get(`/reviews/master/${masterId}`);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/reviews/${id}`);
    return response.data;
  },
};

export default reviewService;
