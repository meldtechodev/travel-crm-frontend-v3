import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { FaFacebook, FaLinkedin, FaTwitter } from "react-icons/fa";
import api from "../apiConfig/config";
import { UserContext } from "../contexts/userContext";

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  // const [profileData, setProfileData] = useState(null);

  const { user, setUser } = useContext(UserContext);

  const [formData, setFormData] = useState(user);

  // useEffect(() => {
  //   const token = localStorage.getItem("token");

  //   axios.get(`${api.baseUrl}/username`, {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //       "Access-Control-Allow-Origin": "*",
  //     },
  //   }).then((response) => {
  //     setProfileData(response.data);
  //   });
  // }, []);
  console.log(user)

  useEffect(() => {
    if (user) {
      setFormData(user);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    setUser(formData); // Save changes

    axios.post(`${api.baseUrl}/updatebyid/${user.userId}`)


    setIsEditing(false); // Exit edit mode
  };

  const handleCancel = () => {
    setFormData(user); // Revert changes
    setIsEditing(false); // Exit edit mode
  };

  return (
    <div className="min-h-screen bg-gray-200 p-4 overflow-auto">
      {/* Header */}
      <div className="flex justify-between items-center w-full h-16 bg-white shadow-md mb-4 px-6">
        <h1 className="text-lg font-bold">Profile Information</h1>
        {/* <div className="w-4 h-4 bg-red-500 rounded-full"></div> */}
      </div>

      {/* Profile Header */}
      <div className="bg-white shadow-md rounded-md p-6 mb-6 flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center space-x-6 mb-4 md:mb-0">
          {/* Profile Picture */}
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-gray-700">
              {user && `${user.name.charAt(0).toUpperCase()}`}
            </span>
          </div>
          {/* User Info */}
          <div>
            <h1 className="text-lg font-semibold text-gray-800">{`${user && user.name}  ${user && user.mname !== null ? user.mname : ""} ${user && user.lname !== null ? user.lname : ""}`}</h1>
            <p className="text-gray-600 text-sm">{user && user.email}</p>
            <span className="text-xs bg-orange-100 text-orange-800 font-medium py-1 px-2 rounded inline-block mt-2">
              {user && user.designation && user.designation.designationName}
            </span>
          </div>
        </div>
        <button
          onClick={() => setIsEditing(true)}
          className="px-4 py-2 bg-red-500  text-white rounded-md mt-4 md:mt-0"
        >
          Edit Profile
        </button>
      </div>

      {/* Profile Details */}
      <div className="bg-white shadow-md rounded-md p-6 mb-6">
        <h2 className="text-lg font-bold mb-4">Work Information</h2>
        <div className="grid grid-cols-3 gap-6">
          {/* First Name */}
          <div>
            <p className="text-sm font-bold">First Name</p>
            {isEditing ? (
              <input
                type="text"
                name="firstName"
                value={formData && formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded-md mt-2"
              />
            ) : (
              <p className="text-sm">{user && user.name}</p>
            )}
          </div>
          {/* Middle Name */}
          <div>
            <p className="text-sm font-bold">Middle Name</p>
            {isEditing ? (
              <input
                type="text"
                name="middleName"
                value={formData && formData.mname}
                onChange={handleChange}
                className="w-full p-2 border rounded-md mt-2"
              />
            ) : (
              <p className="text-sm">{user && user.mname}</p>
            )}
          </div>
          {/* Last Name */}
          <div>
            <p className="text-sm font-bold">Last Name</p>
            {isEditing ? (
              <input
                type="text"
                name="lastName"
                value={formData && formData.lname}
                onChange={handleChange}
                className="w-full p-2 border rounded-md mt-2"
              />
            ) : (
              <p className="text-sm">{user && user.lname}</p>
            )}
          </div>
          {/* Email */}
          <div>
            <p className="text-sm font-bold">Email</p>
            {/* {isEditing ? (
              <input
                type="email"
                name="email"
                value={formData && formData.email}
                onChange={handleChange}
                className="w-full p-2 border rounded-md mt-2"
              />
            ) : ( */}
            <p className="text-sm">{user && user.email}</p>
            {/* )} */}
          </div>
          {/* Mobile Number */}
          <div>
            <p className="text-sm font-bold">Mobile Number</p>
            {isEditing ? (
              <input
                type="text"
                name="mobileNumber"
                value={formData && formData.mobnumber}
                onChange={handleChange}
                className="w-full p-2 border rounded-md mt-2"
              />
            ) : (
              <p className="text-sm">{user && user.mobnumber}</p>
            )}
          </div>
          {/* Company Name */}
          <div>
            <p className="text-sm font-bold">Company Name</p>
            {/* {isEditing ? (
              <input
                type="text"
                name="companyName"
                value={formData && formData.companyName}
                onChange={handleChange}
                className="w-full p-2 border rounded-md mt-2"
              />
            ) : ( */}
            <p className="text-sm">{user && user.company && user.company.companyname}</p>
            {/* )} */}
          </div>
          {/* Designation */}
          <div>
            <p className="text-sm font-bold">Designation</p>
            {/* {isEditing ? (
              <input
                type="text"
                name="designation"
                value={formData && formData.designation && formData.designation.designationName}
                onChange={handleChange}
                className="w-full p-2 border rounded-md mt-2"
              />
            ) : ( */}
            <p className="text-sm">{user && user.designation && user.designation.designationName}</p>
            {/* )} */}
          </div>
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex justify-end space-x-4 mt-6">
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-200 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-red-500 text-white rounded-md"
            >
              Save
            </button>
          </div>
        )}
      </div>

      {/* Social Links */}
      <div className="bg-white shadow-md rounded-md p-6 mb-10">
        {/* Other Information */}
        <section>
          <h2 className="text-lg font-bold mb-4">Other Information</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-bold">Language</p>
              <p className="text-sm">{user && user.language}</p>
            </div>
            <div>
              <p className="text-sm font-bold">Time Zone</p>
              <p className="text-sm">{user && user.timezone}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 mt-6">
            <a href="#" className="text-blue-600">
              <FaFacebook size={24} />
            </a>
            <a href="#" className="text-blue-500">
              <FaLinkedin size={24} />
            </a>
            <a href="#" className="text-blue-400">
              <FaTwitter size={24} />
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProfilePage;
