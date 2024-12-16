import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import api from "../apiConfig/config";
import { toast } from "react-toastify";
import { UserContext } from "../contexts/userContext";
import useDecryptedToken from "../hooks/useDecryptedToken";

const Customer = ({ isOpen, onClose, customerData, isFormEditEnabled, setIsFormEditEnabled }) => {
  const fileInputRef = useRef(null);

  const { user } = useContext(UserContext);
  const token = useDecryptedToken();

  // console.log(token);

  const [formData, setFormData] = useState({
    salutation: "",
    fName: "",
    lName: "",
    emailId: "",
    contactNo: "",
    marritalStatus: "",
    customerType: "",
    leadSource: "",
    adharNo: "",
    passportId: "",
    createdby: user.name,
    modifiedby: user.name,
    ipaddress: "",
    status: 1,
    isdelete: 0,
    user: { userId: user.userId },
  });

  const handleReset = () => {
    setFormData({
      salutation: "",
      fName: "",
      lName: "",
      emailId: "",
      contactNo: "",
      marritalStatus: "",
      customerType: "",
      leadSource: "",
      adharNo: "",
      passportId: "",
      createdby: user.name,
      modifiedby: user.name,
      ipaddress: "",
      status: 1,
      isdelete: 0,
      user: { userId: user.userId },
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";  // Clear the file input
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (event) => {
    setFormData({
      ...formData,
      image: event.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.salutation ||
      !formData.fName ||
      !formData.lName ||
      !formData.emailId ||
      !formData.contactNo ||
      !formData.marritalStatus ||
      !formData.customerType ||
      !formData.leadSource ||
      !formData.adharNo ||
      !formData.passportId
    ) {
      toast.error("Please fill all the fields...", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    if (customerData && customerData.id) {
      await axios.put(`${api.baseUrl}/customer/updatebyid/${customerData.id}`, formData, {
        headers: {
          // 'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then(response => {
          toast.success("Customer updated successfully.", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        })
        .catch(error => {
          toast.error("Error updating customer...");
          console.log(error);
        });
    } else {
      // Create new customer
      await axios.post(`${api.baseUrl}/customer/create`, formData, {
        headers: {
          // 'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then(response => {
          console.log(response);
          toast.success("Customer saved successfully.", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setFormData({
            salutation: "",
            fName: "",
            lName: "",
            emailId: "",
            contactNo: "",
            marritalStatus: "",
            customerType: "",
            leadSource: "",
            adharNo: "",
            passportId: "",
            createdby: user.name,
            modifiedby: user.name,
            ipaddress: "",
            status: 1,
            isdelete: 0,
            user: { userId: user.userId },
          });
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        })
        .catch(error => {
          console.error(error);
          toast.error(error.response.data, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        });
    }
  };

  useEffect(() => {
    if (customerData && customerData.id) {
      setFormData(customerData);
    }
  }, [customerData]);

  useEffect(() => {
    axios.get(`${api.baseUrl}/ipAddress`)
      .then((response) => {
        setFormData({
          ...formData, ipaddress: response.data
        });
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div
      className={`fixed top-0 right-0 h-full bg-gray-200 shadow-lg transform transition-transform duration-500 z-50 ${isOpen ? "translate-x-0" : "translate-x-[850px]"} mt-4 sm:mt-8 md:mt-12 w-full sm:w-[calc(100%-120px)] md:w-[800px]`}
    >
      <button
        onClick={() => onClose(true)}
        className="absolute top-[12px] left-[-22px] font-semibold text-white text-sm bg-red-700 square px-3 py-1.5 border border-1 border-transparent hover:border-red-700 hover:bg-white hover:text-red-700"
      >
        X
      </button>
      <div className="flex justify-between items-center p-4 pl-8 bg-white shadow-md">
        <h2 className="text-lg font-bold text-black">New Customer</h2>
      </div>
      <div className="border-b border-gray-300 shadow-sm"></div>

      <form className="p-4 overflow-y-visible mb-12">
        {/* Basic Information */}
        <div className="mb-6">
          <h3 className="bg-red-700 text-white p-2 rounded">
            Basic Information
          </h3>
        </div>

        {/* Salutation and Customer Type */}
        <div className="flex gap-2 mb-4">
          <div className="w-1/2">
            <label htmlFor="salutation" className="block text-sm font-medium">
              Salutation
            </label>
            <select
              id="salutation"
              className="mt-1 p-2 w-full border rounded"
              name="salutation"
              value={formData.salutation}
              onChange={handleInputChange}
            >
              <option value="">Select Salutation</option>
              <option value="Mr">Mr</option>
              <option value="Mrs">Mrs</option>
              <option value="Ms">Ms</option>
            </select>
          </div>

          <div className="w-1/2">
            <label htmlFor="customerType" className="block text-sm font-medium">
              Customer Type
            </label>
            <select
              id="customerType"
              className="mt-1 p-2 w-full border rounded"
              name="customerType"
              value={formData.customerType}
              onChange={handleInputChange}
            >
              <option value="">Select Customer Type</option>
              <option value="B2B">B2B</option>
              <option value="B2C">B2C</option>
            </select>
          </div>
        </div>

        {/* Name and Contact Information */}
        <div className="flex gap-2 mb-4">
          <div className="w-1/3">
            <label htmlFor="fName" className="block text-sm font-medium">
              First Name
            </label>
            <input
              type="text"
              id="fName"
              className="mt-1 p-2 w-full border rounded"
              placeholder="First Name"
              name="fName"
              value={formData.fName}
              onChange={handleInputChange}
            />
          </div>

          <div className="w-1/3">
            <label htmlFor="lName" className="block text-sm font-medium">
              Last Name
            </label>
            <input
              type="text"
              id="lName"
              className="mt-1 p-2 w-full border rounded"
              placeholder="Last Name"
              name="lName"
              value={formData.lName}
              onChange={handleInputChange}
            />
          </div>

          <div className="w-1/3">
            <label htmlFor="contactNo" className="block text-sm font-medium">
              Phone Number
            </label>
            <input
              type="text"
              id="contactNo"
              className="mt-1 p-2 w-full border rounded"
              placeholder="912...."
              name="contactNo"
              value={formData.contactNo}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Email and Marital Status */}
        <div className="flex gap-2 mb-4">
          <div className="w-1/2">
            <label htmlFor="emailId" className="block text-sm font-medium">
              Email ID
            </label>
            <input
              type="email"
              id="emailId"
              className="mt-1 p-2 w-full border rounded"
              placeholder="example@example.com"
              name="emailId"
              value={formData.emailId}
              onChange={handleInputChange}
            />
          </div>

          <div className="w-1/2">
            <label htmlFor="marritalStatus" className="block text-sm font-medium">
              Marital Status
            </label>
            <select
              id="marritalStatus"
              className="mt-1 p-2 w-full border rounded"
              name="marritalStatus"
              value={formData.marritalStatus}
              onChange={handleInputChange}
            >
              <option value="">Select Marital Status</option>
              <option value="Married">Married</option>
              <option value="Single">Single</option>
              <option value="Divorced">Divorced</option>
            </select>
          </div>
        </div>

        {/* Lead Source and IDs */}
        <div className="flex gap-2 mb-4">
          <div className="w-1/2">
            <label htmlFor="leadSource" className="block text-sm font-medium">
              Lead Source
            </label>
            <input
              type="text"
              id="leadSource"
              className="mt-1 p-2 w-full border rounded"
              placeholder="Lead Source"
              name="leadSource"
              value={formData.leadSource}
              onChange={handleInputChange}
            />
          </div>

          <div className="w-1/2">
            <label htmlFor="adharNo" className="block text-sm font-medium">
              Aadhar Number
            </label>
            <input
              type="text"
              id="adharNo"
              className="mt-1 p-2 w-full border rounded"
              placeholder="Aadhar Number"
              name="adharNo"
              value={formData.adharNo}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Passport ID */}
        <div className="flex gap-2 mb-4">
          <div className="w-1/2">
            <label htmlFor="passportId" className="block text-sm font-medium">
              Passport ID
            </label>
            <input
              type="text"
              id="passportId"
              className="mt-1 p-2 w-full border rounded"
              placeholder="Passport ID"
              name="passportId"
              value={formData.passportId}
              onChange={handleInputChange}
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
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default Customer;
