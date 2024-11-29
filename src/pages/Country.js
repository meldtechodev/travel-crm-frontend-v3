import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import api from "../apiConfig/config";
import { toast } from "react-toastify";

const Country = ({ isOpen, onClose, countryData, isFormEditEnabled, setIsFormEditEnabled }) => {
  const fileInputRef = useRef(null);

  // console.log(countryData);

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

        return axios.get(`${api.baseUrl}/username`, {
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
    countryName: "", code: "", pCode: "", ipAddress: "", status: true,
    image: null,
  });

  const handleReset = () => {
    setFormData({
      countryName: "", code: "", pCode: "",
      image: null,
    })
    if (fileInputRef.current) {
      fileInputRef.current.value = "";  // Clear the file input
    }
  }

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

    const formDatasend = new FormData();
    formDatasend.append('countryName', formData.countryName);
    formDatasend.append('code', formData.code);
    formDatasend.append('pCode', formData.pCode);
    formDatasend.append('ipAddress', formData.ipAddress);
    formDatasend.append('status', formData.status);
    formDatasend.append('image', formData.image);
    formDatasend.append('createdby', user.username);
    formDatasend.append('modifiedby', user.username);
    formDatasend.append('isdelete', false);

    if (formData.countryName === '' || formData.code === '' || formData.pCode === '' || formData.image === null) {
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

    if (countryData && countryData.id) {
      await axios.put(`${api.baseUrl}/country/updatebyid/${countryData.id}`, formDatasend, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then(response => {
          toast.success("Country updated successfully.", {
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
            countryName: "", code: "", pCode: "", image: null, status: true
          });
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        })
        .catch(error => {
          toast.error("Error updating country...");
          console.log(error)
        });
    } else {
      // Create new country
      await axios.post(`${api.baseUrl}/country/create`, formDatasend, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then(response => {
          toast.success("Country saved successfully.", {
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
            countryName: "", code: "", pCode: "", image: null, status: true
          });
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        })
        .catch(error => console.log(error));
    }
  };

  useEffect(() => {

    if (countryData && countryData.id) {
      setFormData({
        countryName: countryData.countryName || "",
        code: countryData.code || "",
        pCode: countryData.pCode || "",
        ipAddress: countryData.ipAddress || "",
        status: countryData.status || true,
        image: null,
        createdBy: countryData.createdBy || "",
        modifiedBy: countryData.modifiedBy || "",
      });
    }
  }, [countryData]);

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


  return (
    <div
      className={`fixed top-0 right-0 h-full bg-gray-200 shadow-lg transform transition-transform duration-500 z-50 ${isOpen ? "translate-x-0" : "translate-x-[850px]"
        } mt-4 sm:mt-8 md:mt-12 w-full sm:w-[calc(100%-120px)] md:w-[800px]`}
    >
      {/* "X" button positioned outside the form box */}
      <button
        onClick={() => onClose(true)}
        className="absolute top-[12px] left-[-22px] font-semibold text-white text-sm bg-red-700 square px-3  py-1.5 border border-1 border-transparent hover:border-red-700 hover:bg-white hover:text-red-700"
      >
        X
      </button>
      <div className="flex justify-between items-center p-4 pl-8 bg-white shadow-md">
        <h2 className="text-lg font-bold text-black">New Country</h2>
      </div>
      {/* Line below the title with shadow */}
      <div className="border-b border-gray-300 shadow-sm"></div>

      <form className="p-4">
        <div className="mb-6">
          <h3 className="bg-red-700 text-white p-2 rounded">
            Basic Information
          </h3>
        </div>

        <div className="flex gap-2 mb-4">
          <div className="w-1/2">
            <label htmlFor="countryName" className="block text-sm font-medium">
              Country Name
            </label>
            <input
              type="text"
              id="countryName"
              className="mt-1 p-2 w-full border rounded"
              placeholder="eg., India, Russia..."
              name="countryName"
              value={formData.countryName}
              onChange={handleInputChange}
            />
          </div>

          <div className="w-1/4">
            <label htmlFor="code" className="block text-sm font-medium">
              Country Code
            </label>
            <input
              type="text"
              id="code"
              className="mt-1 p-2 w-full border rounded"
              placeholder="eg., IND, AUS, or USA"
              name="code"
              value={formData.code}
              onChange={handleInputChange}
            />
          </div>
          <div className="w-1/4">
            <label htmlFor="countryName" className="block text-sm font-medium">
              Country Ph Code
            </label>
            <input
              type="text"
              id="countryName"
              className="mt-1 p-2 w-full border rounded"
              placeholder="eg., +91, +1..."
              name="pCode"
              value={formData.pCode}
              onChange={handleInputChange
                // (e) => setCode(e.target.value)
              }
            />
          </div>
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
              ref={fileInputRef}
              className="w-full text-gray-700 mt-1 p-[4.5px] bg-white rounded border border-gray-200"
              name="image"
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

export default Country;