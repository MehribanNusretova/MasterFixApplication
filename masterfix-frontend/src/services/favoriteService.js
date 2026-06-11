import api from '../api/axios';

const favoriteService = {
  getMyFavorites: async () => {
    const response = await api.get('/favorites/my');
    return response.data;
  },
  add: async (masterId) => {
    const response = await api.post(`/favorites/${masterId}`);
    return response.data;
  },
  remove: async (masterId) => {
    const response = await api.delete(`/favorites/${masterId}`);
    return response.data;
  },
};

export default favoriteService;
