import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import api from '../apiConfig/config';
import { UserContext } from "../contexts/userContext";
import { valueOrDefault } from 'chart.js/helpers';
import { upload } from '@testing-library/user-event/dist/upload';

const Permission = ({ isOpen, onClose, designationData, designationModules, setDesignationModules }) => {

  const [permissionData, setPermissionData] = useState([])
  const [ipAddress, setIpAddress] = useState()
  const [module, setModule] = useState([])
  const { user } = useContext(UserContext);

  // setPermissionData(designationModules)
  // console.log(designationModules)


  const handleToggle = (moduleId, action) => {

    let mod = designationModules.map(item => item.id === moduleId ? { ...item, value: action } : item)
    // setDesignationModules(mod)
    setDesignationModules(mod)
  };

  const handleSelectAll = (moduleId) => {

    // let selectAll = false
    // const updatedActions = []
    // const changeModule = modulePermission.filter(item => item.id === module.id)
    // const permissionChange = [...changeModule[0].permission]
    // for (let i = 0; i < permissionChange.length; i++) {
    //   if (!permissionChange[i].value) {
    //     selectAll = true
    //     break
    //   }
    // }
    // if (selectAll) {
    //   const updatedActions = permissionChange.map(item => ({ ...item, value: true }))
    //   const final = modulePermission.map(prev => prev.id === module.id ? { ...prev, permission: updatedActions } : prev)
    //   setModulePermission(final)
    // } else {
    //   const updatedActions = permissionChange.map(item => ({ ...item, value: false }))
    //   const final = modulePermission.map(prev => prev.id === module.id ? { ...prev, permission: updatedActions } : prev)
    //   setModulePermission(final)
    // }
    // console.log(moduleId)
    // console.log(permissionData[moduleId.id].selectAll)
    // console.log(moduleId)
    let selectval = designationModules.filter(item => item.id === moduleId.id && item.selectAll ? true : false)
    // console.log(selectval)
    // let val = 0
    // for (let i = 0; i < selectAll.length; i++) {
    //   if (!selectAll[i]) {
    //     val += 1
    //   }
    // }
    let data = []
    let update = []
    if (!selectval[0]) {
      data = designationModules.map(item => item.parentId === moduleId.id ? { ...item, value: true, selectAll: true } : item)
      update = data.map(item => item.id === moduleId.id ? { ...item, selectAll: true } : item)
    } else {
      data = designationModules.map(item => item.parentId === moduleId.id || item.parentId === 0 ? { ...item, value: false, selectAll: false } : item)
      update = data.map(item => item.id === moduleId.id ? { ...item, selectAll: false } : item)
      // console.log(data)
    }
    setDesignationModules(update)
  };


  useEffect(() => {
    // setPermissionData(permissionData)
    axios.get(`${api.baseUrl}/ipAddress`)
      .then(response => setIpAddress(response.data))
      .catch((error) => {
        console.error('Error fetching IP address:', error);
      });

    axios.get(`${api.baseUrl}/modules/getall`)
      .then(response =>
        // let perms = response.data.map(item => item.moduleName === 'Quickstart' || item.moduleName === 'Dashboard' ? { ...item, parentId: item.id, value: false, selectAll: false } : { ...item, value: false, selectAll: false })

        setModule(response.data.filter(item => item.parentId === 0)))
      .catch(error => console.error(error))
  }, [])


  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(designationModules)

    for (let i = 0; i < designationModules.length; i++) {
      // for (let j = 0; j < modulesPermission[i].permission.length; j++) {
      if (designationModules[i].value) {
        // console.log(designationModules[i])
        axios.post(`${api.baseUrl}/designationModules/create`, {
          "createdBy": user.name,
          "modifiedBy": user.name,
          "ipaddress": ipAddress,
          "status": 1,
          "isdelete": 0,
          "designations": {
            "id": designationData.id
          },
          "modules": {
            "id": designationModules[i].id
          }
        }
        )
          .then(response => {
            let data = permissionData.map(item => ({ ...item, value: false, selectAll: false }))
            onClose(true)
            setPermissionData(data)
            console.log(response.data)
          })
          .catch(error => console.error(error));
      }

    }
  }

  return (
    <>
      <div
        className={`fixed top-0 right-0 h-full bg-gray-200 shadow-lg mb-16 transform transition-transform duration-500 z-50 ${isOpen ? "translate-x-0" : "translate-x-[1050px]"
          } mt-4 sm:mt-8 md:mt-12 w-full sm:w-[calc(100%-120px)] md:w-[1000px]`}
      >
        {/* "X" button positioned outside the form box */}
        <button
          onClick={() => {
            let data = permissionData.map(item => ({ ...item, value: false, selectAll: false }))
            onClose(true)
            setPermissionData(data);
            onClose(true)
          }}
          className="absolute top-[12px] left-[-22px] font-semibold text-white text-sm bg-red-700 square px-3  py-1.5 border border-1 border-transparent hover:border-red-700 hover:bg-white hover:text-red-700"
        >
          X
        </button>
        <div className="flex justify-between items-center p-4 pl-8 bg-white shadow-md">
          <h2 className="text-lg font-bold text-black">Module Permisiion
          </h2>
        </div>
        <h3 className="bg-red-700 text-white p-2 rounded mb-4">
          Select all Module of {designationData && designationData.designationName}
        </h3>


        <div className="m-0 p-0 overflow-y-scroll h-full">

          <div className="w-fit mr-4 p-4 overflow-y-scroll mb-48">
            {module.map(items =>
              <div className="flex items-center justify-between bg-gray-100 p-2 rounded mb-2 mr-4 ">
                <div key={items.id} className="w-full gap-2 " style={{ marginTop: '20px' }}>
                  <h4>Select all of {items.moduleName}</h4>
                  <button
                    type="button"
                    onClick={() => handleSelectAll(items)}
                    className="bg-red-700 text-white px-2 py-1 rounded my-2"
                  >
                    Select All
                  </button>
                  <div className="flex w-full gap-4 mb-2">
                    {designationModules.map(item => item.parentId === items.id
                      && (
                        <label key={item.id} className="flex max-w-fit gap-2 my-2 items-center text-sm">

                          {/* <input
                        type="checkbox"
                        className="h-4 w-5"
                        // checked={item.value}
                        /> */}
                          <input className="checkBox"
                            type="checkbox"
                            checked={item.value}
                            onChange={(e) => handleToggle(item.id, !item.value)}
                          // onChange={() => handleToggle(section, action)}
                          />
                          {/* {action.replace(/([A-Z])/g, ' $1').trim()} */}
                          {item.moduleName}
                        </label>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* <div className="flex gap-2">
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
          </div> */}
        {/* </div> */}

        {/* <div className="fixed bottom-12"> */}
        <div className="flex justify-start items-center p-3 gap-4 bg-white shadow-lg rounded w-full fixed bottom-12">
          {/* <div className="flex justify-start space-x-4">
          </div> */}
          <button
            type="button"
            className="bg-red-700 text-white px-4 py-2 rounded shadow relative"
            // onClick={currentPage ? handleSubmit : handlePermission}
            onClick={handleSubmit}
          >
            {/* {currentPage === 1 ? <>Next</> : <>Submit</>} */}
            Submit
          </button>
          <button
            type="button"
            className="bg-red-700 text-white px-4 py-2 rounded shadow"
          // onClick={handleReset}
          >
            Reset
          </button>
        </div>
      </div>
      {/* </div > */}
    </>
  )
}

export default Permission