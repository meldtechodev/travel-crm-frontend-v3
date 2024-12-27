import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import Table from './TableComponent';
import { useNavigate } from 'react-router-dom';
import api from '../apiConfig/config';
import { FaEdit, FaEye, FaSearch, FaTrashAlt } from 'react-icons/fa';
import NewVendorForm from "./NewVendorForm";
import NewPackageForm from "./NewPackageForm";
import NewTransportationForm from "./NewTransportationForm";
import Country from './Country';
import Customer from './Customer';
import State from './State';
import Destination from './Destination';
import Department from './Department'
import { toast } from 'react-toastify';
import Hotel from './Hotel';
import { UserContext } from '../contexts/userContext';
import useDecryptedToken from '../hooks/useDecryptedToken';
import { IoArrowBack, IoArrowForward } from 'react-icons/io5';
import { FiFilter } from 'react-icons/fi';
import NewPolicyForm from './NewPolicyForm';
import Itinerary from './Itinerary';



const CustomersList = () => {
  const [activeTab, setActiveTab] = useState('customer');
  const [customerData, setCustomerData] = useState([]);
  const [addData, setAddData] = useState([]);
  const dropdownRef = useRef(null);
  const [selectedCustomerData, setSelectedCustomerData] = useState(null);
  const [isFormEditEnabled, setIsFormEditEnabled] = useState(false);
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const token = useDecryptedToken();
  const { user } = useContext(UserContext);

  const addIconsToData = (data, updateStatus) =>
    data && data.map((item) => ({
      ...item,
      status: (
        <div className="flex items-center justify-center">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={item.status}
            // onChange={() => handleStatusToggle(row.id)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:bg-green-500 dark:bg-gray-700 dark:peer-focus:ring-green-800">
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${item.status ? "translate-x-5" : ""
                  }`}
              ></div>
            </div>
          </label>
        </div>
      ),
      destination: (
        <div>
          <p>{item && item.destination && item.destination.destinationName && item.destination.destinationName}</p>
        </div>
      ),
      itineraryAction: (
        <div className="flex gap-2 justify-center">
          <FaEye
            className="text-purple-600 cursor-pointer"
            onClick={() => { }}
          />
          <FaEdit
            className="text-purple-600 cursor-pointer"
            onClick={() => {
              setIsFormEditEnabled(true);
              handleEdit(item);
            }}
          />
          <FaTrashAlt
            className="text-red-600 cursor-pointer"
            onClick={() => handleDelete(item)}
          />
        </div>
      ),
      Action: (
        <div className="flex gap-2 justify-center">
          <FaEdit
            className="text-purple-600 cursor-pointer"
            onClick={() => {
              setIsFormEditEnabled(true);
              handleEdit(item);
            }}
          />
          <FaTrashAlt
            className="text-red-600 cursor-pointer"
            onClick={() => handleDelete(item)}
          />
        </div>
      ),
      hotlAction: (
        <div className="flex gap-2 justify-center">
          <FaEye
            className="text-purple-600 cursor-pointer"
            onClick={() => {
              navigate(`/home/hotel-view/${item.id}`);
            }}
          />
          <FaEdit
            className="text-purple-600 cursor-pointer"
            onClick={() => {
              setIsFormEditEnabled(true);
              handleEdit(item);
            }}
          />
          <FaTrashAlt
            className="text-red-600 cursor-pointer"
            onClick={() => handleDelete(item)}
          />
        </div>
      ),
    }));

  const handleStatusToggle = async (item) => {
    const updatedStatus = item.status ? false : true;  // Toggle the status

    console.log(item);

    const updatedItem = {
      ...item,
      status: updatedStatus,
      modified_by: user.name,
      // country: item.country ? {id: item.country.id} : null,
    };

    if (activeTab === 'customer') {
      setCustomerData(prevData => prevData.map(i => (i.id === item.id ? updatedItem : i)));
    }

    console.log(activeTab);

    try {
      const response = await axios.put(`${api.baseUrl}/${activeTab === 'department' ? 'departments' : activeTab}/updatebyid/${item.id}`, updatedItem, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
          'Access-Control-Allow-Origin': '*'
        }
      });

      if (response.status === 200) {
        toast.success(`Successfully updated ${activeTab} status for item with ID ${item.id}`);
      } else {
        toast.error(`Failed to update status for item with ID ${item.id}`);
      }
    } catch (error) {
      toast.error('Error updating status:', error);

      if (activeTab === 'customer') {
        setCustomerData(prevData => prevData.map(i => (i.id === item.id ? { ...item } : i)));
      }
      // }
    }
  };


  const handleEdit = (item) => {
    console.log('Editing:', item);

    setIsFormEditEnabled(!!item);

    if (activeTab === 'customer') {
      setAddData(["Customer"]);
      setSelectedCustomerData(item || null)
    }
  };

  const handleDelete = (item) => {
    console.log('Deleting:', item);
    // Add delete logic here
  };

  const tabs = [
    { key: 'customer', label: 'Customer' },
  ];

  const tableData = {
    customer: {
      columns: [
        { header: 'S.No.', accessor: 'index' },
        { header: 'First Name', accessor: 'firstName' },
        { header: 'Last Name', accessor: 'lastName' },
        { header: 'E-mail', accessor: 'email' },
        { header: 'Lead Source', accessor: 'leadSource' },
        { header: 'Status', accessor: 'status' },
        { header: 'Action', accessor: 'Action' },
      ],
      data: addIconsToData(customerData, handleStatusToggle),
    },
  };

  useEffect(() => {

    const fetchCustomerData = async () => {
      try {
        const response = await axios.get(`${api.baseUrl}/customer/getall?page=${currentPage}&size=10`);
        const formattedData = response.data.content.map((item) => ({
          ...item,
          status: item.status,
          firstName: item.fName,
          lastName: item.lName,
          email: item.emailId,
          leadSource: item.leadSource,
        }));
        const newData = formattedData.map((item, index) => ({
          ...item,
          index: index + 1
        }))
        setCustomerData(newData);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error('Error fetching state data:', error);
      }
    }
    if (activeTab === 'customer') {
      fetchCustomerData()
    }
  }, [activeTab, currentPage]);

  return (
    <>
      <div className="h-24 mb-10 w-full p-4 bg-gray-50">
        <div className="pb-1 flex justify-between">
          <h2 className="text-xl font-bold mb-6">Master List</h2>
          <div className="relative" ref={dropdownRef}>
          </div>

        </div>
        <div className="relative inline-block w-full">
          <ul className="flex gap-4 py-0 border-gray-300 mb-6">
            {tabs.map((tab) => (
              <li
                key={tab.key}
                className={`cursor-pointer text-sm text-gray-700 border-b-2 ${activeTab === tab.key ? 'border-red-700' : 'border-transparent'
                  }`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 mb-6">
          <div className="flex items-center justify-between gap-2 w-full flex-col md:flex-row mb-6">
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
            <button className="flex items-center justify-center bg-red-500  text-white p-2 rounded-md hover:bg-red-700 mt-2 md:mt-0 md:ml-2"
              onClick={() => {
                setAddData([`${activeTab[0].toUpperCase()}${activeTab.substring(1)}`]);
                setIsFormEditEnabled(false);

                // Reset selected data based on active tab
                switch (activeTab) {
                  case 'customer':
                    setSelectedCustomerData(null);
                    break;
                  default:
                }
              }}
            >
              New {`${activeTab[0].toUpperCase()}${activeTab.substring(1)}`}
            </button>
          </div>
          <hr />
          <div className='w-full  overflow-auto mt-6'>
            <Table
              columns={tableData[activeTab].columns}
              data={tableData[activeTab].data}
            />
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
        </div>
      </div>
      <div
        className="submenu-menu"
        style={{ right: addData[0] === "Customer" ? "0" : "-100%" }}
      >
        <Customer
          isOpen={addData[0] === "Customer"}
          onClose={() => setAddData([])}
          customerData={selectedCustomerData}
          isFormEditEnabled={isFormEditEnabled}
          setIsFormEditEnabled={setIsFormEditEnabled}
        />
      </div>
    </>
  );
};

export default CustomersList;
