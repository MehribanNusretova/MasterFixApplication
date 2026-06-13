import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Masters from './pages/Masters';
import MasterDetail from './pages/MasterDetail';
import MyBookings from './pages/MyBookings';
import Favorites from './pages/Favorites';
import AdminDashboard from './pages/AdminDashboard';
import MasterDashboard from './pages/MasterDashboard';
import Profile from './pages/Profile';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/masters" element={<Masters />} />
            <Route path="/masters/:id" element={<MasterDetail />} />
            
            <Route element={<ProtectedRoute />}>
              <Route path="/my-bookings" element={<MyBookings />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
            
            <Route element={<ProtectedRoute allowedRoles={['MASTER']} />}>
              <Route path="/master-dashboard" element={<MasterDashboard />} />
            </Route>
            
            <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
