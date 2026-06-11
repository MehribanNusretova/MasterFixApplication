import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Masters from './pages/Masters';
import MasterDetail from './pages/MasterDetail';
import Profile from './pages/Profile';
import Favorites from './pages/Favorites';
import MyBookings from './pages/MyBookings';
import MasterBookings from './pages/MasterBookings';
import CreateMasterProfile from './pages/CreateMasterProfile';
import AdminCategories from './pages/AdminCategories';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            <Navbar />
            <main className="container mx-auto pb-20">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/masters" element={<Masters />} />
                <Route path="/masters/:id" element={<MasterDetail />} />

                {/* Protected User Routes */}
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/favorites" element={
                  <ProtectedRoute>
                    <Favorites />
                  </ProtectedRoute>
                } />
                <Route path="/my-bookings" element={
                  <ProtectedRoute>
                    <MyBookings />
                  </ProtectedRoute>
                } />
                <Route path="/create-master-profile" element={
                  <ProtectedRoute>
                    <CreateMasterProfile />
                  </ProtectedRoute>
                } />

                {/* Protected Master Routes */}
                <Route path="/master-bookings" element={
                  <ProtectedRoute>
                    <MasterBookings />
                  </ProtectedRoute>
                } />

                {/* Protected Admin Routes */}
                <Route path="/admin/categories" element={
                  <ProtectedRoute adminOnly>
                    <AdminCategories />
                  </ProtectedRoute>
                } />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
