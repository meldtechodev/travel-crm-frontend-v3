import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './component/login';
import PageRoute from './PageRoute';
import AdminConfiguration from './pages/AdminConfiguration';
import SuccessPage from './pages/SuccessPage';
import axios from 'axios';
import api from './apiConfig/config';
import { UserContext } from './contexts/userContext';

const App = () => {

  const navigate = useNavigate();
  const [allUsers, setAllUsers] = useState([])

  const { isAuthenticated, handleLogout, isLoading } = useContext(UserContext);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isSessionExpired()) {
        handleLogout();
      }
    }, 60000); // Check every 60 seconds

    // Clean up the interval on component unmount
    return () => clearInterval(interval);

  }, []);

  // const handleLogout = () => {
  //   localStorage.clear();
  // };

  const isSessionExpired = () => {
    const expiryTime = localStorage.getItem('expiryTime');
    return expiryTime && Date.now() > expiryTime;
  };



  // if (!isAuthenticated) {
  //   localStorage.clear();
  //   navigate('/login');
  // };

  useEffect(() => {
    axios.get(`${api.baseUrl}/usergetall`)
      .then(response => {
        setAllUsers(response.data)
      })
      .catch(error => console.error(error))
  }, [])

  // var isAuthenticated = localStorage.getItem('token') !== null ? true : false

  // console.log('isAuthenticated', isAuthenticated);


  // Protected Route Component
  // const ProtectedRoute = ({ children }) => {
  //   return isAuthenticated ? children : allUsers.length === 0 ? <Navigate to="/login" /> : <Navigate to="/login" />;
  // };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      {isAuthenticated && allUsers.length !== 0 ? (
        <>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home/*" element={<PageRoute />} />
          <Route path="/*" element={<Navigate to="/home" replace />} />
        </>
      ) : (
        <>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route exact path="/signup" element={<AdminConfiguration />} />
          <Route exact path="/success" element={<SuccessPage />} />
          <Route exact path="/login" element={<Login />} />
        </>
      )}
    </Routes>
  );
};

export default App;