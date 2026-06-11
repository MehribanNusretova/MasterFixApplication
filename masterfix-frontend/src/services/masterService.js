import api from '../api/axios';

const masterService = {
  getAll: async () => {
    const response = await api.get('/masters');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/masters/${id}`);
    return response.data;
  },
  create: async (masterData) => {
    const response = await api.post('/masters', masterData);
    return response.data;
  },
  updateMe: async (masterData) => {
    const response = await api.put('/masters/me', masterData);
    return response.data;
  },
  deleteMe: async () => {
    const response = await api.delete('/masters/me');
    return response.data;
  },
  getByCategory: async (categoryId) => {
    const response = await api.get(`/masters/category/${categoryId}`);
    return response.data;
  },
  getByCity: async (city) => {
    const response = await api.get(`/masters/city?city=${city}`);
    return response.data;
  },
};

export default masterService;
