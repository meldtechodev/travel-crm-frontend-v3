import React, { useEffect, useState } from "react";
import { FaEdit, FaTrashAlt, FaSearch } from "react-icons/fa";
import { FiFilter } from "react-icons/fi";
import { IoArrowBack, IoArrowForward } from "react-icons/io5";
import axios from "axios";
import TableComponent from "../component/TableComponent";
import api from "../apiConfig/config";
import Department from "./Department";
import { toast } from "react-toastify";

const ViewDepartments = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(10); // Set the number of items per page
  const [totalPages, setTotalPages] = useState(0);
  const [addData, setAddData] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const handleDepartmentEdit = (item) => {
    console.log('Editing:', item);
    setAddData(["Department"]);
    setSelectedCountry(item);
  };

  // Fetch data from the API and set the initial state
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${api.baseUrl}/departments/getall`, {
          params: {
            page: currentPage,
            size: itemsPerPage,
            sortDirection: 'asc' // Adjust sorting if necessary
          }
        }
        );
        setData(
          response.data.content.map((dept) => ({
            ...dept,
            status: !!dept.status, // Ensure status is a boolean value
            index: response.data.content.indexOf(dept)
          }))
        );
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    fetchData();
  }, [currentPage, itemsPerPage]);

  // Toggle the status of a specific row
  const handleStatusToggle = (id) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, status: !item.status } : item
      )
    );
  };

  const handleDelete = async (item) => {
    console.log("Deleting:", item);

    // Show a confirmation dialog before deleting the item
    if (!window.confirm("Are you sure you want to delete this item?")) {
      return;
    }

    await axios
      .delete(`${api.baseUrl}/departments/deletebyid/${item.id}`)
      .then((response) => {
        toast.success("Designation deleted successfully.");
      })
      .catch((error) => console.error("Error fetching designations:", error));
  }

  const columns = [
    // {
    //   header: "Select",
    //   accessor: "select",
    //   render: () => <input type="checkbox" />,
    // },
    {
      header: 'S. No.',
      render: ({ row }) => <span>{row.index + 1}</span>,
    },
    {
      header: "Department Name",
      accessor: "departmentName",
    },
    // {
    //   header: "Ip Address",
    //   accessor: "ipaddress",
    // },
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
          <button className="text-purple-500 hover:text-purple-700" onClick={
            () => handleDepartmentEdit(row)
          }>
            <FaEdit />
          </button>
          <button className="text-red-500 hover:text-red-700" onClick={() => handleDelete(row)}>
            <FaTrashAlt />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="p-4 w-full bg-gray-50 h-full">
        <h1 className="text-xl font-bold mb-6">Department</h1>

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
          <button className="flex items-center justify-center bg-red-500  text-white p-2 rounded-md hover:bg-red-700 mt-2 md:mt-0 md:ml-2" onClick={() => setAddData(['Department'])}>New Department +</button>
        </div>

        <hr className="my-4" />
        <div className="w-full overflow-auto">
          <TableComponent columns={columns} data={data} />
        </div>

        {/* Pagination */}
        <div className="flex justify-start items-center mt-4 space-x-4">
          {/* Previous Page Button */}
          <button
            className={`text-xl text-blue-500 hover:text-blue-700 ${currentPage === 0 && "opacity-50 cursor-not-allowed"
              }`}
            disabled={currentPage === 0}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            <IoArrowBack />
          </button>

          {/* Page Numbers */}
          <div className="flex space-x-2">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={`px-2 py-1 border rounded ${currentPage === index
                  ? "bg-blue-500 text-white"
                  : "text-blue-500 hover:bg-blue-100"
                  }`}
                onClick={() => setCurrentPage(index)}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {/* Next Page Button */}
          <button
            className={`text-xl text-blue-500 hover:text-blue-700 ${currentPage === totalPages - 1 && "opacity-50 cursor-not-allowed"
              }`}
            disabled={currentPage === totalPages - 1}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            <IoArrowForward />
          </button>
        </div>
      </div>
      <div
        className="submenu-menu"
        style={{ right: addData[0] === "Department" ? "0" : "-100%" }}
      >
        <Department
          isOpen={addData[0] === "Department"}
          onClose={() => setAddData([])}
          departmentData={selectedCountry}
        />
      </div>
    </>
  );
};

export default ViewDepartments;
