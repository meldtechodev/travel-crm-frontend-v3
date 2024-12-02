import React, { useEffect, useState } from "react";
import Select from "react-select";
import api from "../apiConfig/config";
import axios from "axios";

// const roleOptions = [
//   { value: "admin", label: "Admin" },
//   { value: "user", label: "User" },
// ];



const NewMember = ({ isOpen, onClose }) => {
  const [role, setRole] = useState([])
  const [selectedOption, setSelectedOption] = useState(null)
  const [errors, setErrors] = useState({});


  const [token, setTokens] = useState(null)
  async function decryptToken(encryptedToken, key, iv) {
    const dec = new TextDecoder();

    const decrypted = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      key,
      encryptedToken
    );

    return dec.decode(new Uint8Array(decrypted));
  }

  // Function to retrieve and decrypt the token
  async function getDecryptedToken() {
    const keyData = JSON.parse(localStorage.getItem('encryptionKey'));
    const ivBase64 = localStorage.getItem('iv');
    const encryptedTokenBase64 = localStorage.getItem('encryptedToken');


    if (!keyData || !ivBase64 || !encryptedTokenBase64) {
      throw new Error('No token found');
    }

    // Convert back from base64
    const key = await crypto.subtle.importKey('jwk', keyData, { name: "AES-GCM" }, true, ['encrypt', 'decrypt']);
    const iv = new Uint8Array(atob(ivBase64).split('').map(char => char.charCodeAt(0)));
    const encryptedToken = new Uint8Array(atob(encryptedTokenBase64).split('').map(char => char.charCodeAt(0)));

    return await decryptToken(encryptedToken, key, iv);
  }

  // Example usage to make an authenticated request
  useEffect(() => {
    getDecryptedToken()
      .then(token => {
        setTokens(token);
      })
      .catch(error => console.error('Error fetching protected resource:', error))
  }, [])


  useEffect(() => {
    axios.get(`${api.baseUrl}/rolesPermission`, {
      headers: {
        "content-type": "text/html"
      }
    }
    ).then(response => {
      const formattedOptions = response.data.map(item => ({
        value: item.id, // or any unique identifier
        label: item.name // or any display label you want
      }));
      setRole(formattedOptions);
      console.log()
    })
      .catch((error) => {
        console.error('Error fetching data:', error);
      })
  }, [])

  const [formData, setFormData] = useState({
    Company: "",
    role: "",
    Department: "",
    Designation: "",
    firstName: "",
    middleName: "",
    lastName: "",
    Email: "",
    Password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
   
  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First Name is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleRoleChange = (selectedOption) => {
    // setFormData((prevData) => ({
    //   ...prevData,
    //   role: selectedOption,
    // }));
    setSelectedOption(selectedOption)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate form fields
    if (!validateForm()) {
      alert("Please fill out the required fields.");
      return;
    }
  
    const postData = {
      username: formData.firstName, // Assuming username corresponds to firstName
      email: formData.Email, // Ensure consistent case for field names
      password: formData.Password, 
      role: selectedOption ? [selectedOption.value] : [], // Send role ID(s)
    };
  
    try {
      const response = await axios.post(`${api.baseUrl}/signup`, postData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      alert("User successfully created!");
      setFormData({
        Company: "",
        role: "",
        Department: "",
        Designation: "",
        firstName: "",
        middleName: "",
        lastName: "",
        Email: "",
        Password: "",
      });
      setSelectedOption(null); // Clear role selection
    } catch (error) {
      console.error("Error creating user:", error);
      alert("There was an error creating the user. Please try again.");
    }
  };
  
  const handleReset = () => {
    setFormData({
      Company: "",
      role: "",
      Department: "",
      Designation: "",
      firstName: "",
      middleName: "",
      lastName: "",
      Email: "",
      Password: "",
    });
    setSelectedOption(null); // Clear role selection
    setErrors({}); // Clear errors
  };
  


  return (
    <div
      className={`fixed top-0 right-0 h-full bg-gray-200 shadow-lg z-50 transform transition-transform duration-500 ${isOpen ? "translate-x-0" : "translate-x-[850px]"} mt-4 sm:mt-8 md:mt-12 lg:w-[800px] sm:w-[400px] md:w-[500px]`}
    >
      {/* "X" button positioned outside the form box */}
      <button className="absolute top-[12px] left-[-22px] font-semibold text-white text-sm bg-red-700 square px-3  py-1.5 border border-1 border-transparent hover:border-red-700 hover:bg-white hover:text-red-700" onClick={() => onClose(true)}>
        X
      </button>
      <div className="flex justify-between items-center p-4 pl-8 bg-white shadow-md">
        <h2 className="text-lg font-bold text-black">New Member</h2>
      </div>
      {/* Line below the title with shadow */}
      {/* <div className="border-b border-gray-300 shadow-sm"></div> */}

      <form className="p-4">
        <div className="mb-4">
          <h3 className="bg-red-700 text-white p-2 rounded text-sm sm:text-base">
            Basic Information
          </h3>
        </div>

        {/* Role and Username fields in one row */}
        <div className="flex flex-wrap sm:flex-nowrap -mx-1 sm:-mx-2 mb-3 sm:mb-4">
          <div className="w-full sm:w-1/2 px-1 sm:px-2 mb-3 sm:mb-0">
            <label className="block text-gray-700 text-sm font-bold mb-1 sm:mb-2" htmlFor="role">
              Company <span className="text-red-700">*</span>
            </label>
            <Select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleRoleChange}
              options={role}
              className="w-full"
              placeholder="Select..."
            />
          </div>
          <div className="w-full sm:w-1/2 px-1 sm:px-2 mb-3 sm:mb-0">
            <label className="block text-gray-700 text-sm font-bold mb-1 sm:mb-2" htmlFor="role">
              Role <span className="text-red-700">*</span>
            </label>
            <Select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleRoleChange}
              options={role}
              className="w-full"
              placeholder="Select..."
            />
          </div>
        </div>
        <div className="flex flex-wrap sm:flex-nowrap -mx-1 sm:-mx-2 mb-3 sm:mb-4">
          <div className="w-full sm:w-1/2 px-1 sm:px-2 mb-3 sm:mb-0">
            <label className="block text-gray-700 text-sm font-bold mb-1 sm:mb-2" htmlFor="role">
              Department <span className="text-red-700">*</span>
            </label>
            <Select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleRoleChange}
              options={role}
              className="w-full"
              placeholder="Select..."
            />
          </div>
          <div className="w-full sm:w-1/2 px-1 sm:px-2 mb-3 sm:mb-0">
            <label className="block text-gray-700 text-sm font-bold mb-1 sm:mb-2" htmlFor="role">
              Designation <span className="text-red-700">*</span>
            </label>
            <Select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleRoleChange}
              options={role}
              className="w-full"
              placeholder="Select..."
            />
          </div>
        </div>
        <div className="flex gap-2 mb-4">
          <div className="w-1/2">
            <label htmlFor="firstName" className="block text-sm font-medium">
              First Name <span className="text-red-700">*</span>
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              className="mt-1 p-2 w-full border rounded"
              placeholder="Enter First Name"
              value={formData.firstName}
              onChange={handleChange}
            />
            {errors.firstName && (
              <span className="text-red-600 text-sm">{errors.firstName}</span>
            )}
          </div>
          <div className="w-1/4">
            <label htmlFor="middleName" className="block text-sm font-medium">
              Middle Name
            </label>
            <input
              type="text"
              id="middleName"
              name="middleName"
              className="mt-1 p-2 w-full border rounded"
              placeholder="Enter Middle Name"
              value={formData.middleName}
              onChange={handleChange}
            />
          </div>
          <div className="w-1/4">
            <label htmlFor="lastName" className="block text-sm font-medium">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              className="mt-1 p-2 w-full border rounded"
              placeholder="Enter Last Name"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
        </div>
        {/* Email and Password fields in one row */}
        <div className="flex flex-wrap sm:flex-nowrap -mx-1 sm:-mx-2 mb-3 sm:mb-4">
          <div className="w-full sm:w-1/2 px-1 sm:px-2 mb-3 sm:mb-0">
            <label className="block text-gray-700 text-sm font-bold mb-1 sm:mb-2" htmlFor="email">
              Email <span className="text-red-700">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Your Team Member Email Id"
              value={formData.Email}
              onChange={handleChange}
              className="border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="w-full sm:w-1/2 px-1 sm:px-2">
            <label className="block text-gray-700 text-sm font-bold mb-1 sm:mb-2" htmlFor="password">
              Password <span className="text-red-700">*</span>
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Type Strong Password For Your Team Member"
              value={formData.password}
              onChange={handleChange}
              className="border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        </div>
      </form>

      {/* Line with shadow above the buttons */}
      <div className="flex justify-between items-center p-3 bg-white shadow-lg rounded w-full fixed bottom-12">
        <div className="flex justify-start space-x-4">
          <button type="button" className="bg-red-700 text-white px-4 py-2 rounded shadow"
            onClick={handleSubmit}>
            Submit
          </button>
          <button
            type="button"
            className="bg-red-700 text-white px-4 py-2 rounded shadow"
            onClick={handleReset}>   
            Reset
          </button>
        </div>
      </div>
    </div>

  );
};

export default NewMember;
