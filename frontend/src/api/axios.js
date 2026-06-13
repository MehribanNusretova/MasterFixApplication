import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

// Request Interceptor: Hər sorğuya token əlavə et
api.interceptors.request.use(
  (config) => {
    const url = config.url;
    // 1. Auth endpointlerini mütleq istisna edirik
    const isAuthPath = url.includes('/auth/login') || 
                       url.includes('/auth/register') || 
                       url.includes('/auth/verify');

    if (isAuthPath) {
      // 2. Login requestinde köhnə token göndərilməsin
      console.log("AUTH REQUEST DETECTED. Cleaning headers...");
      delete config.headers.Authorization;
      console.log("LOGIN URL:", config.url);
    } else {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    console.error("Request Interceptor Error:", error);
    return Promise.reject(error);
  }
);

// Response Interceptor: 401/403 xətası zamanı ağıllı refresh məntiqi
api.interceptors.response.use(
  (response) => {
    if (response.config.url.includes('/auth/login')) {
       console.log("LOGIN SUCCESS RESPONSE:", response.data);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const url = originalRequest.url;

    const isAuthRequest = url.includes('/auth/login') || url.includes('/auth/register') || url.includes('/auth/verify');
    
    // Auth requestleri 403 alırsa, refresh etmirik, birbasa error qaytarırıq
    if (isAuthRequest) {
       console.error("AUTH REQUEST FAILED:", error.response?.status);
       return Promise.reject(error);
    }

    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (!accessToken || !refreshToken) {
       return Promise.reject(error);
    }

    // 401/403 statusu gəldikdə və bu təkrar sorğu deyilsə
    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      console.log("Session expired. Attempting token refresh...");
      originalRequest._retry = true;

      try {
        const response = await axios.post('/api/auth/refresh', { refreshToken });
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;

        localStorage.setItem('accessToken', newAccessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);

      } catch (refreshError) {
        console.error("Refresh token expired. Logging out...");
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
