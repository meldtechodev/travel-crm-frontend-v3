import React, { useEffect, useRef, useState } from "react";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import api from "../apiConfig/config";
import Select from 'react-select'
import axios from "axios";
import { toast } from "react-toastify";

const Destination = ({ isOpen, onClose, destinationData, isFormEditEnabled, setIsFormEditEnabled }) => {
  const [countryDetails, setCountryDetails] = useState([])
  const [stateDetails, setStateDetails] = useState([])
  const [inputKeyValue, setInputKeyValue] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [stateSelected, setStateSlected] = useState(null);
  const [countryId, setCountryId] = useState(null)
  const [stateId, setStateId] = useState()
  const [tags, setTags] = useState([]);
  const [newImage, setNewImage] = useState('')
  const fileInputRef = useRef(null);

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

  const [formData, setFormData] = useState({
    destinationName: "",
    ipAddress: "",
    status: true
  });

  const handleChange = (selectedOption) => {
    setSelectedOption(selectedOption);
    setCountryId(selectedOption.value)
    setStateSlected(null);
    setStateId(null)

    axios.get(`${api.baseUrl}/state/getbycountryid/${selectedOption.value}`,
      {
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
      .then((response) => {
        const formattedOptions = response.data.map(item => ({
          value: item.id, // or any unique identifier
          label: item.stateName // or any display label you want
        }));
        setStateDetails(formattedOptions);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
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
    axios.get(`${api.baseUrl}/country/get`)
      .then(response => {
        const formattedOptions = response.data.map(item => ({
          value: item.id, // or any unique identifier
          label: item.countryName // or any display label you want
        }));
        setCountryDetails(formattedOptions);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    axios.get(`${api.baseUrl}/ipAddress`)
      .then((response) => {
        setFormData({
          ...formData, "ipAddress": response.data
        })
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    if (destinationData) {
      setFormData({
        destinationName: destinationData.destinationName || "",
        ipAddress: destinationData.ipAddress || "",
        status: destinationData.status || true,
      });
      setCountryId(destinationData.countryId || null);
      setStateId(destinationData.stateId || null);
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
    formDataToSend.append("ipaddress", formData.ipAddress);
    formDataToSend.append("status", formData.status);
    formDataToSend.append("country.id", countryId);
    formDataToSend.append("state.id", stateId);
    formDataToSend.append("keyofattractions", tagsString);
    formDataToSend.append("image", newImage);
    formDataToSend.append('created_by', user.username);
    formDataToSend.append('modified_by', user.username);
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
          'Authorization': `Bearer ${token}`,
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
        })
        .catch(error => {
          toast.error('Error updating destination.');
          console.error(error)
        });
    } else {
      // Create Mode: Create request
      await axios.post(`${api.baseUrl}/destination/create`, formDataToSend, {
        headers: {
          'Authorization': `Bearer ${token}`,
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
        <h2 className="text-lg font-bold text-black">New Destination</h2>
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
              options={stateDetails} />
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="destination" className="block text-sm font-medium">
            Destination Name
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