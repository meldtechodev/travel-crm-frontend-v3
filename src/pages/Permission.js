import axios from 'axios';
import React, { useEffect, useState } from 'react'
import api from '../apiConfig/config';

const Permission = ({ isOpen, onClose, designationData }) => {

  const [permissionData, setPermissionData] = useState([])
  const [modulePermission, setModulePermission] = useState([])
  const [modulesPermission, setModulesPermission] = useState([])
  const [modulesPermissionValue, setModulesPermissionValue] = useState([])
  const [module, setModule] = useState([])

  const handleToggle = (moduleId, perm, action) => {

    const changeModule = modulesPermission.filter(item => item.module.id === moduleId.module.id)
    // console.log(changeModule)
    const permissionChange = [...changeModule[0].permission]
    console.log(permissionChange)
    console.log(perm)
    const updatedActions = permissionChange.map(item => item.id === perm.id ? { ...item, value: action } : item)
    const final = modulesPermission.map(prev => prev.module.id === moduleId.module.id ? { ...prev, permission: updatedActions } : prev)
    setModulesPermission(final)
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


  useEffect(() => {
    axios.get(`${api.baseUrl}/permissions/getall`)
      .then(response => {
        setPermissionData(response.data);
        // console.log(res.data)

        const pModuleSet = new Set(response.data.map(items => items.modules.id))
        const pModuleArr = [...pModuleSet]
        const pModuleArrList = []
        const permModuleArrList = []
        const permModuleArrLists = []

        // console.log(pModuleArr)

        axios.get(`${api.baseUrl}/modules/getall`)
          .then(res => {
            setModule(res.data);
            for (let i = 0; i < pModuleArr.length; i++) {
              const data = res.data.filter(item => item.id === pModuleArr[i])
              pModuleArrList.push(data[0])
              // console.log(data[0])
            }
            pModuleArrList.forEach(items => {
              const filterPerm = response.data.filter(item => item.modules.id === items.id)
              permModuleArrList.push(items)
              // console.log(filterPerm)
              // console.log(items)

              permModuleArrLists.push({
                module: items,
                permission: filterPerm.map(item => ({
                  ...item,
                  value: false
                }))
              })
            })

            setModulesPermission(permModuleArrLists)

            console.log(permModuleArrLists)
          })
          .catch(error => console.error(error));

        // console.log(permModuleArrList)
        // pModuleArrList.map(item => item.modules.id)
        // console.log(permModuleArrList)



        // moduleFormat.forEach(items => {
        //   const formatPerm = res.data.filter(item => item.modules.id === items.id)
        //   if (formatPerm.length !== 0) {
        //     const formatP = formatPerm.map(item => ({ ...item, value: false }))
        //     const perm = {
        //       id: items.id,
        //       module: items.moduleName,
        //       permission: formatP
        //     }
        //     modulePermission.push(perm)
        //   }
        // })
      })
      .catch(error => console.error(error));
    // console.log(modulesPermission)
  }, [])


  const handleSubmit = async (e) => {
    e.preventDefault();

    for (let i = 0; i < modulesPermission.length; i++) {
      for (let j = 0; j < modulesPermission[i].permission.length; j++) {
        if (modulesPermission[i].permission[j].value) {
          axios.post(`${api.baseUrl}/designationPermission/create`, {
            "createdBy": "Anshul",
            "modifiedBy": "Anshul",
            "ipaddress": "14.11.223.21",
            "status": 1,
            "isdelete": 0,
            "designations": {
              "id": designationData.id
            },
            "permissions": {
              "id": modulesPermission[i].permission[j].id
            }
          }
          ).then(response => alert(response.data))
            .catch(error => console.error(error))
        }
      }
    }
  }

  return (
    <>
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
        <h3 className="bg-red-700 text-white p-2 rounded mb-4">
          Select all permissions
        </h3>


        <div className="w-full h-full mb-8 mr-4 p-4  overflow-y-scroll">
          {modulesPermission.map(items => (
            <div className="flex items-center justify-between bg-gray-100 p-2 rounded mb-2 mr-4">
              <div key={items.module.id} className="w-full gap-2" style={{ marginTop: '20px' }}>
                <h4>Select all of {items.module.moduleName}</h4>
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
                      {/* <input
                        type="checkbox"
                        className="h-4 w-5"
                        // checked={item.value}
                        /> */}
                      <input className="checkBox"
                        type="checkbox"
                        checked={item.value}
                        onChange={(e) => handleToggle(items, item, e)}
                      // onChange={() => handleToggle(section, action)}
                      />
                      {/* {action.replace(/([A-Z])/g, ' $1').trim()} */}
                      {item.permissionName}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          ))}
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
        <div className="flex justify-between items-center p-3 bg-white shadow-lg rounded w-full fixed bottom-12">
          <div className="flex justify-start space-x-4">
            {/* <button
            type="button"
            className={`text-white px-4 py-2 rounded shadow ${currentPage === 1 ? 'disabled bg-gray-300 cursor-auto' : 'bg-red-700 '}`}
            onClick={handlePrev}
          >
            Prev
          </button> */}
            <button
              type="button"
              className="bg-red-700 text-white px-4 py-2 rounded shadow"
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
      </div>
    </>
  )
}

export default Permission