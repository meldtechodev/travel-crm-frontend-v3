import React, { useEffect, useState } from "react";
import { FaEdit, FaTrashAlt, FaSearch } from "react-icons/fa";
import { MdOutlineSecurityUpdateGood } from "react-icons/md";
import { FiFilter } from "react-icons/fi";
import { IoArrowBack, IoArrowForward } from "react-icons/io5";
import axios from "axios";
import TableComponent from "../component/TableComponent";
import api from "../apiConfig/config";
import Designation from "./Designation";
import { toast } from "react-toastify";
import Permission from "./Permission";

const ViewDesignations = () => {
  const [data, setData] = useState([]);
  const [selectedDesignation, setSelectedDesignation] = useState(null);
  const [addData, setAddData] = useState([]);
  const [module, setModule] = useState([])
  const [permissionData, setPermissionData] = useState([])

  const [allDesignationModules, setAllDesignationModules] = useState([])
  const [designationModules, setDesignationModules] = useState([])

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Set the number of items per page

  // Calculate the data to display for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = data.slice(startIndex, startIndex + itemsPerPage);

  // Total number of pages
  const totalPages = Math.ceil(data.length / itemsPerPage);

  // Toggle the status of a specific row
  const handleStatusToggle = (id) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, status: !item.status } : item
      )
    );
  };

  const handleEdit = (item) => {
    console.log("Editing:", item);
    setAddData(["Designation"]);
    setSelectedDesignation(item);
  }

  const handlePermission = (item) => {
    let sendUpdate = module.map(item => item.moduleName === 'Quickstart' || item.moduleName === 'Dashboard' ? { ...item, parentId: item.id, value: false, selectAll: false } : { ...item, value: false, selectAll: false })
    setPermissionData(sendUpdate)

    setSelectedDesignation(item);
    let update = allDesignationModules.filter(items => items.designations.id === item.id)
    setDesignationModules(update)
    let changeUpdate = update.map(item => item.modules)

    for (let i = 0; i < changeUpdate.length; i++) {
      let update = sendUpdate.map(item => item.id === changeUpdate[i].id ? { ...item, value: true } : item)
      sendUpdate = [...update]
    }
    setDesignationModules(sendUpdate)
    // console.log(designationModules)

    setModule(sendUpdate)

    setAddData(['Permission'])
  }

  const handleDelete = async (item) => {
    console.log("Deleting:", item);

    // Show a confirmation dialog before deleting the item
    if (!window.confirm("Are you sure you want to delete this item?")) {
      return;
    }

    await
      axios.delete(`${api.baseUrl}/designations/deletebyid/${item.id}`)
        .then((response) => {
          toast.success("Designation deleted successfully.");
        })
        .catch((error) => console.error("Error fetching designations:", error));
  }

  const columns = [
    {
      header: 'S. No.',
      render: ({ row }) => <span>{row.index + 1}</span>,
    },
    {
      header: "Designation Name",
      accessor: "designationName",
    },
    {
      header: "Department Name",
      accessor: "departmentName",
    },
    {
      header: "Status",
      render: ({ row }) => (
        <div className="flex items-center justify-center">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={row.status}
              onChange={() => handleStatusToggle(row.id)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:bg-green-500 dark:bg-gray-700 dark:peer-focus:ring-green-800">
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${row.status ? "translate-x-5" : ""
                  }`}
              ></div>
            </div>
          </label>
        </div>
      ),
    },
    {
      header: "Actions",
      accessor: "actions",
      render: ({ row }) => (
        <div className="flex justify-center items-center space-x-2">
          <button className="text-blue-500 hover:text-blue-700" onClick={() => handlePermission(row)}>
            <MdOutlineSecurityUpdateGood />
          </button>
          <button className="text-blue-500 hover:text-blue-700" onClick={() => handleEdit(row)}>
            <FaEdit />
          </button>
          <button className="text-red-500 hover:text-red-700" onClick={() => handleDelete(row)}>
            <FaTrashAlt />
          </button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    axios.get(`${api.baseUrl}/designations/getall`)
      .then((response) => {
        const formatData = response.data.content.map((designation) => ({
          ...designation,
          departmentName: designation.departments.departmentName,
          status: designation.status ? "Active" : "Inactive",
          index: response.data.content.indexOf(designation),
        }))
        setData(formatData);
      })
      .catch((error) => console.error("Error fetching designations:", error));

    axios.get(`${api.baseUrl}/modules/getall`)
      .then(response => {
        // let mod = response.data.filter(item => item.parentId === 0);
        let perms = response.data.map(item => item.moduleName === 'Quickstart' || item.moduleName === 'Dashboard' ? { ...item, parentId: item.id, value: false, selectAll: false } : { ...item, value: false, selectAll: false })

        setModule(perms)
        // let update = []
        // for (let i = 0; i < designationModules.length; i++) {
        //   update = perms.map(item => item.id === designationModules[i].id ? { ...item, value: true } : item)
        // }

        // console.log(perms)
      })
      .catch(error => console.error(error));

    axios.get(`${api.baseUrl}/designationModules/getall`)
      .then((response) => {
        // console.log(response.data)
        // console.log(designationData.id)
        // let updateData = response.data.filter(item => item.designations.id === designationData.id)
        // console.log(updateData)
        setAllDesignationModules(response.data)
        // let sendUpdate = module.map(item => item.moduleName === 'Quickstart' || item.moduleName === 'Dashboard' ? { ...item, parentId: item.id, value: false, selectAll: false } : { ...item, value: false, selectAll: false })
        // setDesignationModules(sendUpdate)
      })
      .catch((error) => {
        console.error('Error fetching designation modules:', error);
      });
  }, []);

  return (
    <>
      <div className="p-4 w-full bg-gray-50 h-full mb-12">
        <h1 className="text-xl font-bold mb-6">Designation</h1>
        <div className="flex items-center justify-between gap-2 w-full flex-col md:flex-row">
          <div className="flex justify-between">

            <div className="flex items-center bg-white border border-gray-300 rounded-md px-3 py-2 w-full">
              <FaSearch className="text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Search"
                className="w-full outline-none text-gray-700"
              />
            </div>

            {/* Filter Button */}
            <button className="flex items-center justify-center bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 mt-2 md:mt-0 md:ml-2">
              <FiFilter />
            </button>
          </div>
          {/* <p onClick={() => setAddData(['Permission'])}>View Permission</p> */}
          <button className="flex items-center justify-center  bg-red-500  text-white p-2 rounded-md hover:bg-red-700 mt-2 md:mt-0 md:ml-2" onClick={() => setAddData(['Designation'])}>New Designation +</button>
        </div>
        <hr className="my-4" />
        <div className="w-full overflow-auto">
          <TableComponent columns={columns} data={currentData} />
        </div>

        {/* Pagination */}
        <div className="flex justify-start items-center mt-4 space-x-4">
          {/* Previous Page Button */}
          <button
            className={`text-xl text-blue-500 hover:text-blue-700 ${currentPage === 1 && "opacity-50 cursor-not-allowed"
              }`}
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            <IoArrowBack />
          </button>

          {/* Page Numbers */}
          <div className="flex space-x-2">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={`px-2 py-1 border rounded ${currentPage === index + 1
                  ? "bg-blue-500 text-white"
                  : "text-blue-500 hover:bg-blue-100"
                  }`}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {/* Next Page Button */}
          <button
            className={`text-xl text-blue-500 hover:text-blue-700 ${currentPage === totalPages && "opacity-50 cursor-not-allowed"
              }`}
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            <IoArrowForward />
          </button>
        </div>
      </div>
      <div
        className="submenu-menu"
        style={{ right: addData[0] === "Designation" ? "0" : "-100%" }}
      >
        <Designation
          isOpen={addData[0] === "Designation"}
          onClose={() => setAddData([])}
          designationData={selectedDesignation}
        />
      </div>
      <div
        className="submenu-menu"
        style={{ right: addData[0] === "Permission" ? "0" : "-100%" }}
      >
        <Permission
          isOpen={addData[0] === "Permission"}
          onClose={() => setAddData([])}
          designationData={selectedDesignation}
          designationModules={designationModules}
          setDesignationModules={setDesignationModules}
        />
      </div>
    </>
  );
};

export default ViewDesignations;
