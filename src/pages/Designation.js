import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import api from "../apiConfig/config";
import { toast } from "react-toastify";
import { UserContext } from "../contexts/userContext";
import useDecryptedToken from "../hooks/useDecryptedToken";

const Designation = ({ isOpen, onClose, designationData }) => {
  // const [user, setUser] = useState({});
  // const [token, setTokens] = useState(null);
  const { user } = useContext(UserContext);
  const token = useDecryptedToken();
  const [ipaddress, setIpAddress] = useState("");
  const [departments, setDepartments] = useState(null);
  const [permission, setPermission] = useState([])
  const [module, setModule] = useState([])
  const [designations, setDesignation] = useState([])
  const [modulePermission, setModulePermission] = useState([])
  const [currentPage, setCurrentPage] = useState(1)

  const [formData, setFormData] = useState({
    departmentName: "",
    designationName: "",
    status: true,
    departmentId: "",
  });

  useEffect(() => {
    axios.get(`${api.baseUrl}/designations/getall`)
      .then(response => {
        const format = response.data.content.map((item) => ({
          ...item,
          value: item.id,
          label: item.designationName
        }))
        // console.log(format)
        setDesignation(format)
      })
      .catch(error => console.error(error))

    if (modulePermission.length === 0) {
      axios.get(`${api.baseUrl}/modules/getall`)
        .then(response => {
          const moduleFormat = response.data
          setModule(response.data)

          // console.log(moduleFormat)
          axios.get(`${api.baseUrl}/permissions/getall`)
            .then(res => {
              setPermission(res.data);
              moduleFormat.forEach(items => {
                const formatPerm = res.data.filter(item => item.modules.id === items.id)
                if (formatPerm.length !== 0) {
                  const formatP = formatPerm.map(item => ({ ...item, value: false }))
                  const perm = {
                    id: items.id,
                    module: items.moduleName,
                    permission: formatP
                  }
                  modulePermission.push(perm)
                }
              })
              // console.log(modulePermission)
            })
            .catch(error => console.error(error));
        })
        .catch(error => console.error(error));
    }
  }, [])

  const handleToggle = (moduleId, perm, action) => {

    const changeModule = modulePermission.filter(item => item.id === moduleId.id)
    const permissionChange = [...changeModule[0].permission]
    const updatedActions = permissionChange.map(item => item.id === perm.id ? { ...item, value: action } : item)
    const final = modulePermission.map(prev => prev.id === moduleId.id ? { ...prev, permission: updatedActions } : prev)
    setModulePermission(final)
  };

  const handleSelectAll = (module) => {

    let selectAll = false
    // const updatedActions = []
    const changeModule = modulePermission.filter(item => item.id === module.id)
    const permissionChange = [...changeModule[0].permission]
    for (let i = 0; i < permissionChange.length; i++) {
      if (!permissionChange[i].value) {
        selectAll = true
        break
      }
    }
    if (selectAll) {
      const updatedActions = permissionChange.map(item => ({ ...item, value: true }))
      const final = modulePermission.map(prev => prev.id === module.id ? { ...prev, permission: updatedActions } : prev)
      setModulePermission(final)
    } else {
      const updatedActions = permissionChange.map(item => ({ ...item, value: false }))
      const final = modulePermission.map(prev => prev.id === module.id ? { ...prev, permission: updatedActions } : prev)
      setModulePermission(final)
    }
  };

  const handleNext = () => {

    setCurrentPage(2);
  };

  const handlePrev = () => {
    setCurrentPage(1);
  };

  // async function decryptToken(encryptedToken, key, iv) {
  //   const dec = new TextDecoder();

  //   const decrypted = await crypto.subtle.decrypt(
  //     {
  //       name: "AES-GCM",
  //       iv: iv,
  //     },
  //     key,
  //     encryptedToken
  //   );

  //   return dec.decode(new Uint8Array(decrypted));
  // }

  // // Function to retrieve and decrypt the token
  // async function getDecryptedToken() {
  //   const keyData = JSON.parse(localStorage.getItem("encryptionKey"));
  //   const ivBase64 = localStorage.getItem("iv");
  //   const encryptedTokenBase64 = localStorage.getItem("encryptedToken");

  //   if (!keyData || !ivBase64 || !encryptedTokenBase64) {
  //     throw new Error("No token found");
  //   }

  //   // Convert back from base64
  //   const key = await crypto.subtle.importKey(
  //     "jwk",
  //     keyData,
  //     { name: "AES-GCM" },
  //     true,
  //     ["encrypt", "decrypt"]
  //   );
  //   const iv = new Uint8Array(
  //     atob(ivBase64)
  //       .split("")
  //       .map((char) => char.charCodeAt(0))
  //   );
  //   const encryptedToken = new Uint8Array(
  //     atob(encryptedTokenBase64)
  //       .split("")
  //       .map((char) => char.charCodeAt(0))
  //   );

  //   return await decryptToken(encryptedToken, key, iv);
  // }

  useEffect(() => {
    // getDecryptedToken()
    //   .then((token) => {
    //     setTokens(token);

    //     return axios.get(`${api.baseUrl}/username`, {
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //         "Access-Control-Allow-Origin": "*",
    //       },
    //     });
    //   })
    //   .then((response) => {
    //     setUser(response.data);
    //   })
    //   .catch((error) =>
    //     console.error("Error fetching protected resource:", error)
    //   );

    // Fetch departments
    axios.get(`${api.baseUrl}/departments/getall`)
      .then((response) => {
        setDepartments(response.data.content);
      })
      .catch((error) => {
        console.error("Error fetching departments:", error);
      });
  }, []);

  const handleReset = () => {
    setFormData({
      departmentName: "",
      designationName: "",
      status: true,
      departmentId: "",
    });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const current = new Date()

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.departmentId === "" || formData.designationName === "") {
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

    if (designationData && designationData.id) {
      const payload = {
        designationName: formData.designationName,
        departments: {
          id: formData.departmentId,
        },
        createdBy: formData.createdBy,
        modifiedBy: user.username,
        ipaddress: ipaddress,
        status: formData.status ? 1 : 0,
        isdelete: 0,
        createdDate: designationData.createdDate,
        modifiedDate: current.getDate
      }

      await axios.put(`${api.baseUrl}/designations/update/${designationData.id}`, payload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'Application/json',
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then(response => {
          toast.success("Designation updated successfully.", {
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
          toast.error("Error updating designation...");
          console.log(error)
        });
    } else {
      const payload = {
        designationName: formData.designationName,
        createdBy: user.username,
        modifiedBy: user.username,
        ipaddress: ipaddress,
        status: formData.status ? 1 : 0,
        isdelete: 0,
        departments: {
          id: formData.departmentId,
        },
      };

      await axios
        .post(`${api.baseUrl}/designations/create`, payload, {
          headers: {
            Accept: "Application/json",
            "Access-Control-Allow-Origin": "*",
          },
        })
        .then((response) => {
          toast.success("Designation saved successfully.", {
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
        .catch((error) => console.log(error));
    }

    setCurrentPage(2)
  };

  const handlePermission = () => {
    console.log(modulePermission)
  }

  useEffect(() => {
    axios
      .get(`${api.baseUrl}/ipAddress`)
      .then((response) => {
        setIpAddress(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    if (designationData && designationData.id) {
      setFormData({
        ...designationData,
        departmentName: designationData.departmentName || "",
        departmentId: designationData.departments.id || "",
        status: designationData.status || true,
        createdBy: designationData.createdBy || "",
        modifiedBy: designationData.modifiedBy || "",
      });
    }
  }, [designationData]);

  return (
    <div
      className={`fixed top-0 right-0 h-full bg-gray-200 shadow-lg z-50 transform transition-transform duration-500 ${isOpen ? "translate-x-0" : "translate-x-[950px]"
        } mt-4 sm:mt-8 md:mt-12 lg:w-[900px] sm:w-[400px] md:w-[700px]`}
    >
      {/* "X" button positioned outside the form box */}
      <button
        onClick={() => onClose(true)}
        className="absolute top-[12px] left-[-22px] font-semibold text-white text-sm bg-red-700 square px-3  py-1.5 border border-1 border-transparent hover:border-red-700 hover:bg-white hover:text-red-700"
      >
        X
      </button>
      <div className="flex justify-between items-center p-4 pl-8 bg-white shadow-md">
        <h2 className="text-lg font-bold text-black">New Designation</h2>
      </div>
      {/* Line below the title with shadow */}
      <div className="border-b border-gray-300 shadow-sm"></div>
      {currentPage === 1 ?
        <form className="p-4">
          <div className="mb-6">
            <h3 className="bg-red-700 text-white p-2 rounded">
              Basic Information
            </h3>
          </div>
          {/* Department Dropdown Field */}
          <div className="flex gap-2 mb-4">
            <div className="w-full">
              <label htmlFor="department" className="block text-sm font-medium">
                Department Name
              </label>
              <select
                id="department"
                className="mt-1 p-2 w-full border rounded"
                name="departmentId"
                value={formData.departmentId}
                onChange={handleInputChange}
              >
                <option value="" disabled>
                  Select Department
                </option>
                {departments !== null && departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.departmentName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-2 mb-4">
            <div className="w-full">
              <label htmlFor="designationName" className="block text-sm font-medium">
                Designation Name
              </label>
              <input
                type="text"
                className="mt-1 p-2 w-full border rounded"
                placeholder="Enter Designation Name..."
                name="designationName"
                value={formData.designationName}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <div className="w-full mb-4">
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
          </div>
        </form> : <></>}
      {currentPage === 2 ? <>
        <h3 className="bg-red-700 text-white p-2 rounded mb-4">
          Select all permissions
        </h3>


        <div className="w-full h-full mb-8 mr-4 p-4  overflow-y-scroll">
          {modulePermission.map(items => (
            <div className="flex items-center justify-between bg-gray-100 p-2 rounded mb-2 mr-4">
              <div key={items.id} className="w-full gap-2" style={{ marginTop: '20px' }}>
                <h4>Select all of {items.module}</h4>
                <button
                  type="button"
                  onClick={() => handleSelectAll(items)}
                  className="bg-red-700 text-white px-2 py-1 rounded my-2"
                >
                  Select All
                </button>
                <div className="flex w-full gap-4 mb-2">
                  {items.permission.map(item => (

                    <label key={item.id} className="flex w-full gap-2 my-2 items-center text-sm">
                      <input
                        type="checkbox"
                        className="h-4 w-5"
                        checked={item.value}
                        onChange={() => handleToggle(items, item, !item.value)}
                      />
                      {/* <input className="checkBox"
                                type="checkbox"
                                checked={actions[action]}
                                onChange={() => handleToggle(section, action)}
                                /> */}
                      {/* {action.replace(/([A-Z])/g, ' $1').trim()} */}
                      {item.permissionName}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

      </> : <></>}

      {/* Line with shadow above the buttons */}
      <div className="flex justify-between items-center p-3 bg-white shadow-lg rounded w-full fixed bottom-12">
        <div className="flex justify-start space-x-4">
          <button
            type="button"
            className={`text-white px-4 py-2 rounded shadow ${currentPage === 1 ? 'disabled bg-gray-300 cursor-auto' : 'bg-red-700 '}`}
            onClick={handlePrev}
          >
            Prev
          </button>
          <button
            type="button"
            className="bg-red-700 text-white px-4 py-2 rounded shadow"
            onClick={currentPage ? handleSubmit : handlePermission}
          >
            {currentPage === 1 ? <>Next</> : <>Submit</>}
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

export default Designation;
