import React, { useContext, useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import api from '../apiConfig/config';
import axios from 'axios';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { UserContext } from '../contexts/userContext';

const AdminConfiguration = () => {

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    createdBy: 'alex',
    modifiedBy: 'alex',
    ipaddress: '',
    status: 1,
    isdelete: 0,
  });

  const { ipAddress } = useContext(UserContext);

  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  // Fetch IP address and set in form data
  useEffect(() => {
    axios.get(`${api.baseUrl}/usergetall`)
      .then(response => response.data.length !== 0 && navigate('/login'))
      .catch(error => console.error(error))

  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataSend = {
      ...formData,
      createdBy: formData.name,
      modifiedBy: formData.name,
      ipaddress: ipAddress,
    }
    // console.log(formDataSend)

    await axios
      .post(`${api.baseUrl}/signup`, formDataSend)
      .then((res) => {
        navigate('/success');
      })
      .catch((err) => console.log(err));
  };

  return (
    <div
      className="relative flex justify-center items-center min-h-screen bg-gray-100"
      style={{
        backgroundImage: `url('/assets/images/login/travel.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Overlay for reduced opacity */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* Content above the background */}
      <div className="relative bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Admin Configuration</h2>
        <p className="text-gray-600 mb-4">
          Fill this form with basic information & admin login credentials
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-gray-700 font-medium mb-2"
            >
              Admin Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter admin name"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 font-medium mb-2"
            >
              Admin Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter admin email"
              required
            />
          </div>
          <div className="mb-6 relative">
            <label
              htmlFor="adminPassword"
              className="block text-gray-700 font-medium mb-2"
            >
              Admin Password (At least 8 characters)
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter admin password"
              minLength={8}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-10 text-gray-500 focus:outline-none"
            >
              {showPassword ? (
                <AiOutlineEyeInvisible size={20} />
              ) : (
                <AiOutlineEye size={20} />
              )}
            </button>
          </div>
          <div className="flex justify-between items-center">
            <button
              type="submit"
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Continue →
            </button>
            {/* <div className="mt-4">
              <Link to="/login" className="text-red-600 hover:underline">Already have an account</Link>
            </div> */}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminConfiguration;