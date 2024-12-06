import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Table from './TableComponent';
import { useNavigate } from 'react-router-dom';
import api from '../apiConfig/config';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import NewVendorForm from "../pages/NewVendorForm";
import NewPackageForm from "../pages/NewPackageForm";
import NewTransportationForm from "../pages/NewTransportationForm";
import Country from './Country';
import State from './State';
import Destination from './Destination';
import Department from './Department'
import { toast } from 'react-toastify';



const MasterList = () => {
  const [activeTab, setActiveTab] = useState('country');
  const [countryData, setCountryData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [destinationData, setDestinationData] = useState([]);
  const [hotelData, setHotelData] = useState([]);
  const [customerData, setCustomerData] = useState([]);
  const [vendorData, setVendorData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [addData, setAddData] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [isFormEditEnabled, setIsFormEditEnabled] = useState(false);
  const navigate = useNavigate()

  // Reusable ToggleSwitch Component
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
    data.map((item) => ({
      ...item,
      status: (
        <ToggleSwitch
          isOn={item.status === 'Active'}
          handleToggle={() => updateStatus(item)}
        />
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
  const fetchData = async (endpoint, setData, updateStatus) => {
    try {
      const response = await axios.get(`${api.baseUrl}/${endpoint}`);
      const formattedData = await response.data.map((item) => ({
        ...item,
        status: item.status ? 'Active' : 'Inactive',
      }));
      setData(addIconsToData(formattedData, updateStatus));
    } catch (error) {
      console.error(`Error fetching ${endpoint} data:`, error);
    }
  };

  const handleStatusToggle = async (item) => {
    const updatedStatus = item.status === 'Active' ? 'Inactive' : 'Active';  // Toggle the status

    const updatedItem = { ...item, status: updatedStatus };

    if (activeTab === 'country') {
      setCountryData(prevData => prevData.map(i => (i.id === item.id ? updatedItem : i)));
    } else if (activeTab === 'state') {
      setStateData(prevData => prevData.map(i => (i.id === item.id ? updatedItem : i)));
    } else if (activeTab === 'destination') {
      setDestinationData(prevData => prevData.map(i => (i.id === item.id ? updatedItem : i)));
    } else if (activeTab === 'hotel') {
      setHotelData(prevData => prevData.map(i => (i.id === item.id ? updatedItem : i)));
    } else if (activeTab === 'customer') {
      setCustomerData(prevData => prevData.map(i => (i.id === item.id ? updatedItem : i)));
    } else if (activeTab === 'vendor') {
      setVendorData(prevData => prevData.map(i => (i.id === item.id ? updatedItem : i)));
    }

    try {
      const response = await axios.put(`${api.baseUrl}/${activeTab}/updatebyid/${item.id}`, {
        status: updatedStatus
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
      } else if (activeTab === 'destination') {
        setDestinationData(prevData => prevData.map(i => (i.id === item.id ? { ...item } : i)));
      } else if (activeTab === 'hotel') {
        setHotelData(prevData => prevData.map(i => (i.id === item.id ? { ...item } : i)));
      } else if (activeTab === 'customer') {
        setCustomerData(prevData => prevData.map(i => (i.id === item.id ? { ...item } : i)));
      } else if (activeTab === 'vendor') {
        setVendorData(prevData => prevData.map(i => (i.id === item.id ? { ...item } : i)));
      }
    }
  };


  const handleEdit = (item) => {
    console.log('Editing:', item);

    if (activeTab === 'country') {
      setAddData(["Country"]);
      setSelectedCountry(item);
    } else if (activeTab === 'state') {
      setSelectedState(item);
      setAddData(["State"]);
    } else if (activeTab === 'destination') {
      setAddData(["Destination"]);
      setSelectedDestination(item);
    } else if (activeTab === 'department') {
      setAddData(["Department"]);
      setSelectedDepartment(item);
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

  useEffect(() => {
    switch (activeTab) {
      case 'country':
        fetchData('country/get', setCountryData, handleStatusToggle);
        break;
      case 'state':
        fetchData('state/get', setStateData, handleStatusToggle);
        break;
      case 'destination':
        fetchData('destination/get', setDestinationData, handleStatusToggle);
        break;
      case 'hotel':
        fetchData('hotel/get', setHotelData, handleStatusToggle);
        break;
      case 'customer':
        fetchData('customer/get', setCustomerData, handleStatusToggle);
        break;
      case 'vendor':
        fetchData('vendor/get', setVendorData, handleStatusToggle);
        break;
      case 'department':
        fetchData('department/get', setVendorData, handleStatusToggle);
        break;
      default:
        break;
    }
  }, [activeTab]);


  const tabs = [
    { header: 'S.No.', accessor: 'S.No.' },
    { key: 'country', label: 'Country' },
    { key: 'state', label: 'State' },
    { key: 'destination', label: 'Destination' },
    { key: 'hotel', label: 'Hotel' },
    { key: 'customer', label: 'Customer' },
    { key: 'vendor', label: 'Vendor' },
    { key: 'department', label: 'Department' },
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
    destination: {
      columns: [
        { header: 'S.No.', accessor: 'index' },
        { header: 'Destination Name', accessor: 'destinationName' },
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
    department: {
      columns: [
        { header: 'S.No.', accessor: 'index' },
        { header: 'Name', accessor: 'departmentName' },
        { header: 'Status', accessor: 'status' },
        { header: 'Action', accessor: 'Action' },
      ],
      data: addIconsToData(departmentData, handleStatusToggle)
    },
  };

  useEffect(() => {
    const fetchCountryData = async () => {
      try {
        const response = await axios.get(`${api.baseUrl}/country/getall`);
        const formattedData = await response.data.map((country) => ({
          ...country,
          status: country.status ? 'Active' : 'Inactive'
        }));
        const sortedData = await formattedData.sort((a, b) => {
          return a.countryName.localeCompare(b.countryName);  // Replace 'name' with the key to sort by
        });
        const newData = await sortedData.map((item, index) => ({
          ...item,
          index: index + 1
        }))
        setCountryData(newData);
      } catch (error) {
        console.error('Error fetching country data:', error);
      }
    };

    const fetchStateData = async () => {
      try {
        const response = await axios.get(`${api.baseUrl}/state/get`);
        const formattedData = response.data.map((state) => ({
          ...state,
          status: state.status ? 'Active' : 'Inactive',
          countryName: state.country.countryName
        }));
        const sortedData = formattedData.sort((a, b) => {
          return a.stateName.localeCompare(b.stateName);  // Replace 'name' with the key to sort by
        });
        const newData = sortedData.map((item, index) => ({
          ...item,
          index: index + 1
        }))
        setStateData(newData);
      } catch (error) {
        console.error('Error fetching state data:', error);
      }
    };

    const fetchDestinationData = async () => {
      try {
        const response = await axios.get(`${api.baseUrl}/destination/getall`);
        const formattedData = response.data.map((item) => ({
          ...item,
          status: item.status ? 'Active' : 'Inactive',
          countryName: item.country.countryName,
          stateName: item.state.stateName
        }));
        const sortedData = formattedData.sort((a, b) => {
          return a.destinationName.localeCompare(b.destinationName);  // Replace 'name' with the key to sort by
        });
        const newData = sortedData.map((item, index) => ({
          ...item,
          index: index + 1
        }))
        setDestinationData(newData);
      } catch (error) {
        console.error('Error fetching state data:', error);
      }
    };

    const fetchHotelData = async () => {
      try {
        const response = await axios.get(`${api.baseUrl}/hotel/getAll`);
        const formattedData = response.data.map((item) => ({
          ...item,
          status: item.status ? 'Active' : 'Inactive',
          countryName: item.country.countryName,
          stateName: item.state.stateName,
          destinationName: item.destination.destinationName,
        }));
        const sortedData = formattedData.sort((a, b) => {
          return a.hname.localeCompare(b.hname);  // Replace 'name' with the key to 
        });
        const newData = sortedData.map((item, index) => ({
          ...item,
          index: index + 1
        }))
        setHotelData(newData);
      } catch (error) {
        console.error('Error fetching state data:', error);
      }
    }

    const fetchCustomerData = async () => {
      try {
        const response = await axios.get(`${api.baseUrl}/customer/getall`);
        const formattedData = response.data.map((item) => ({
          ...item,
          status: item.status ? 'Active' : 'Inactive',
          firstName: item.fName,
          lastName: item.lName,
          email: item.emailId,
          leadSource: item.leadSource,
        }));
        const sortedData = formattedData.sort((a, b) => {
          return a.firstName.localeCompare(b.firstName);  // Replace 'name' with the key to 
        });
        const newData = sortedData.map((item, index) => ({
          ...item,
          index: index + 1
        }))
        setCustomerData(newData);
      } catch (error) {
        console.error('Error fetching state data:', error);
      }
    }

    const fetchVendorData = async () => {
      try {
        const response = await axios.get(`${api.baseUrl}/vendor/getAll`);
        const sortedData = response.data.sort((a, b) => {
          return a.vendorName.localeCompare(b.vendorName);  // Replace 'name' with the key to 
        });
        const newData = sortedData.map((item, index) => ({
          ...item,
          index: index + 1
        }))
        setVendorData(newData);
      } catch (error) {
        console.error('Error fetching state data:', error);
      }
    }

    const fetchDepartmentData = async () => {
      try {
        const response = await axios.get(`${api.baseUrl}/departments/getAll`);
        const formattedData = await response.data.map((item) => ({
          ...item,
          status: item.status ? 'Active' : 'Inactive'
        }));
        const sortedData = await formattedData.sort((a, b) => {
          return a.departmentName.localeCompare(b.departmentName);  // Replace 'name' with the key to sort by
        });
        const newData = await sortedData.map((item, index) => ({
          ...item,
          index: index + 1
        }))
        setDepartmentData(newData);
      } catch (error) {
        console.error('Error fetching country data:', error);
      }
    };



    if (activeTab === 'country') {
      fetchCountryData();
    } else if (activeTab === 'state') {
      fetchStateData();
    } else if (activeTab === 'destination') {
      fetchDestinationData();
    } else if (activeTab === 'hotel') {
      fetchHotelData();
    } else if (activeTab === 'customer') {
      fetchCustomerData()
    } else if (activeTab === 'vendor') {
      fetchVendorData()
    } else if (activeTab === 'department') {
      fetchDepartmentData()
    }
  }, [activeTab]);

  return (
    <>
      <div className="h-24 mb-10 w-full p-4 bg-gray-50">
        <div className="pb-1 flex justify-between">
          <h2 className="text-xl font-bold mb-6">Master List</h2>
          <div className="relative" ref={dropdownRef}>
            <span
              className="text-black text-3xl md:text-3xl cursor-pointer flex"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              +
            </span>
            {dropdownOpen && (
              <div className="absolute top-10 right-0 w-48 bg-white shadow-lg rounded-md  text-black">
                <ul className="space-y-2">
                  <li
                    className="hover:bg-gray-200  hover:border-l-4  border-blue-500 p-2 rounded cursor-pointer"
                    onClick={() => {
                      setAddData([]);
                      setAddData(["Vendors"]);
                    }}
                  >
                    New Vendors
                  </li>
                  <li className="hover:bg-gray-200  hover:border-l-4  border-blue-500 p-2 rounded cursor-pointer">
                    New Customer
                  </li>
                  <li
                    className="hover:bg-gray-200  hover:border-l-4  border-blue-500 p-2 rounded cursor-pointer"
                    onClick={() => {
                      setAddData([]);
                      setAddData(["NewPackageForm"]);
                    }}
                  >
                    New Package
                  </li>
                  <li
                    className="hover:bg-gray-200  hover:border-l-4  border-blue-500 p-2 rounded cursor-pointer"
                    onClick={() => {
                      setAddData([]);
                      setAddData(["Transportation"]);
                    }}
                  >
                    New Transportation
                  </li>
                  <hr className="border-gray-300" />
                  <li
                    className="hover:bg-gray-200  hover:border-l-4  border-blue-500 p-2 rounded cursor-pointer"
                    onClick={() => {
                      setAddData([]);
                      setAddData(["NewMember"]);
                    }}
                  >
                    New Member
                  </li>
                </ul>
              </div>
            )}
          </div>

        </div>
        <div className="relative inline-block w-full  border-b">
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
          <hr />
          <div className='w-full  overflow-auto'>
            <Table
              columns={tableData[activeTab].columns}
              data={tableData[activeTab].data}
            />
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
      {/* <div
        className="submenu-menu"
        style={{ right: addData[0] === "NewMember" ? "0" : "-100%" }}
      >
        <NewMember
          isOpen={addData[0] === "NewMember"}
          onClose={() => setAddData([])}
        />
      </div> */}
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
        style={{ right: addData[0] === "Destination" ? "0" : "-100%" }}
      >
        <Destination
          isOpen={addData[0] === "Destination"}
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
    </>
  );
};

export default MasterList;
