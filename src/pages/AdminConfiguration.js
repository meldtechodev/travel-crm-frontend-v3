import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../apiConfig/config';
import axios from 'axios';

const AdminConfiguration = () => {


  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    createdBy: 'alex',
    modifiedBy: "alex",
    ipaddress: "192.168.1.43",
    status: 1,
    isdelete: 0
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // const formDatasend = new FormData();
    // formDatasend.append('name', formData.name);
    // formDatasend.append('email', formData.email);
    // formDatasend.append('password', formData.password);
    // formDatasend.append('ipaddress', "192.168.1.43");
    // formDatasend.append('status', 1);
    // formDatasend.append('isdelete', 0);
    // formDatasend.append('createdby', "alex");
    // formDatasend.append('modifiedby', "alex");


    await axios.post(`${api.baseUrl}/signup`, formData)
      .then(res => console.log(res.data))
      .catch(err => console.log(err));
       navigate('/success');
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
          <div className="mb-6">
            <label
              htmlFor="adminPassword"
              className="block text-gray-700 font-medium mb-2"
            >
              Admin Password (At least 6 characters)
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter admin password"
              required
            />
          </div>
          <div className="flex justify-between items-center">
            <button
              type="submit"
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Continue →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminConfiguration;
