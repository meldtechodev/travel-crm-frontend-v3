import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import api from "../apiConfig/config";
import { toast } from "react-toastify";

const NewCompanyForm = ({ isOpen, onClose, companyData, isFormEditEnabled, setIsFormEditEnabled }) => {
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
    companyname: "",
    companyaddress: "",
    companyemail: "",
    companycountrycode: "",
    companyphone: "",
    companywebsite: "",
    companylogo: null,
    status: true,
    ipaddress: ""
  });

  // Token decryption functions remain the same as in the original code

  const handleReset = () => {
    setFormData({
      companyname: "",
      companyaddress: "",
      companyemail: "",
      companycountrycode: "",
      companyphone: "",
      companywebsite: "",
      companylogo: null,
      status: true,
      ipaddress: ""
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (event) => {
    setFormData(prevState => ({
      ...prevState,
      companylogo: event.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDatasend = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null && formData[key] !== undefined) {
        formDatasend.append(key, formData[key]);
      }
    });
    formDatasend.append('createdby', user.username);
    formDatasend.append('modifiedby', user.username);
    formDatasend.append('isdelete', false);

    // Validation
    const requiredFields = ['companyname', 'companyaddress', 'companyemail', 'companycountrycode'];
    const missingFields = requiredFields.filter(field => !formData[field]);

    if (missingFields.length > 0) {
      toast.error(`Please fill all required fields: ${missingFields.join(', ')}`, {
        position: "top-center",
        autoClose: 5000,
      });
      return;
    }

    try {
      if (companyData && companyData.id) {
        // Update existing company
        await axios.put(`${api.baseUrl}/company/updatebyid/${companyData.id}`, formDatasend, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
            'Access-Control-Allow-Origin': '*'
          }
        });
        toast.success("Company updated successfully.");
      } else {
        // Create new company
        await axios.post(`${api.baseUrl}/company/create`, formDatasend, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
            'Access-Control-Allow-Origin': '*'
          }
        });
        toast.success("Company saved successfully.");
      }

      handleReset();
    } catch (error) {
      toast.error("Error saving company.");
      console.error(error);
    }
  };

  // Fetch IP address and set in form data
  useEffect(() => {
    axios.get(`${api.baseUrl}/ipAddress`)
      .then((response) => {
        setFormData(prevState => ({
          ...prevState,
          ipaddress: response.data
        }));
      })
      .catch((error) => {
        console.error('Error fetching IP address:', error);
      });
  }, []);

  // Populate form data when editing existing company
  useEffect(() => {
    if (companyData && companyData.id) {
      setFormData({
        companyname: companyData.companyname || "",
        companyaddress: companyData.companyaddress || "",
        companyemail: companyData.companyemail || "",
        companycountrycode: companyData.companycountrycode || "",
        companyphone: companyData.companyphone || "",
        companywebsite: companyData.companywebsite || "",
        companylogo: null,
        status: companyData.status !== undefined ? companyData.status : true,
        ipaddress: companyData.ipaddress || ""
      });
    }
  }, [companyData]);

  // Render form remains largely the same, update input fields to match new formData keys
  return (
    <div className={`fixed top-0 right-0 h-full bg-gray-200 shadow-lg transform transition-transform duration-500 z-50 ${isOpen ? "translate-x-0" : "translate-x-[850px]"} mt-4 sm:mt-8 md:mt-12 w-full sm:w-[calc(100%-120px)] md:w-[800px]`}>
      <button
        onClick={() => onClose(true)}
        className="absolute top-[12px] left-[-22px] font-semibold text-white text-sm bg-red-700 square px-3 py-1.5 border border-1 border-transparent hover:border-red-700 hover:bg-white hover:text-red-700"
      >
        X
      </button>
      <div className="flex justify-between items-center p-4 pl-8 bg-white shadow-md">
        <h2 className="text-lg font-bold text-black">New Company</h2>
      </div>
      <div className="border-b border-gray-300 shadow-sm"></div>

      <form className="p-4">
        <div className="mb-6">
          <h3 className="bg-red-700 text-white p-2 rounded">
            Company Information
          </h3>
        </div>

        {/* Add input fields for all company details */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="companyname" className="block text-sm font-medium">
              Company Name
            </label>
            <input
              type="text"
              id="companyname"
              className="mt-1 p-2 w-full border rounded"
              placeholder="Enter company name"
              name="companyname"
              value={formData.companyname}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="companyemail" className="block text-sm font-medium">
              Company Email
            </label>
            <input
              type="email"
              id="companyemail"
              className="mt-1 p-2 w-full border rounded"
              placeholder="Enter company email"
              name="companyemail"
              value={formData.companyemail}
              onChange={handleInputChange}
            />
          </div>
          {/* Add similar input fields for other company details */}
          <div>
            <label htmlFor="companyaddress" className="block text-sm font-medium">
              Company Address
            </label>
            <input
              type="text"
              id="companyaddress"
              className="mt-1 p-2 w-full border rounded"
              placeholder="Enter company address"
              name="companyaddress"
              value={formData.companyaddress}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="companyphone" className="block text-sm font-medium">
              Company Phone
            </label>
            <input
              type="tel"
              id="companyphone"
              className="mt-1 p-2 w-full border rounded"
              placeholder="Enter company phone"
              name="companyphone"
              value={formData.companyphone}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="companycountrycode" className="block text-sm font-medium">
              Company Country Code
            </label>
            <input
              type="text"
              id="companycountrycode"
              className="mt-1 p-2 w-full border rounded"
              placeholder="Enter country code"
              name="companycountrycode"
              value={formData.companycountrycode}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="companywebsite" className="block text-sm font-medium">
              Company Website
            </label>
            <input
              type="text"
              id="companywebsite"
              className="mt-1 p-2 w-full border rounded"
              placeholder="Enter Company Website"
              name="companywebsite"
              value={formData.companywebsite}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium">
              Status
            </label>
            <select
              id="status"
              className="mt-1 p-2 w-full border rounded"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
            >
              <option value={true}>Active</option>
              <option value={false}>Inactive</option>
            </select>
          </div>
          <div>
            <label htmlFor="companylogo" className="block text-sm font-medium">
              Company Logo
            </label>
            <input
              type="file"
              ref={fileInputRef}
              className="w-full text-gray-700 mt-1 p-[4.5px] bg-white rounded border border-gray-200"
              name="companylogo"
              onChange={handleFileChange}
            />
          </div>
        </div>
      </form>

      <div className="flex justify-between items-center p-3 bg-white shadow-lg rounded w-full fixed bottom-12">
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

export default NewCompanyForm;