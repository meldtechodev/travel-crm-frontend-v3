import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import Select, { components } from 'react-select';
import api from "../apiConfig/config";
import { toast } from "react-toastify";
import { UserContext } from "../contexts/userContext";
import useDecryptedToken from "../hooks/useDecryptedToken";

const NewTransportationForm = ({ isOpen, onClose, selectedTransportData }) => {
  const [ip, setIp] = React.useState("");

  const { user } = useContext(UserContext);
  const token = useDecryptedToken();

  const [formData, setFormData] = useState({
    transportmode: "",
    transportsupplier: "",
    priceperday: 0,
    status: false,
  });

  useEffect(() => {
    axios.get(`${api.baseUrl}/ipAddress`)
      .then((r) => {
        setIp(r.data);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${api.baseUrl}/transport/create`, {
        ...formData,
        ipaddress: ip,
        status: 1,
        isdelete: 0,
        createdby: user.name,
        modifiedby: user.name,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Access-Control-Allow-Origin': '*'
        }
      });

      // Success toast notification
      toast.success("Transportation created successfully!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (e) {
      toast.error("Failed to create Transportation.", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
    // selectedDestinations.map(option => option.label).join(', ');
  };

  useEffect(() => {
    if (selectedTransportData) {
      setFormData({
        transportmode: selectedTransportData.transportmode,
        transportsupplier: selectedTransportData.transportsupplier,
        priceperday: selectedTransportData.priceperday,
        status: selectedTransportData.status,
      });
    } else {
      setFormData({
        transportmode: "",
        transportsupplier: "",
        priceperday: 0,
        status: false,
      })
    }
  }, [selectedTransportData]);

  return (
    <div className={`fixed top-0 right-0 h-full bg-gray-200 shadow-lg transform transition-transform duration-500 ${isOpen ? "translate-x-0" : "translate-x-[850px]"} mt-4 sm:mt-8 md:mt-12 lg:w-[800px] sm:w-[400px] md:w-[500px] z-50`}>
      <button onClick={() => onClose(true)} className="absolute top-[12px] left-[-22px] font-semibold text-white text-sm bg-red-700 square px-3  py-1.5 border border-1 border-transparent hover:border-red-700 hover:bg-white hover:text-red-700">X</button>
      <div className="flex justify-between items-center p-4 pl-8 bg-white shadow-md">
        <h2 className="text-lg font-bold text-black">New Transportation Mode</h2>
      </div>
      <div className="border-b border-gray-300 shadow-sm"></div>

      <form className="p-4 overflow-y-auto h-[calc(100vh-160px)]" onSubmit={handleSubmit}>
        <div className="mb-6">
          <h3 className="bg-red-700 text-white p-2 rounded">Basic Transportation Details</h3>
        </div>
        <div className="mb-4">
          <label htmlFor="vendors" className="block text-sm font-medium">Transport Mode</label>
          <input
            type="text"
            id="transportmode"
            name="transportmode"
            value={formData.transportmode}
            onChange={handleInputChange}
            className="mt-1 p-2 w-full border rounded"
            placeholder="Enter Transport Mode"
          />
        </div>
        <div className="flex justify-between mb-4">
          <div className="w-1/2 mr-2">
            <label htmlFor="destinations" className="block text-sm font-medium">Transport Supplier</label>
            <input
              type="text"
              id="transportsupplier"
              name="transportsupplier"
              value={formData.transportsupplier}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border rounded"
              placeholder="Enter Transport Supplier"
            />
          </div>
          <div className="w-1/2 mr-2">
            <label htmlFor="destinations" className="block text-sm font-medium">Price per day</label>
            <input
              type="number"
              id="priceperday"
              name="priceperday"
              value={formData.priceperday}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border rounded"
              placeholder="Enter Price per day"
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

export default NewTransportationForm;
