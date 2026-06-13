import api from './axios';

const apiService = {
  // Auth
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  verifyEmail: (token) => api.get(`/auth/verify?token=${token}`),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),

  // Categories
  getCategories: () => api.get('/categories'),

  // Masters
  getMasters: (params) => api.get('/masters', { params }),
  searchMasters: (params) => api.get('/masters/search', { params }),
  getMasterById: (id) => api.get(`/masters/${id}`),
  createMaster: (data) => api.post('/masters', data),
  updateMyMasterProfile: (data) => api.put('/masters/me', data),
  uploadMasterImage: (formData) => api.post('/masters/me/profile-image', formData),

  // Bookings
  createBooking: (data) => api.post('/bookings', data),
  getMyBookings: () => api.get('/bookings/my'),
  getMasterBookings: () => api.get('/bookings/master'),
  acceptBooking: (id) => api.put(`/bookings/${id}/accept`),
  rejectBooking: (id) => api.put(`/bookings/${id}/reject`),
  completeBooking: (id) => api.put(`/bookings/${id}/complete`),
  cancelBooking: (id) => api.put(`/bookings/${id}/cancel`),
  deleteBooking: (id) => api.delete(`/bookings/${id}`),
  hideBooking: (id) => api.patch(`/bookings/${id}/hide`),
  updateBookingStatus: (id, status) => api.patch(`/bookings/${id}/status`, { status }),
  getBookingMessages: (bookingId) => api.get(`/bookings/${bookingId}/messages`),
  sendBookingMessage: (bookingId, content) => api.post(`/bookings/${bookingId}/messages`, { content }),

  // Portfolio
  addPortfolioItem: (formData) => api.post('/masters/me/portfolio', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getMasterPortfolio: (masterId) => api.get(`/masters/${masterId}/portfolio`),
  deletePortfolioItem: (id) => api.delete(`/masters/me/portfolio/${id}`),

  // Favorites
  getFavorites: () => api.get('/favorites/my'),
  addFavorite: (masterId) => api.post(`/favorites/${masterId}`),
  removeFavorite: (masterId) => api.delete(`/favorites/${masterId}`),

  // Reviews
  getMasterReviews: (masterId) => api.get(`/reviews/master/${masterId}`),
  addReview: (data) => api.post('/reviews', data),

  // Users
  getMyProfile: () => api.get('/users/me'),
  updateProfile: (data) => api.put('/users/me', data),
  getAllUsers: () => api.get('/users'),
};

export default apiService;
