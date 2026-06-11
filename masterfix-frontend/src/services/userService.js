import api from '../api/axios';

const userService = {
  getMe: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },
  updateMe: async (userData) => {
    const response = await api.put('/users/me', userData);
    return response.data;
  },
};

export default userService;
