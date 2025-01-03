import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Select from "react-select";
import api from "../apiConfig/config";
import axios from "axios";
import { UserContext } from "../contexts/userContext";
import { toast } from "react-toastify";
// import Select from "react-select/base";

const Roles = ({ isOpen, onClose }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [roleName, setRoleName] = useState("");
  const [description, setDescription] = useState("");
  const [permission, setPermission] = useState([])
  const [module, setModule] = useState([])
  const [designations, setDesignation] = useState([])
  const [modulePermission, setModulePermission] = useState([])


  const { user, ipAddress } = useContext(UserContext)

  const navigate = useNavigate()

  const isFormFilled = roleName;


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
      })
      .catch(error => console.error('Error fetching protected resource:', error))
  }, [])

  // State for permissions checkboxes

  const handleReset = () => {

    setRoleName('');
    setDescription('')
    setCurrentPage(1)
  }

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

    // setPermissions((prevPermissions) => {
    //   const allSelected = !prevPermissions[section].selected;
    //   const newActions = Object.fromEntries(
    //     Object.keys(prevPermissions[section].actions).map((action) => [
    //       action,
    //       allSelected,
    //     ])
    //   );
    //   return {
    //     ...prevPermissions,
    //     [section]: {
    //       ...prevPermissions[section],
    //       selected: allSelected,
    //       actions: newActions,
    //     },
    //   };
    // });
  };

  // Functions to navigate between pages
  const handleNext = async (e) => {
    e.preventDefault();

    if (!isFormFilled) {
      alert("Please fill out the Role Name and Description fields before proceeding.");
      return; // Prevent proceeding to the next page
    }
    let payload = {
      "roleName": roleName,
      "createdby": user.name,
      "modifiedby": user.name,
      "ipaddress": ipAddress,
      "status": 1,
      "isdelete": 0
    }

    await axios.post(`${api.baseUrl}/role/create`, payload, {
      headers: {
        // 'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    })
      .then(async (response) => {
        toast.success("Role Created Successfully.", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setRoleName('')
        onClose()
      })
      .catch(error => console.error(error));

  };
  const handlePrev = () => {
    setCurrentPage(1);
  };

  // Function to handle select all logic
  // const handleSelectAll = (setPermissions) => {
  //   setPermissions({
  //     view: true,
  //     add: true,
  //     edit: true,
  //     delete: true,
  //   });
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // const selectedPermissions = Object.keys(permissions).reduce((acc, module) => {
    //   const selectedActions = Object.entries(permissions[module].actions)
    //     .filter(([_, isSelected]) => isSelected)
    //     .map(([action]) => action);

    //   if (selectedActions.length > 0) {
    //     acc.push({
    //       module,
    //       actions: selectedActions,
    //     });
    //   }
    //   return acc;
    // }, []);

    const payload = {
      name: roleName.toUpperCase(),
      // "permissions": selectedPermissions
    };
    console.log(payload)
    console.log(modulePermission)

    // await axios.post(`${api.baseUrl}/all`,
    //   payload, {
    //   headers: {
    //     'Authorization': `Bearer ${token}`,
    //     'Content-Type': 'application/json',
    //   }
    // })
    //   .then(async (response) => {
    //     console.log(response.data)
    //     alert(response.data.message);
    //     setPermissions([]);
    //     setRoleName('')
    //     setDescription('')
    //     setCurrentPage(1)

    //   })
    //   .catch(error => console.error(error));

    // } else {
    //   alert('Role name cant be empty')
    // }
  }




  return (
    <div
      className={`fixed top-0 right-0 h-full bg-gray-200 shadow-lg z-50 transform transition-transform duration-500 ${isOpen ? "translate-x-0" : "translate-x-[950px]"
        } mt-4 sm:mt-8 md:mt-12 lg:w-[900px] sm:w-[400px] md:w-[700px]`}
    >
      {/* Close button */}
      <button
        onClick={() => onClose(true)}
        className="absolute top-[12px] left-[-22px] font-semibold text-white text-sm bg-red-700 square px-3  py-1.5 border border-1 border-transparent hover:border-red-700 hover:bg-white hover:text-red-700"
      >
        X
      </button>
      {/* Header */}
      <div className="flex justify-between items-center p-4 pl-8 bg-white shadow-md">
        <h2 className="text-lg font-bold text-black">
          Manage Roles and Permissions
        </h2>
      </div>
      <div className="border-b border-gray-300 shadow-sm"></div>

      {/* Page content */}
      <div className="grid grid-cols-12 gap-4 p-4 h-[calc(100vh-160px)]">
        {/* Left side content */}
        <div className="col-span-9 overflow-y-auto overflow-x-hidden">
          {currentPage === 1 ? (
            /* Basic Information page */
            <form className="w-full">
              <div className="mb-6">
                <h3 className="bg-red-700 text-white p-2 rounded">
                  Basic Information
                </h3>
              </div>
              <div className="flex gap-2 mb-4">
                <div className="w-full">
                  <label
                    htmlFor="roleName"
                    className="block text-sm font-medium"
                  >
                    Role Name
                  </label>
                  <input
                    type="text"
                    id="roleName"
                    className="mt-1 p-2 w-full border rounded"
                    placeholder="Enter role name"
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                  />
                </div>

              </div>
              {/* <div className="flex gap-2 mb-4">
                <div className="w-full">
                  <label
                    htmlFor="roleName"
                    className="block text-sm font-medium"
                  >
                    Designation Name
                  </label>
                  <Select
                    className="mt-1 p-2 w-full border rounded"
                    placeholder="Enter role name"
                    options={designations}
                  // styles={customStyles}
                  // value={selectedOption}
                  // onChange={handleChange}
                  // options={countryDetails}
                  />
                </div>

              </div> */}
            </form>
          ) : (
            /* Select All Permissions page */
            <>
              <h3 className="bg-red-700 text-white p-2 rounded mb-4">
                Select all permissions
              </h3>


              {modulePermission.map(items => (
                <div className="w-full mb-2 mr-4">
                  <div className="flex items-center justify-between bg-gray-100 p-2 rounded mb-2 mr-4">
                    <div key={items.id} className="w-full gap-2" style={{ marginTop: '20px' }}>
                      <h4>Select all of {items.module}</h4>
                      <button
                        type="button"
                        onClick={() => handleSelectAll(items)}
                        className="bg-red-700 text-white px-2 py-1 rounded my-2"
                      // style={{
                      //   backgroundColor: permissions[section].selected ? 'lightgreen' : 'lightcoral',
                      // }}
                      >
                        Select All
                      </button>
                      {/* // style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'space-between' }} */}

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
                </div>
              ))}

              {/* <h4 className="font-medium">Select all of Dashboard</h4>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => handleSelectAll(setDashboardPermissions)}
                  >
                    Select All
                  </button>
                <div className="grid grid-cols-4 gap-4 mb-4">
                  {Object.keys(dashboardPermissions).map((perm) => (
                    <label key={perm}>
                      <input
                        type="checkbox"
                        className="h-4 w-5"
                        checked={dashboardPermissions[perm]}
                        onChange={() =>
                          setDashboardPermissions((prev) => ({
                            ...prev,
                            [perm]: !prev[perm],
                          }))
                        }
                      />{" "}
                      {perm.charAt(0).toUpperCase() + perm.slice(1)}
                    </label>
                  ))}
                </div>
              </div>


              <div className="mb-6">
                <div className="flex items-center justify-between bg-gray-100 p-2 rounded mb-2">
                  <h4 className="font-medium">Select all of Packages</h4>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => handleSelectAll(setPackagesPermissions)}
                  >
                    Select All
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-4 mb-4">
                  {Object.keys(packagesPermissions).map((perm) => (
                    <label key={perm}>
                      <input
                        type="checkbox"
                        className="h-4 w-5"
                        checked={packagesPermissions[perm]}
                        onChange={() =>
                          setPackagesPermissions((prev) => ({
                            ...prev,
                            [perm]: !prev[perm],
                          }))
                        }
                      />{" "}
                      {perm.charAt(0).toUpperCase() + perm.slice(1)}
                    </label>
                  ))}
                </div>
              </div>


              <div className="mb-6">
                <div className="flex items-center justify-between bg-gray-100 p-2 rounded mb-2">
                  <h4 className="font-medium">Select all of MyTeams</h4>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => handleSelectAll(setMyTeamsPermissions)}
                  >
                    Select All
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-4 mb-4">
                  {Object.keys(myTeamsPermissions).map((perm) => (
                    <label key={perm}>
                      <input
                        type="checkbox"
                        className="h-4 w-5"
                        checked={myTeamsPermissions[perm]}
                        onChange={() =>
                          setMyTeamsPermissions((prev) => ({
                            ...prev,
                            [perm]: !prev[perm],
                          }))
                        }
                      />{" "}
                      {perm.charAt(0).toUpperCase() + perm.slice(1)}
                    </label>
                  ))}
                </div>
              </div>


              <div className="mb-6">
                <div className="flex items-center justify-between bg-gray-100 p-2 rounded mb-2">
                  <h4 className="font-medium">Select all of Report</h4>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => handleSelectAll(setReportPermissions)}
                  >
                    Select All
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-4 mb-4">
                  {Object.keys(reportPermissions).map((perm) => (
                    <label key={perm}>
                      <input
                        type="checkbox"
                        className="h-4 w-5"
                        checked={reportPermissions[perm]}
                        onChange={() =>
                          setReportPermissions((prev) => ({
                            ...prev,
                            [perm]: !prev[perm],
                          }))
                        }
                      />{" "}
                      {perm.charAt(0).toUpperCase() + perm.slice(1)}
                    </label>
                  ))}
                </div>
              </div>


              <div className="mb-6">
                <div className="flex items-center justify-between bg-gray-100 p-2 rounded mb-2">
                  <h4 className="font-medium">Select all of Sales</h4>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => handleSelectAll(setSalesPermissions)}
                  >
                    Select All
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-4 mb-4">
                  {Object.keys(salesPermissions).map((perm) => (
                    <label key={perm}>
                      <input
                        type="checkbox"
                        className="h-4 w-5"
                        checked={salesPermissions[perm]}
                        onChange={() =>
                          setSalesPermissions((prev) => ({
                            ...prev,
                            [perm]: !prev[perm],
                          }))
                        }
                      />{" "}
                      {perm.charAt(0).toUpperCase() + perm.slice(1)}
                    </label>
                  ))}
                </div>
              </div>


              <div className="mb-6">
                <div className="flex items-center justify-between bg-gray-100 p-2 rounded mb-2">
                  <h4 className="font-medium">Select all of Master</h4>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => handleSelectAll(setMasterPermissions)}
                  >
                    Select All
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-4 mb-8">
                  {Object.keys(masterPermissions).map((perm) => (
                    <label key={perm}>
                      <input
                        type="checkbox"
                        className="h-4 w-5"
                        checked={masterPermissions[perm]}
                        onChange={() =>
                          setMasterPermissions((prev) => ({
                            ...prev,
                            [perm]: !prev[perm],
                          }))
                        }
                      />{" "}
                      {perm.charAt(0).toUpperCase() + perm.slice(1)}
                    </label>
                  ))}
                </div> */}
              {/* </div> */}
            </>
          )}
        </div>
        {/* // </div> */}
        {/* Right side "Roles Information" section */}
        <div className="col-span-3 bg-gray-100 p-2 rounded h-[200px] overflow-y-auto">
          <h3 className="bg-red-700 text-white p-2 rounded">
            Roles Information
          </h3>
          <div className="mt-4 space-y-4">
            <div className="flex items-center">
              <input
                type="radio"
                id="basicInformation"
                name="permission"
                className="mr-2"
                checked={currentPage === 1 || currentPage === 2} // Radio button selected when on Basic Information page
              />
              <label htmlFor="basicInformation">Basic Information</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="roleInformation"
                name="permission"
                className="mr-2"
                checked={currentPage === 2} // Radio button selected when on Role Information page
              />
              <label htmlFor="roleInformation">Role Information</label>
            </div>
          </div>
        </div>
      </div>
      {/* Buttons for navigation */}
      <div className="flex justify-between items-center p-3 bg-white shadow-lg rounded w-full fixed bottom-12 left-0 right-0">
        {currentPage === 1 ? (
          /* Navigation buttons for Basic Information page */
          <div className="flex justify-start space-x-4">
            <button
              type="button"
              className="bg-gray-600 text-white px-4 py-2 rounded shadow"
              disabled={currentPage === 1} // Disable if on the first page
            >
              Back
            </button>
            <button
              type="button"
              className="bg-red-700 text-white px-4 py-2 rounded shadow"
              onClick={handleNext}
            >
              Submit
            </button>
          </div>
        ) : (
          /* Navigation buttons for Select All Permissions page */
          <div className="flex justify-start space-x-4">
            <button
              type="button"
              className="bg-red-700 text-white px-4 py-2 rounded shadow"
              onClick={handlePrev}
              disabled={currentPage === 1} // Disable if on the first page
            >
              Back
            </button>
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
        )}
      </div>
    </div>

  );
};

export default Roles;
