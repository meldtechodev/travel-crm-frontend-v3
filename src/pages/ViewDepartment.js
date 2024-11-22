import React, { useEffect, useState } from "react";
import { FaEdit, FaTrashAlt, FaSearch } from "react-icons/fa";
import { FiFilter } from "react-icons/fi";
import { IoArrowBack, IoArrowForward } from "react-icons/io5";
import axios from "axios";
import TableComponent from "../component/TableComponent";
import api from "../apiConfig/config";

const ViewDepartments = () => {
  const [data, setData] = useState([]);
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

  const columns = [
    {
      header: "Select",
      accessor: "select",
      render: () => <input type="checkbox" />,
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
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  row.status ? "translate-x-5" : ""
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
          <button className="text-blue-500 hover:text-blue-700">
            <FaEdit />
          </button>
          <button className="text-red-500 hover:text-red-700">
            <FaTrashAlt />
          </button>
        </div>
      ),
    },
  ];

  // Fetch data from the API and set the initial state
  useEffect(() => {
    axios
      .get(`${api.baseUrl}/departments/getAll`)
      .then((response) => {
        setData(
          response.data.map((dept) => ({
            ...dept,
            status: !!dept.status, // Ensure status is a boolean value
          }))
        );
      })
      .catch((error) => console.error("Error fetching departments:", error));
  }, []);

  return (
    <div className="p-4 w-full bg-gray-50 h-full">
      <h1 className="text-xl font-bold mb-6">Department</h1>

      <div className="flex items-center gap-2 w-full">
        <div className="flex items-center bg-white border border-gray-300 rounded-md px-3 py-2 w-1/5">
          <FaSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search"
            className="w-full outline-none text-gray-700"
          />
        </div>

        {/* Filter Button */}
        <button className="flex items-center justify-center bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">
          <FiFilter />
        </button>
      </div>
      <hr className="my-4" />
      <div className="w-full overflow-auto">
        <TableComponent columns={columns} data={currentData} />
      </div>

      {/* Pagination */}
      {/* Pagination */}
      <div className="flex justify-center items-center mt-4 space-x-4">
        {/* Previous Page Button */}
        <button
          className={`text-xl text-blue-500 hover:text-blue-700 ${
            currentPage === 1 && "opacity-50 cursor-not-allowed"
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
              className={`px-2 py-1 border rounded ${
                currentPage === index + 1
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
          className={`text-xl text-blue-500 hover:text-blue-700 ${
            currentPage === totalPages && "opacity-50 cursor-not-allowed"
          }`}
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          <IoArrowForward />
        </button>
      </div>
    </div>
  );
};

export default ViewDepartments;
