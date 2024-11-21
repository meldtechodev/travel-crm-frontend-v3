import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './component/login';
import PageRoute from './PageRoute';
import AdminConfiguration from './pages/AdminConfiguration';
import SuccessPage from './pages/SuccessPage';

const App = () => {

  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      if (isSessionExpired()) {
        handleLogout();
      }
    }, 60000); // Check every 60 seconds

    // Clean up the interval on component unmount
    return () => clearInterval(interval);

  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const isSessionExpired = () => {
    const expiryTime = localStorage.getItem('expiryTime');
    return expiryTime && Date.now() > expiryTime;
  };



  const isAuthenticated = () => {
    return localStorage.getItem('encryptedToken') !== null;
  };

  // Protected Route Component
  const ProtectedRoute = ({ children }) => {
    return isAuthenticated() ? children : <Navigate to="/login" />;
  };

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route exact path="/login" element={<Login />} />
      <Route exact path="/signup" element={<AdminConfiguration />} />
      <Route exact path="/success" element={<SuccessPage />} />
      <Route path="/home/*" element={
        <ProtectedRoute>
          <PageRoute />
        </ProtectedRoute>} />
    </Routes>
  );
};

export default App;
