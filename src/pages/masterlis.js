import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import Table from './TableComponent';
import { useNavigate } from 'react-router-dom';
import api from '../apiConfig/config';
import { FaEdit, FaEye, FaSearch, FaTrashAlt } from 'react-icons/fa';
import NewVendorForm from "../pages/NewVendorForm";
import NewPackageForm from "../pages/NewPackageForm";
import NewTransportationForm from "../pages/NewTransportationForm";
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



const MasterList = () => {
  const [activeTab, setActiveTab] = useState('country');
  const [countryData, setCountryData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [destinationData, setDestinationData] = useState([]);
  const [hotelData, setHotelData] = useState([]);
  const [customerData, setCustomerData] = useState([]);
  const [vendorData, setVendorData] = useState([]);
  const [policyData, setPolicyData] = useState([]);
  const [transportData, setTransportData] = useState([]);
  const [itineraryData, setItineraryData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [addData, setAddData] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedHotelData, setSelectedHotelData] = useState(null);
  const [selectedVendorData, setSelectedVendorData] = useState(null);
  const [selectedCustomerData, setSelectedCustomerData] = useState(null);
  const [selectedPolicyData, setSelectedPolicyData] = useState(null);
  const [selectedItineraryData, setSelectedItineraryData] = useState(null);
  const [selectedTransportData, setSelectedTransportData] = useState(null);
  const [isFormEditEnabled, setIsFormEditEnabled] = useState(false);
  const [addButton, setAddButton] = useState(activeTab);
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const token = useDecryptedToken();

  // Reusable ToggleSwitch Component

  const { user, ipAddress, countryDetails } = useContext(UserContext);

  const ToggleSwitch = ({ isOn, handleToggle }) => {
    return (
      <div className="flex justify-center items-center w-full h-full">
        <div
          className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer ${isOn ? 'bg-green-500' : 'bg-gray-300'
            }`}
          onClick={handleToggle}
        >
          <div
            className={`w-3 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${isOn ? 'translate-x-6' : 'translate-x-0'
              }`}
          />
        </div>
      </div>

    );
  };

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

    if (activeTab === 'country') {
      setCountryData(prevData => prevData.map(i => (i.id === item.id ? updatedItem : i)));
    } else if (activeTab === 'state') {
      setStateData(prevData => prevData.map(i => (i.id === item.id ? updatedItem : i)));
    } else if (activeTab === 'city') {
      setDestinationData(prevData => prevData.map(i => (i.id === item.id ? updatedItem : i)));
    } else if (activeTab === 'hotel') {
      setHotelData(prevData => prevData.map(i => (i.id === item.id ? updatedItem : i)));
    } else if (activeTab === 'customer') {
      setCustomerData(prevData => prevData.map(i => (i.id === item.id ? updatedItem : i)));
    } else if (activeTab === 'vendor') {
      setVendorData(prevData => prevData.map(i => (i.id === item.id ? updatedItem : i)));
    } else if (activeTab === 'itinerary') {
      setItineraryData(prevData => prevData.map(i => (i.id === item.id ? updatedItem : i)));
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

      if (activeTab === 'country') {
        setCountryData(prevData => prevData.map(i => (i.id === item.id ? { ...item } : i)));
      } else if (activeTab === 'state') {
        setStateData(prevData => prevData.map(i => (i.id === item.id ? { ...item } : i)));
      } else if (activeTab === 'city') {
        setDestinationData(prevData => prevData.map(i => (i.id === item.id ? { ...item } : i)));
      } else if (activeTab === 'hotel') {
        setHotelData(prevData => prevData.map(i => (i.id === item.id ? { ...item } : i)));
      } else if (activeTab === 'customer') {
        setCustomerData(prevData => prevData.map(i => (i.id === item.id ? { ...item } : i)));
      } else if (activeTab === 'vendor') {
        setVendorData(prevData => prevData.map(i => (i.id === item.id ? { ...item } : i)));
      } else if (activeTab === 'department') {
        setItineraryData(prevData => prevData.map(i => (i.id === item.id ? { ...item } : i)));
      }
      // }
    }
  };


  const handleEdit = (item) => {
    console.log('Editing:', item);

    setIsFormEditEnabled(!!item);

    if (activeTab === 'country') {
      setAddData(["Country"]);
      console.log(item);
      setSelectedCountry(item || null);
    } else if (activeTab === 'state') {
      setSelectedState(item || null);
      setAddData(["State"]);
    } else if (activeTab === 'city') {
      setAddData(["City"]);
      setSelectedDestination(item || null);
    } else if (activeTab === 'department') {
      setAddData(["Department"]);
      setSelectedDepartment(item || null);
    } else if (activeTab === 'hotel') {
      setAddData(["Hotel"]);
      setSelectedHotelData(item || null);
    } else if (activeTab === 'vendor') {
      setAddData(["Vendor"]);
      setSelectedVendorData(item || null);
      console.log(`Editing`, item)
    } else if (activeTab === 'customer') {
      setAddData(["Customer"]);
      setSelectedCustomerData(item || null)
    } else if (activeTab === 'policy') {
      setAddData(["Policy"]);
      setSelectedPolicyData(item || null)
    } else if (activeTab === 'itinerary') {
      setAddData(["Itinerary"]);
      setSelectedItineraryData(item || null)
    } else if (activeTab === 'transport') {
      setAddData(["Transport"]);
      setSelectedTransportData(item || null)
    }
  };

  const handleDelete = (item) => {
    console.log('Deleting:', item);
    // Add delete logic here
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const tabs = [
    { header: 'S.No.', accessor: 'S.No.' },
    { key: 'country', label: 'Country' },
    { key: 'state', label: 'State' },
    { key: 'city', label: 'City' },
    { key: 'hotel', label: 'Hotel' },
    { key: 'customer', label: 'Customer' },
    { key: 'vendor', label: 'Vendor' },
    { key: 'policy', label: 'Policy' },
    { key: 'itinerary', label: 'Itinerary' },
    { key: 'transport', label: 'Transport' },
    // { key: 'department', label: 'Department' },
  ];

  const tableData = {
    country: {
      columns: [
        { header: 'S.No.', accessor: 'index' },
        { header: 'Country Name', accessor: 'countryName' },
        { header: 'Code', accessor: 'code' },
        { header: 'Phone Code', accessor: 'pCode' },
        { header: 'Status', accessor: 'status' },
        { header: 'Action', accessor: 'Action' },
      ],
      data: addIconsToData(countryData, handleStatusToggle),
    },
    state: {
      columns: [
        { header: 'S.No.', accessor: 'index' },
        { header: 'State Name', accessor: 'stateName' },
        { header: 'Country Name', accessor: 'countryName' },
        { header: 'Code', accessor: 'code' },
        { header: 'Status', accessor: 'status' },
        { header: 'Action', accessor: 'Action' },
      ],
      data: addIconsToData(stateData, handleStatusToggle),
    },
    city: {
      columns: [
        { header: 'S.No.', accessor: 'index' },
        { header: 'City Name', accessor: 'destinationName' },
        { header: 'State Name', accessor: 'stateName' },
        { header: 'Country Name', accessor: 'countryName' },
        { header: 'Attractions', accessor: 'keyofattractions' },
        { header: 'Status', accessor: 'status' },
        { header: 'Action', accessor: 'Action' },
      ],
      data: addIconsToData(destinationData, handleStatusToggle),
    },
    hotel: {
      columns: [
        { header: 'S.No.', accessor: 'index' },
        { header: 'Hotel Name', accessor: 'hname' },
        { header: 'Country', accessor: 'countryName' },
        { header: 'State', accessor: 'stateName' },
        { header: 'City', accessor: 'destinationName' },
        { header: 'Address', accessor: 'haddress' },
        { header: 'Status', accessor: 'status' },
        { header: 'Action', accessor: 'Action' },
      ],
      data: addIconsToData(hotelData, handleStatusToggle),
    },
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
    vendor: {
      columns: [
        { header: 'S.No.', accessor: 'index' },
        { header: 'Name', accessor: 'vendorName' },
        { header: 'E-Mail', accessor: 'vendorEmail' },
        { header: 'Contact', accessor: 'vendorContactNo' },
        { header: 'Lead Source', accessor: 'vendorAddress' },
        { header: 'Status', accessor: 'status' },
        { header: 'Action', accessor: 'Action' },
      ],
      data: addIconsToData(vendorData, handleStatusToggle),
    },
    policy: {
      columns: [
        { header: 'S.No.', accessor: 'index' },
        { header: 'Policy Name', accessor: 'policyName' },
        { header: 'Policy Description', accessor: 'policyDescription' },
        { header: 'Status', accessor: 'status' },
        { header: 'Action', accessor: 'Action' },
      ],
      data: addIconsToData(policyData, handleStatusToggle),
    },
    itinerary: {
      columns: [
        { header: 'S.No.', accessor: 'index' },
        { header: 'Destination Name', accessor: 'destination' },
        { header: 'Action', accessor: 'itineraryAction' },
      ],
      data: addIconsToData(itineraryData, handleStatusToggle),
    },
    transport: {
      columns: [
        { header: 'S.No.', accessor: 'index' },
        { header: 'Transport Mode', accessor: 'transportmode' },
        { header: 'Transport Supplier', accessor: 'transportsupplier' },
        { header: 'Price Per Day', accessor: 'priceperday' },
        // { header: 'Status', accessor: 'status' },
        { header: 'Action', accessor: 'Action' },
      ],
      data: addIconsToData(transportData, handleStatusToggle),
    },
  };

  useEffect(() => {
    const fetchCountryData = async () => {
      try {
        const response = await axios.get(`${api.baseUrl}/country/getall?page=${currentPage}&size=10`);
        const formattedData = await response.data.content.map((country) => ({
          ...country,
          status: country.status
        }));
        const newData = await formattedData.map((item, index) => ({
          ...item,
          index: index + 1
        }))
        setCountryData(newData);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error('Error fetching country data:', error);
      }
    };

    const fetchStateData = async () => {
      try {
        const response = await axios.get(`${api.baseUrl}/state/getall?page=${currentPage}&size=10`);
        const formattedData = response.data.content.map((state) => ({
          ...state,
          status: state.status,
          countryName: state.country.countryName
        }));
        const newData = formattedData.map((item, index) => ({
          ...item,
          index: index + 1
        }))
        setStateData(newData);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error('Error fetching state data:', error);
      }
    };

    const fetchDestinationData = async () => {
      try {
        const response = await axios.get(`${api.baseUrl}/destination/getall?page=${currentPage}&size=10`);
        const formattedData = response.data.content.map((item) => ({
          ...item,
          status: item.status,
          countryName: item.country.countryName,
          stateName: item.state.stateName
        }));
        const newData = formattedData.map((item, index) => ({
          ...item,
          index: index + 1
        }))
        setDestinationData(newData);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error('Error fetching state data:', error);
      }
    };

    const fetchHotelData = async () => {
      try {
        const response = await axios.get(`${api.baseUrl}/hotel/getAll?page=${currentPage}&size=10`);
        const formattedData = response.data.map((item) => ({
          ...item,
          status: item.status,
          countryName: item.country.countryName,
          stateName: item.state.stateName,
          destinationName: item.destination.destinationName,
        }));
        const newData = formattedData.map((item, index) => ({
          ...item,
          index: index + 1
        }))
        setHotelData(newData);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error('Error fetching state data:', error);
      }
    }

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

    const fetchVendorData = async () => {
      try {
        const response = await axios.get(`${api.baseUrl}/vendor/getAll?page=${currentPage}&size=10`);
        const newData = response.data.content.map((item, index) => ({
          ...item,
          index: index + 1
        }))
        setVendorData(newData);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error('Error fetching state data:', error);
      }
    }

    const fetchPolicyData = async () => {
      try {
        const response = await axios.get(`${api.baseUrl}/policy/getallpolicy?page=${currentPage}&size=10`);
        const newData = response.data.content.map((item, index) => ({
          ...item,
          index: index + 1
        }))
        setPolicyData(newData);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error('Error fetching state data:', error);
      }
    }

    const fetchItineraryData = async () => {
      try {
        const response = await axios.get(`${api.baseUrl}/itinerarys/getAll?page=${currentPage}&size=10`);
        const newData = response.data.content.map((item, index) => ({
          ...item,
          index: index + 1
        }))
        setItineraryData(newData);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error('Error fetching state data:', error);
      }
    }

    const fetchTransportData = async () => {
      try {
        const response = await axios.get(`${api.baseUrl}/transport/getAll?page=${currentPage}&size=10`);
        const newData = response.data.content.map((item, index) => ({
          ...item,
          index: index + 1
        }));
        setTransportData(newData);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error('Error fetching state data:', error);
      }
    }

    if (activeTab === 'country') {
      fetchCountryData();
    } else if (activeTab === 'state') {
      fetchStateData();
    } else if (activeTab === 'city') {
      fetchDestinationData();
    } else if (activeTab === 'hotel') {
      fetchHotelData();
    } else if (activeTab === 'customer') {
      fetchCustomerData()
    } else if (activeTab === 'vendor') {
      fetchVendorData()
    } else if (activeTab === 'policy') {
      fetchPolicyData();
    } else if (activeTab === 'itinerary') {
      fetchItineraryData();
    } else if (activeTab === 'transport') {
      fetchTransportData();
    }
    // } else if (activeTab === 'department') {
    //   fetchDepartmentData()
    // }
  }, [activeTab, currentPage]);

  return (
    <>
      <div className="h-24 mb-10 w-full p-4 bg-gray-50">
        <div className="pb-1 flex justify-between">
          <h2 className="text-xl font-bold mb-6">Master List</h2>
          <div className="relative" ref={dropdownRef}>
            {/* <button className="flex items-center justify-center bg-red-500  text-white p-2 rounded-md hover:bg-red-700 mt-2 md:mt-0 md:ml-2"
              onClick={
                () => {
                  setAddData([`${activeTab[0].toUpperCase()}${activeTab.substring(1)}`])
                }
              }
            >
              New {`${activeTab[0].toUpperCase()}${activeTab.substring(1)}`}
            </button> */}
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
                  case 'country':
                    setSelectedCountry(null);
                    break;
                  case 'state':
                    setSelectedState(null);
                    break;
                  case 'city':
                    setSelectedDestination(null);
                    break;
                  case 'department':
                    setSelectedDepartment(null);
                    break;
                  case 'hotel':
                    setSelectedHotelData(null);
                    break;
                  case 'vendor':
                    setSelectedVendorData(null);
                    break;
                  case 'customer':
                    setSelectedCustomerData(null);
                    break;
                  case 'policy':
                    setSelectedPolicyData(null);
                    break;
                  case 'itinerary':
                    setSelectedItineraryData(null);
                    break;
                  case 'transport':
                    setSelectedTransportData(null);
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
      {/* Submenu Components */}
      <div
        className="submenu-menu"
        style={{ right: addData[0] === "Vendors" ? "0" : "-100%" }}
      >
        <NewVendorForm
          isOpen={addData[0] === "Vendors"}
          onClose={() => setAddData([])}
        />
      </div>
      <div
        className="submenu-menu"
        style={{ right: addData[0] === "NewPackageForm" ? "0" : "-100%" }}
      >
        <NewPackageForm
          isOpen={addData[0] === "NewPackageForm"}
          onClose={() => setAddData([])}
        />
      </div>
      <div
        className="submenu-menu"
        style={{ right: addData[0] === "Transportation" ? "0" : "-100%" }}
      >
        <NewTransportationForm
          isOpen={addData[0] === "Transportation"}
          onClose={() => setAddData([])}
        />
      </div>
      <div
        className="submenu-menu"
        style={{ right: addData[0] === "Country" ? "0" : "-100%" }}
      >
        <Country
          isOpen={addData[0] === "Country"}
          onClose={() => setAddData([])}
          countryData={selectedCountry}
          isFormEditEnabled={isFormEditEnabled}
          setIsFormEditEnabled={setIsFormEditEnabled}
        />
      </div>
      <div
        className="submenu-menu"
        style={{ right: addData[0] === "State" ? "0" : "-100%" }}
      >
        <State
          isOpen={addData[0] === "State"}
          onClose={() => setAddData([])}
          stateData={selectedState}
          isFormEditEnabled={isFormEditEnabled}
          setIsFormEditEnabled={setIsFormEditEnabled}
        />
      </div>
      <div
        className="submenu-menu"
        style={{ right: addData[0] === "City" ? "0" : "-100%" }}
      >
        <Destination
          isOpen={addData[0] === "City"}
          onClose={() => setAddData([])}
          destinationData={selectedDestination}
          isFormEditEnabled={isFormEditEnabled}
          setIsFormEditEnabled={setIsFormEditEnabled}
        />
      </div>
      <div
        className="submenu-menu"
        style={{ right: addData[0] === "Department" ? "0" : "-100%" }}
      >
        <Department
          isOpen={addData[0] === "Department"}
          onClose={() => setAddData([])}
          departmentData={selectedDepartment}
          isFormEditEnabled={isFormEditEnabled}
          setIsFormEditEnabled={setIsFormEditEnabled}
        />
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
      <div
        className="submenu-menu"
        style={{ right: addData[0] === "Hotel" ? "0" : "-100%" }}
      >
        <Hotel
          isOpen={addData[0] === "Hotel"}
          onClose={() => setAddData([])}
          selectedHotelData={selectedHotelData}
          isFormEditEnabled={isFormEditEnabled}
          setIsFormEditEnabled={setIsFormEditEnabled}
        />
      </div>
      <div
        className="submenu-menu"
        style={{ right: addData[0] === "Vendor" ? "0" : "-100%" }}
      >
        <NewVendorForm
          isOpen={addData[0] === "Vendor"}
          onClose={() => setAddData([])}
          selectedVendorData={selectedVendorData && selectedVendorData}
          isFormEditEnabled={isFormEditEnabled}
          setIsFormEditEnabled={setIsFormEditEnabled}
        />
      </div>
      <div
        className="submenu-menu"
        style={{ right: addData[0] === "Policy" ? "0" : "-100%" }}
      >
        <NewPolicyForm
          isOpen={addData[0] === "Policy"}
          onClose={() => setAddData([])}
          selectedPolicyData={selectedPolicyData && selectedPolicyData}
          isFormEditEnabled={isFormEditEnabled}
          setIsFormEditEnabled={setIsFormEditEnabled}
        />
      </div>
      <div
        className="submenu-menu"
        style={{ right: addData[0] === "Transport" ? "0" : "-100%" }}
      >
        <NewTransportationForm
          isOpen={addData[0] === "Transport"}
          onClose={() => setAddData([])}
          selectedTransportData={selectedTransportData && selectedTransportData}
          isFormEditEnabled={isFormEditEnabled}
          setIsFormEditEnabled={setIsFormEditEnabled}
        />
      </div>
      <div
        className="submenu-menu"
        style={{ right: addData[0] === "Itinerary" ? "0" : "-100%" }}
      >
        <Itinerary
          isOpen={addData[0] === "Itinerary"}
          onClose={() => setAddData([])}
          selectedItineraryData={selectedItineraryData && selectedItineraryData}
          isFormEditEnabled={isFormEditEnabled}
          setIsFormEditEnabled={setIsFormEditEnabled}
        />
      </div>
    </>
  );
};

export default MasterList;
