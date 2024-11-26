import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import api from "../apiConfig/config";
import Select from 'react-select'
import { toast } from "react-toastify";

const State = ({ isOpen, onClose, stateData, isFormEditEnabled, setIsFormEditEnabled }) => {
  const [countryDetails, setCountryDetails] = useState([])
  const [selectedOption, setSelectedOption] = useState(null);
  const [countryId, setCountryId] = useState(null)

  console.log(stateData);

  const fileInputRef = useRef(null);

  const [user, setUser] = useState({})
  const [token, setTokens] = useState(null)
  async function decryptToken(encryptedToken, key, iv) {
    const dec = new TextDecoder();

    const decrypted = await crypto.subtle.decrypt({
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

  useEffect(() => {
    if (stateData) {
      setFormData({
        stateName: stateData.stateName || "",
        code: stateData.code || "",
        ipAddress: stateData.ipAddress || "",
        status: stateData.status || true,
        image: null,
        created_by: stateData.created_by || "",
        modified_by: stateData.modified_by || "",
      });
      setSelectedOption({
        value: stateData.country.id,
        label: stateData.country.countryName,
      });
      setCountryId(stateData.country.id);
    }
  }, [stateData]);

  const handleChange = (selectedOption) => {
    setSelectedOption(selectedOption);
    setCountryId(selectedOption.value)
  };

  const handleReset = () => {
    setFormData({
      stateName: "", code: "", image: null
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";  // Clear the file input
    }
    setSelectedOption(null)
  }

  const handleFileChange = (event) => {
    setFormData({
      ...formData,
      image: event.target.files[0],
    });
  };


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

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const [formData, setFormData] = useState({
    stateName: "", code: "", ipAddress: "", status: true,
    image: null, created_by: "", modified_by: ""
  });

  useEffect(() => {
    axios.get(`${api.baseUrl}/country/get`
    )
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create FormData to send to API
    const formDataToSend = new FormData();
    formDataToSend.append('stateName', formData.stateName);
    formDataToSend.append('code', formData.code);
    formDataToSend.append('status', formData.status);
    formDataToSend.append('ipAddress', formData.ipAddress);
    formDataToSend.append('country.id', countryId);
    formDataToSend.append('image', formData.image); // Attach image file
    formDataToSend.append('created_by', user.username);
    formDataToSend.append('modified_by', user.username);
    formDataToSend.append('isdelete', false);

    // If state name or code is empty, show error
    if (formData.stateName.length === 0 || formData.code.length === 0) {
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

    if (isFormEditEnabled && stateData && stateData.id) {
      await axios.put(`${api.baseUrl}/state/updatebyid/${stateData.id}`, formDataToSend, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          toast.success("State updated successfully.", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          // Reset the form
          handleReset();
        })
        .catch(error => {
          toast.error("Error updating state...");
          console.error('Error updating state:', error)
        });

    } else {
      // Create state API call
      await axios.post(`${api.baseUrl}/state/create`, formDataToSend, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          toast.success("State saved successfully.", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          // Reset the form
          handleReset();
        })
        .catch(error => console.error('Error creating state:', error));
    }
  };


  return (
    <div
      className={`fixed top-0 right-0 h-full bg-gray-200 shadow-lg z-50 transform transition-transform duration-500 ${isOpen ? "translate-x-0" : "translate-x-[750px]"
        } mt-4 sm:mt-8 md:mt-12 w-full sm:w-[400px] md:w-[700px]`}
    >
      {/* "X" button positioned outside the form box */}
      <button
        onClick={
          () => {
            onClose(true);
            setIsFormEditEnabled(false);
          }
        }
        className="absolute top-[12px] left-[-22px] font-semibold text-white text-sm bg-red-700 square px-3  py-1.5 border border-1 border-transparent hover:border-red-700 hover:bg-white hover:text-red-700"
      >
        X
      </button>
      <div className="flex justify-between items-center p-4 pl-8 bg-white shadow-md">
        <h2 className="text-lg font-bold text-black">New State</h2>
      </div>
      {/* Line below the title with shadow */}
      <div className="border-b border-gray-300 shadow-sm"></div>

      <form className="p-4">
        <div className="mb-4">
          <h3 className="bg-red-700 text-white p-2 rounded">
            Basic Information
          </h3>
        </div>
        <div className=" mb-4">

          <label htmlFor="status" className="block text-sm font-medium">
            Country
          </label>
          <Select
            className="mt-1 w-full border rounded"
            // styles={customStyles}
            value={selectedOption}
            onChange={handleChange}
            options={countryDetails} />
        </div>

        {/* <select id="status" className="mt-1 p-2 w-full border rounded">
          <option>India</option>
          <option>China</option>
          <option>China</option>
          <option>China</option>
          <option>China</option>
          <option>China</option>
          <option>China</option>
        </select> */}
        <div className="flex gap-4 mb-4">
          <div className="w-1/2">
            <label htmlFor="countryName" className="block text-sm font-medium">
              State Name
            </label>
            <input
              type="text"
              id="countryName"
              className="mt-1 p-2 w-full border rounded"
              placeholder="eg., Haryana, Rajasthan..."
              name="stateName"
              value={formData.stateName}
              onChange={handleInputChange}
            />
          </div>

          <div className="w-1/2">
            <label htmlFor="code" className="block text-sm font-medium">
              State Code
            </label>
            <input
              type="text"
              id="code"
              className="mt-1 p-2 w-full border rounded"
              placeholder="eg., UP, MP...."
              name="code"
              value={formData.code}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          <div className="w-1/2">
            <label htmlFor="status" className="block text-sm font-medium">
              Status
            </label>
            <select id="status" className="mt-1 p-2 w-full border rounded" name="status" value={formData.status} onChange={handleInputChange}>
              <option value={true}>Active</option>
              <option value={false}>Inactive</option>
            </select>
          </div>

          <div className="w-1/2">
            <label htmlFor="image" className="block text-sm font-medium">
              Image
            </label>
            <input
              type="file"
              className="w-full text-gray-700 mt-1 p-[4.5px] bg-white rounded border border-gray-200"
              name="image"
              ref={fileInputRef}
              multiple
              onChange={handleFileChange}
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


export default State;
