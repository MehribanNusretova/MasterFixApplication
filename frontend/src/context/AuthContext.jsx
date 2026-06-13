import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../api/apiService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    const role = localStorage.getItem('userRole');
    const token = localStorage.getItem('accessToken');

    if (token && email) {
      setUser({ email, role });
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    console.log("AUTH_CONTEXT: Login started with", credentials.email);
    try {
      const response = await apiService.login(credentials);
      const data = response.data;

      const accessToken = data.accessToken || data.token || data.jwt;
      const refreshToken = data.refreshToken || data.refresh_token;

      if (!accessToken) {
          throw new Error("Backend response-da token tapılmadı!");
      }

      localStorage.setItem('accessToken', accessToken);
      if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('userEmail', data.email);
      localStorage.setItem('userRole', data.role);

      setUser({ email: data.email, role: data.role });
      return data;

    } catch (error) {
      console.error("AUTH_CONTEXT: Login error captured:", error.response?.data || error.message);
      // 7. Error-u mütləq yenidən atırıq (throw), udmuruq!
      throw error; 
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
