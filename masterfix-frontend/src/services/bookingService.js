import api from '../api/axios';

const bookingService = {
  create: async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },
  getMyBookings: async () => {
    const response = await api.get('/bookings/my');
    return response.data;
  },
  getMasterBookings: async () => {
    const response = await api.get('/bookings/master');
    return response.data;
  },
  accept: async (id) => {
    const response = await api.put(`/bookings/${id}/accept`);
    return response.data;
  },
  reject: async (id) => {
    const response = await api.put(`/bookings/${id}/reject`);
    return response.data;
  },
  complete: async (id) => {
    const response = await api.put(`/bookings/${id}/complete`);
    return response.data;
  },
  cancel: async (id) => {
    const response = await api.put(`/bookings/${id}/cancel`);
    return response.data;
  },
};

export default bookingService;
