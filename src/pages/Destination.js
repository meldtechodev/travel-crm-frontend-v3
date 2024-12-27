import React, { useContext, useEffect, useRef, useState } from "react";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import api from "../apiConfig/config";
import Select from 'react-select'
import axios from "axios";
import { toast } from "react-toastify";
import { UserContext } from "../contexts/userContext";
import useDecryptedToken from "../hooks/useDecryptedToken";

const Destination = ({ isOpen, onClose, destinationData, isFormEditEnabled, setIsFormEditEnabled }) => {
  // const [countryDetails, setCountryDetails] = useState([])
  const [inputKeyValue, setInputKeyValue] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [stateSelected, setStateSlected] = useState(null);
  const [countryId, setCountryId] = useState(null)
  const [stateId, setStateId] = useState()
  const [tags, setTags] = useState([]);
  const [newImage, setNewImage] = useState('')
  const fileInputRef = useRef(null);

  const { user, ipAddress, countryDetails, stateDetails } = useContext(UserContext);
  const token = useDecryptedToken();

  const [formData, setFormData] = useState({
    destinationName: "",
    ipAddress: "",
    status: true
  });

  const [stateData, setStateData] = useState([])
  const handleChange = (selectedOption) => {
    setSelectedOption(selectedOption);
    setCountryId(selectedOption.value)
    setStateSlected(null);
    setStateId(null)
    setStateData([])
    let data = stateDetails.filter(item => item.country.id === selectedOption.value)
    setStateData(data)
  };

  const handleStateChange = (stateSelected) => {
    setStateSlected(stateSelected);
    setStateId(stateSelected.value)
  }

  const handleInputKeyChange = (e) => {
    setInputKeyValue(e.target.value);
  };

  // Handle input on key down (Enter or Comma)
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (inputKeyValue.trim()) {
        const newTags = inputKeyValue.split(',').map((tag) => tag.trim()).filter(tag => tag !== '');
        setTags([...tags, ...newTags]);
        setInputKeyValue('');
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle image change
  const handleImageChange = (e) => {
    setNewImage(e.target.files[0])
  };

  // Handle removing a tag
  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  useEffect(() => {


  }, []);

  useEffect(() => {
    if (destinationData) {
      setFormData({
        destinationName: destinationData.destinationName || "",
        ipAddress: destinationData.ipAddress || "",
        status: destinationData.status || true,
      });
      setCountryId(destinationData.country.id || null);
      setStateId(destinationData.state.id || null);
      setTags(destinationData.keyofattractions ? destinationData.keyofattractions.split(", ") : []);
      setSelectedOption({ value: destinationData.country.id, label: destinationData.countryName });
      setStateSlected({ value: destinationData.stateId, label: destinationData.stateName });
    } else {
      setFormData({
        destinationName: "",
        ipAddress: "",
        status: true,
      });
      setCountryId(null);
      setStateId(null);
      setTags([]);
      setSelectedOption(null);
      setStateSlected(null);
    }
  }, [destinationData]);


  const handleReset = () => {
    setFormData({
      ...formData,
      destinationName: "",
      status: true,
      image: null,
    });
    setTags([]);
    setSelectedOption(null);
    setStateSlected(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";  // Clear the file input
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const tagsString = tags.join(', ');

    const formDataToSend = new FormData();
    formDataToSend.append("destinationName", formData.destinationName);
    formDataToSend.append("ipaddress", ipAddress);
    formDataToSend.append("status", formData.status);
    formDataToSend.append("country.id", countryId);
    formDataToSend.append("state.id", stateId);
    formDataToSend.append("keyofattractions", tagsString);
    formDataToSend.append("image", newImage);
    formDataToSend.append('created_by', user.name);
    formDataToSend.append('modified_by', user.name);
    formDataToSend.append('isdelete', false);

    if (formData.destinationName.length === 0) {
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

    if (isFormEditEnabled && destinationData) {
      // Edit Mode: Update request
      await axios.put(`${api.baseUrl}/destination/updatebyid/${destinationData.id}`, formDataToSend, {
        headers: {
          // 'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
          'Access-Control-Allow-Origin': '*',
        },
      })
        .then(async (response) => {
          toast.success('Destination updated successfully.', {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          handleReset();
          onClose();
        })
        .catch(error => {
          toast.error('Error updating destination.');
          console.error(error)
        });
    } else {
      // Create Mode: Create request
      await axios.post(`${api.baseUrl}/destination/create`, formDataToSend, {
        headers: {
          // 'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
          'Access-Control-Allow-Origin': '*',
        },
      })
        .then(async (response) => {
          toast.success('Destination added successfully.', {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          handleReset();
          onClose()
        })
        .catch(error => console.error(error));
    }
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full bg-gray-200 shadow-lg z-50 transform transition-transform duration-500 ${isOpen ? "translate-x-0" : "translate-x-[850px]"
        } mt-4 sm:mt-8 md:mt-12 lg:w-[800px] sm:w-[400px] md:w-[500px]`}
    >
      {/* "X" button positioned outside the form box */}
      <button
        onClick={onClose}
        className="absolute top-[12px] left-[-22px] font-semibold text-white text-sm bg-red-700 square px-3  py-1.5 border border-1 border-transparent hover:border-red-700 hover:bg-white hover:text-red-700"
      >
        X
      </button>
      <div className="flex justify-between items-center p-4 pl-8 bg-white shadow-md">
        <h2 className="text-lg font-bold text-black">New City</h2>
      </div>
      {/* Line below the title with shadow */}
      <div className="border-b border-gray-300 shadow-sm"></div>

      <form className="p-4 overflow-y-auto h-[calc(100vh-160px)]">
        <div className="mb-6">
          <h3 className="bg-red-700 text-white p-2 rounded">
            Basic Information
          </h3>
        </div>
        <div className="flex gap-2">
          <div className="w-1/2 mb-4">
            <label htmlFor="country" className="block text-sm font-medium">
              Country
            </label>
            <Select
              className="mt-1 w-full border rounded"
              // styles={customStyles}
              value={selectedOption}
              onChange={handleChange}
              options={countryDetails} />
          </div>
          <div className="w-1/2  mb-4">
            <label htmlFor="state" className="block text-sm font-medium">
              State Name
            </label>
            <Select
              className="mt-1 w-full border rounded"
              value={stateSelected}
              onChange={handleStateChange}
              options={stateData} />
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="destination" className="block text-sm font-medium">
            City Name
          </label>
          <input
            type="text"
            id="countryName"
            name="destinationName"
            value={formData.destinationName}
            onChange={handleInputChange}
            className="mt-1 p-2 w-full border rounded"
            placeholder="Enter Destination Name"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="key_attraction" className="block text-sm font-medium">
            Keys Attractions
          </label>

          <input
            className="mt-1 p-2 w-full border rounded"
            type="text"
            value={inputKeyValue}
            onChange={handleInputKeyChange}
            onKeyDown={handleKeyDown}
            placeholder="Add keys of attractions..."
          />

          {tags.map((tag, index) => (
            <div key={index} style={{
              display: "inline-block",
              padding: "2px",
              margin: "5px",
              backgroundColor: "#007bff",
              color: "#fff",
              borderRadius: "3px",
            }}>
              {tag}
              <button
                onClick={() => handleRemoveTag(tag)}
                style={{
                  marginLeft: "10px",
                  cursor: "pointer",
                  background: "transparent",
                  border: "none",
                  padding: "0"
                }}              >
                &times;
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <div className="w-1/2 mb-4">
            <label htmlFor="status" className="block text-sm font-medium">
              Status
            </label>
            <select id="status" className="mt-1 p-2 w-full border rounded" name="status" value={formData.status} onChange={handleInputChange}>
              <option value={true}>Active</option>
              <option value={false}>Inactive</option>
            </select>
          </div>

          <div className="w-1/2 mb-4">
            <label htmlFor="image" className="block text-sm font-medium">
              Image
            </label>
            <input
              type="file"
              className="w-full text-gray-700 mt-1 p-[4.5px] bg-white rounded border border-gray-200"
              name="image"
              ref={fileInputRef}
              onChange={handleImageChange}
            />
          </div>
        </div>
      </form>

      {/* Line with shadow above the buttons */}
      <div className="flex justify-between items-center p-3 bg-white shadow-lg rounded w-full fixed bottom-12 left-0 right-0">
        <div className="flex justify-start space-x-4">
          <button
            type="button"
            className="bg-red-700 text-white px-4 py-2 rounded shadow"
            onClick={handleSubmit}
          >
            Submit
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="bg-red-700 text-white px-4 py-2 rounded shadow"
          >
            Reset
          </button>
        </div>
      </div>
    </div>

  );
};


export default Destination;