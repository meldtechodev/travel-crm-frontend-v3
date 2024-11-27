import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../apiConfig/config";
import axios from "axios";

const NewVendorForm = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    vendorName: "",
    vendorContactNo: "",
    vendorEmail: "",
    vendorAddress: "",
    status: true,
    ipAddress: ""
  });

  const [user, setUser] = useState({})
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

        return axios.get(`${api.baseUrl}/getbytoken`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Access-Control-Allow-Origin': '*'
          }
        });
      })
      .then(response => {
        setUser(response.data);
      })
      .catch(error => console.error('Error fetching protected resource:', error))
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  }

  useEffect(() => {
    axios.get(`${api.baseUrl}/ipAddress`)
      .then((response) => {
        setFormData({
          ...formData, ipAddress: response.data
        })
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      "vendorName": formData.vendorName,
      "vendorEmail": formData.vendorEmail,
      "vendorContactNo": formData.vendorContactNo,
      "vendorAddress": formData.vendorAddress,
      "ipAddress": "14.11.223.21",
      "status": formData.status,
      "isdelete": 0,
      "createdby": user.username,
      "modifiedby": user.username
    }

    await axios.post(`${api.baseUrl}/vendor/create`, payload, {
      headers: {
        // 'Authorization': `Bearer ${token}`,
        'Access-Control-Allow-Origin': '*'
      }
    })
      .then(async (response) => {
        toast.success('Vendor saved Successfully.', {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setFormData({
          ...formData,
          vendorName: "",
          vendorContactNo: "",
          vendorEmail: "",
          vendorAddress: "",
          status: true,
        })
      })
      .catch(error => console.error(error));
  };

  return (
    <div className={`fixed top-0 right-0 h-full bg-gray-200 shadow-lg transform transition-transform duration-500 ${isOpen ? "translate-x-0" : "translate-x-[850px]"} mt-4 sm:mt-8 md:mt-12 lg:w-[800px] sm:w-[400px] md:w-[500px] z-50`}>
      <button onClick={() => onClose(true)} className="absolute top-[12px] left-[-22px] font-semibold text-white text-sm bg-red-700 square px-3  py-1.5 border border-1 border-transparent hover:border-red-700 hover:bg-white hover:text-red-700">X</button>
      <div className="flex justify-between items-center p-4 pl-8 bg-white shadow-md">
        <h2 className="text-lg font-bold text-black">New Vendor</h2>
      </div>
      <div className="border-b border-gray-300 shadow-sm"></div>

      <form className="p-4 overflow-y-auto h-[calc(100vh-160px)]" onSubmit={handleSubmit}>
        <div className="mb-6">
          <h3 className="bg-red-700 text-white p-2 rounded">Basic Vendor Details</h3>
        </div>
        <div className="mb-4">
          <label htmlFor="vendors" className="block text-sm font-medium">Vendor Name</label>
          <input
            type="text"
            id="vendorName"
            name="vendorName"
            value={formData.vendorName}
            onChange={handleInputChange}
            className="mt-1 p-2 w-full border rounded"
            placeholder="Enter Vendor Name"
          />
        </div>
        <div className="flex justify-between mb-4">
          <div className="w-1/2 mr-2">
            <label htmlFor="destinations" className="block text-sm font-medium">Vendor Contact No</label>
            <input
              type="text"
              id="vendorContactNo"
              name="vendorContactNo"
              value={formData.vendorContactNo}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border rounded"
              placeholder="Enter Vendor Contact No"
            />
          </div>
          <div className="w-1/2 mr-2">
            <label htmlFor="destinations" className="block text-sm font-medium">Vendor Email</label>
            <input
              type="email"
              id="vendorEmail"
              name="vendorEmail"
              value={formData.vendorEmail}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border rounded"
              placeholder="Enter Vendor Email"
            />
          </div>
          <div className="w-1/2 mb-4">
            <label htmlFor="status" className="block text-sm font-medium">
              Status
            </label>
            <select id="status" className="mt-1 p-2 w-full border rounded" name="status" value={formData.status} onChange={handleInputChange}>
              <option value={true}>Active</option>
              <option value={false}>Inactive</option>
            </select>
          </div>
        </div>
        <div>
          <div className="mb-6">
            <label htmlFor="destinations" className="block text-sm font-medium">Vendor Address</label>
            <input
              type="text"
              id="vendorAddress"
              name="vendorAddress"
              value={formData.vendorAddress}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border rounded"
              placeholder="Enter Vendor Address"
            />
          </div>
        </div>
        <div className="flex items-center p-3 bg-white shadow-lg rounded w-full fixed bottom-12 left-0 right-0">
          <button type="submit" className="bg-red-700 text-white px-4 py-2 rounded shadow mr-1">Submit</button>
          <button type="button" className="bg-red-700 text-white px-4 py-2 rounded shadow">Reset</button>
        </div>
      </form>
    </div>
  );
};

export default NewVendorForm;
