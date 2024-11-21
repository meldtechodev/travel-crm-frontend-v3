import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import api from "../apiConfig/config";
import { toast } from "react-toastify";

const Department = ({ isOpen, onClose, departmentData }) => {

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


  //   {
  //     "departmentName": "Sales",
  //     "createdBy": "Nilesh",
  //     "modifiedBy": "Nilesh",
  //     "ipaddress": "14.11.223.21",
  //     "status": 1,
  //     "isdelete": 0

  // }



  const [formData, setFormData] = useState({
    departmentName: "", status: true
  });

  const handleReset = () => {
    setFormData({
      departmentName: "", status: true
    })
  }

  const current = new Date()

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    })
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.departmentName === '') {
      toast.error("Please fill the fields...", {
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

    if (departmentData && departmentData.id) {
      const payload = {
        departmentName: formData.departmentName,
        createdBy: formData.createdBy,
        modifiedBy: user.username,
        ipaddress: ipaddress,
        status: formData.status ? 1 : 0,
        isdelete: 0,
        createdDate: departmentData.createdDate,
        modifiedDate: current.getDate
      }

      await axios.put(`${api.baseUrl}/departments/updatebyid/${departmentData.id}`, payload, {
        headers: {
          // 'Authorization': `Bearer ${token}`,
          'Accept': 'Application/json',
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then(response => {
          toast.success("Department updated successfully.", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setFormData({
            departmentName: "", status: true
          })
        })
        .catch(error => {
          toast.error("Error updating country...");
          console.log(error)
        });
    } else {

      const payload = {
        "departmentName": formData.departmentName,
        "createdBy": user.username,
        "modifiedBy": user.username,
        "ipaddress": ipaddress,
        "status": formData.status ? 1 : 0,
        "isdelete": 0
      }

      // console.log(payload)
      await axios.post(`${api.baseUrl}/departments/create`, payload
        , {
          headers: {
            // 'Authorization': `Bearer ${token}`,
            'Accept': 'Application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      )
        .then(response => {
          toast.success("Department saved successfully.", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setFormData({
            departmentName: "", status: true
          })
        })
        .catch(error => console.log(error));
    }
  };

  useEffect(() => {
    if (departmentData && departmentData.id) {
      setFormData({
        ...departmentData,
        departmentName: departmentData.departmentName || "",
        status: departmentData.status || true,
        createdBy: departmentData.createdBy || "",
        modifiedBy: departmentData.modifiedBy || "",
      });
    }
  }, [departmentData]);

  const [ipaddress, setIpAddress] = useState("")
  useEffect(() => {
    axios.get(`${api.baseUrl}/ipAddress`)
      .then((response) => {
        setIpAddress(response.data)
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);


  return (
    <div
      className={`fixed top-0 right-0 h-full bg-gray-200 shadow-lg transform transition-transform duration-500 z-50 ${isOpen ? "translate-x-0" : "translate-x-[750px]"
        } mt-4 sm:mt-8 md:mt-12 w-full sm:w-[calc(100%-120px)] md:w-[700px]`}
    >
      {/* "X" button positioned outside the form box */}
      <button
        onClick={() => onClose(true)}
        className="absolute top-[12px] left-[-22px] font-semibold text-white text-sm bg-red-700 square px-3  py-1.5 border border-1 border-transparent hover:border-red-700 hover:bg-white hover:text-red-700"
      >
        X
      </button>
      <div className="flex justify-between items-center p-4 pl-8 bg-white shadow-md">
        <h2 className="text-lg font-bold text-black">New Department</h2>
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
          <div className="w-full">
            <label htmlFor="countryName" className="block text-sm font-medium">
              Department Name
            </label>
            <input
              type="text"
              // id="countryName"
              className="mt-1 p-2 w-full border rounded"
              placeholder="Enter Department Name..."
              name="departmentName"
              value={formData.departmentName}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <div className="w-full mb-4">
            <label htmlFor="status" className="block text-sm font-medium">
              Status
            </label>
            <select id="status" className="mt-1 p-2 w-full border rounded" name="status" value={formData.status} onChange={handleInputChange}>
              <option value={true}>Active</option>
              <option value={false}>Inactive</option>
            </select>
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

export default Department;