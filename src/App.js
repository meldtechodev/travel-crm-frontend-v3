import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './component/login';
import PageRoute from './PageRoute';
import AdminConfiguration from './pages/AdminConfiguration';
import SuccessPage from './pages/SuccessPage';
import axios from 'axios';
import api from './apiConfig/config';

const App = () => {

  const navigate = useNavigate();
  const [allUsers, setAllUsers] = useState([])

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



  // const isAuthenticated = () => {
  //   return localStorage.getItem('encryptedToken') !== null;
  // };

  useEffect(() => {
    axios.get(`${api.baseUrl}/usergetall`)
      .then(response => {
        setAllUsers(response.data)
      })
      .catch(error => console.error(error))
  }, [])

  var isAuthenticated = localStorage.getItem('encryptedToken') !== null ? true : false

  // console.log('isAuthenticated', isAuthenticated);


  // Protected Route Component
  const ProtectedRoute = ({ children }) => {
    return isAuthenticated ? children : allUsers.length === 0 ? <Navigate to="/signup" /> : <Navigate to="/login" />;
  };

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home/quickstart" replace />} />
      <Route exact path="/signup" element={<AdminConfiguration />} />
      <Route exact path="/success" element={<SuccessPage />} />
      <Route exact path="/login" element={<Login />} />
      <Route path="/home/*" element={
        <ProtectedRoute>
          <PageRoute />
        </ProtectedRoute>} />
    </Routes>
  );
};

export default App;