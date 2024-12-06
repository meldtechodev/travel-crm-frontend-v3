import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaCaretDown, FaFilter, FaSort, FaArrowsAltH, FaPlus, FaEdit, FaTrashAlt, FaSearch } from "react-icons/fa";
import axios from "axios";
import api from "../apiConfig/config";
import TableComponent from '../component/TableComponent';
import { IoArrowBack, IoArrowForward } from "react-icons/io5";
import { FiFilter } from "react-icons/fi";
import NewPackageForm from "./NewPackageForm";

// The main dashboard component
const PackageDashboard = () => {
  const [isListViewSelected, setIsListViewSelected] = useState(false);

  return (
    <div
      className="myteams-container w-full h-full"
    // style={{ marginLeft: "100px" }}
    >
      <div className="flex flex-col md:flex-row justify-between h-full bg-gray-100 border-b border-gray-300 mb-5">
        <main className="bg-gray-100 flex-1 p-4">
          <PackageDashboardTab
            isListViewSelected={isListViewSelected}
            setIsListViewSelected={setIsListViewSelected}
          />

          {/* Conditional Rendering of Views */}
          {isListViewSelected ? <ListView /> : <KanbanBoard />}
        </main>
      </div>
    </div>
  );
};

// Kanban Board Component
const KanbanBoard = () => (
  <>
    {/* Task Sections */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 mt-4">
      <div className="bg-blue-100 border-l-4 border-blue-500 p-4 rounded-md">
        <p className="text-gray-600 font-bold">Confirmed</p>
        <p className="text-lg">7 Tasks 0/0</p>
      </div>
      <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded-md">
        <p className="text-gray-600 font-bold">In Progress</p>
        <p className="text-lg">5 Tasks 0/0</p>
      </div>
      <div className="bg-pink-100 border-l-4 border-pink-500 p-4 rounded-md">
        <p className="text-gray-600 font-bold">Needs Approval</p>
        <p className="text-lg">2 Tasks 0/0</p>
      </div>
      <div className="bg-green-100 border-l-4 border-green-500 p-4 rounded-md">
        <p className="text-gray-600 font-bold">Completed</p>
        <p className="text-lg">1 Tasks 0/0</p>
      </div>
    </div>

    {/* Tasks in scrollable columns */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
      <ScrollableTaskColumn />
      <ScrollableTaskColumn />
      <ScrollableTaskColumn />
      <ScrollableTaskColumn />
    </div>
  </>
);

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

// List View 
const ListView = () => {
  const navigate = useNavigate();
  const [packageList, setPackageList] = useState([])
  const [packageThemeList, setPackageThemeList] = useState([])
  const [destination, setDestination] = useState([])
  const [packIti, setPackIti] = useState([])
  const [packItiDetail, setPackItiDetail] = useState([])
  const [hotelList, setHotelList] = useState([])
  const [packageTheme, setPackageTheme] = useState([])
  const [packD, setPackD] = useState([])
  const [siteSeeings, setSiteSeeings] = useState([])
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [addData, setAddData] = useState([])
  const [toggleSwitch, setToggleSwitch] = useState(true);

  const handleStatusToggle = (id) => {
    setPackageList((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, status: !item.status } : item
      )
    );
  };

  const columns = [
    { header: 'S. No.', accessor: 'index' },
    { header: "Package Name", accessor: "pkName" },
    { header: "From City", render: ({ row }) => ViewDestination(row.fromCityId) },
    { header: "To City", render: ({ row }) => ViewDestination(row.toCityId) },
    { header: "Category", accessor: "pkCategory" },
    { header: "Type", accessor: "packageType" },
    { header: 'Status', render: (({row}) => <div className="flex items-center justify-center">
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={row.status}
        onChange={() => handleStatusToggle(row.id)}
      />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:bg-green-500 dark:bg-gray-300 dark:peer-focus:ring-green-800">
        <div
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${row.status ? "translate-x-5" : ""
            }`}
        ></div>
      </div>
    </label>
  </div> ) },
    { header: "Days/Nights", render: ({ row }) => `${row.days}/${row.nights}` },
    {
      header: "Action",
      render: (row) => (
        <div className="flex gap-2 justify-center">
          <FaEdit
            className="text-purple-600 cursor-pointer"
          onClick={() => setAddData(['New Package'])}
          />
          <FaTrashAlt
            className="text-red-600 cursor-pointer"
          // onClick={() => handleDelete(item)}
          />
        </div>
      )
    },
  ]

  const handleView = (option) => {
    const pack = packIti.filter(item => option.id === item.packid)
    option.itinary = pack

    let p = []
    for (let i = 0; i < pack.length; i++) {
      let k = packItiDetail.filter(item => item.packitid.id === pack[i].id)
      p.push(k[0])
    }

    let k = p.filter(item => item !== undefined)
    let site = []
    for (let i = 0; i < k.length; i++) {
      site.push(...k[i].sightseeingIds)
    }

    let newSet = new Set(site)
    let siteSeeing = []
    let site1 = [...newSet]
    // console.log(site1)
    for (let i = 0; i < site1.length; i++) {
      let j = siteSeeings.filter(item => item.id === site1[i])[0]
      siteSeeing.push(j)
    }

    let h = []
    let roomT = []
    for (let i = 0; i < k.length; i++) {
      let newH = hotelList.filter(item => item.id === k[i].roomtypes.hotel.id)
      let filRoom = hotelList.map(item => item.id === k[i].roomtypes.hotel.id ? item : '')
      let newFilRoom = filRoom
      h.push(newH[0])
    }
    let hset = new Set(h)
    let harr = [...hset]
    option.packItiDetail = k
    option.sightseeingIds = newSet
    option.sightseeings = siteSeeing
    option.hotels = harr
    navigate(`/home/package-list/${option.id}`, { state: { option } })
  }

  useEffect(() => {
    const fetchData = async () => {
      await axios.get(`${api.baseUrl}/sightseeing/getAll`)
        .then((response) => {
          setSiteSeeings(response.data)
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
      return
    }
    fetchData()
  }, []);

  const ViewTheme = (data) => {
    // setPackageTheme([])
    // const arr = data.split(",").map(Number);  // Result: [1, 2, 3]packageTheme/getall
    // let total = []
    // for (let i = 0; i < arr.length; i++) {
    //   const filterlist = packageThemeList.filter(item => item.id === arr[i])
    //   //   let d = filterlist[0]?.title
    //   total.push(filterlist[0])
    //   console.log(filterlist[0])
    // }
    // console.log(arr)
    // // setPackageTheme(total)
    // return packageTheme.length === 0 ? '' : total.map(item => item.title).join(", ")
  }

  const ViewDestination = (view) => {
    let d = destination.filter(item => item.id === view)
    let k = d[0]
    return d.length === 0 ? '' : k.destinationName
  }

  useEffect(() => {
    const fetchData = async () => {
      await axios.get(`${api.baseUrl}/packageitinerary/getAll`)
        .then((response) => {
          setPackIti(response.data)
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
      return
    };
    fetchData()
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      await axios.get(`${api.baseUrl}/packageitinerarydetails/getAll`)
        .then((response) => {
          setPackItiDetail(response.data)
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        })
      return
    }
    fetchData()
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      await axios.get(`${api.baseUrl}/packageTheme/getall`)
        .then((response) => {
          setPackageThemeList(response.data);
        })
        .catch(error => console.error(error))
      return
    }
    fetchData()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      await axios.get(`${api.baseUrl}/hotel/getAll`)
        .then((response) => {
          setHotelList(response.data);
        })
        .catch(error => console.error(error))
      return
    }
    fetchData()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      await axios.get(`${api.baseUrl}/destination/getall`)
        .then((response) => {
          setDestination(response.data.content)
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
      return
    }
    fetchData()
  }, []);


  useEffect(() => {
    const fetchData = async () => {
      await axios.get(`${api.baseUrl}/packages/getAll?page=${currentPage}&size=10`)
        .then((response) => {
          setPackageList(response.data.content.map((item, index) => {
            return {
              ...item,
              index: index + 1,
              status: item.status,
            }
          }));
          setTotalPages(response.data.totalPages);
        })
        .catch(error => console.error(error));
      return
    }
    fetchData()
  }, [currentPage])

  return (
    <>

    <div className='mt-4'>
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
        <button className="flex items-center justify-center bg-blue-500  text-white p-2 rounded-md hover:bg-blue-600 mt-2 md:mt-0 md:ml-2" onClick={() => setAddData(['New Package'])}>New Package +</button>
      </div>

      <hr className="my-4" />
      <div className='mt-4'>
        <TableComponent
          columns={columns}
          data={packageList}
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
    <div
        className="submenu-menu"
        style={{ right: addData[0] === 'New Package' ? "0" : "-100%" }}
      >
        <NewPackageForm
          isOpen={addData[0] === 'New Package'}
          onClose={() => setAddData('')}
        />
      </div>
    </>
  )
};

// Task Column Component
const TaskColumn = ({ title, taskCount, taskStatus }) => (
  <div className="bg-white rounded-lg shadow-md p-4">
    <h6 className="text-xl font-semibold">{title}</h6>
    <p className="text-gray-600">
      {taskCount} Tasks
      <br />
      {taskStatus}
    </p>
  </div>
);

// Scrollable Task Column Component
const ScrollableTaskColumn = () => (
  <div className="bg-white rounded-lg shadow-md p-4 h-96 overflow-y-auto">
    {/* Individual Tasks */}
    {Array.from({ length: 5 }, (_, idx) => (
      <div key={idx} className="mb-4">
        <p className="font-semibold">
          Gather feedback on the design and usability
        </p>
        <p className="text-sm text-gray-500">
          Project: Web Design - Landmark Developments
        </p>
        <button className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs">
          on hold
        </button>
        <div className="flex items-center mt-2">
          <a
            href="#"
            className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
          >
            p
          </a>
          <p className="ml-2 text-sm text-gray-600">in 2 weeks</p>
        </div>
      </div>
    ))}
  </div>
);

// PackageDashboardTab Component
const PackageDashboardTab = ({ isListViewSelected, setIsListViewSelected }) => {
  const [workflowDropdown, setWorkflowDropdown] = useState(false);
  const [createTaskDropdown, setCreateTaskDropdown] = useState(false);
  const [plusDropdown, setPlusDropdown] = useState(false);
  const [towerDropdown, setTowerDropdown] = useState(false);
  const [arrowsDropdown, setArrowsDropdown] = useState(false);
  const [addData, setAddData] = useState([])

  const workflowRef = useRef(null);
  const createTaskRef = useRef(null);
  const plusRef = useRef(null);
  const towerRef = useRef(null);
  const arrowsRef = useRef(null);

  const handleClickOutside = (event, setter, ref) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setter(false);
    }
  };

  // Handle clicks outside the workflow dropdown
  useEffect(() => {
    const handleClick = (event) =>
      handleClickOutside(event, setWorkflowDropdown, workflowRef);
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [workflowRef]);

  // Handle clicks outside the create task dropdown
  useEffect(() => {
    const handleClick = (event) =>
      handleClickOutside(event, setCreateTaskDropdown, createTaskRef);
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [createTaskRef]);

  // Handle clicks outside the plus dropdown
  useEffect(() => {
    const handleClick = (event) =>
      handleClickOutside(event, setPlusDropdown, plusRef);
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [plusRef]);

  // Handle clicks outside the sort dropdown
  useEffect(() => {
    const handleClick = (event) =>
      handleClickOutside(event, setTowerDropdown, towerRef);
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [towerRef]);

  // Handle clicks outside the arrows dropdown
  useEffect(() => {
    const handleClick = (event) =>
      handleClickOutside(event, setArrowsDropdown, arrowsRef);
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [arrowsRef]);

  const ShowPackage = () => {
    setAddData(['NewPackageForm'])
  }

  return (
    <>
      <div className="flex flex-col gap-3 justify-between items-center py-4 bg-white shadow-md px-6 rounded-md lg:flex-row sm:flex-col">
        <h2 className="text-xl font-bold">Packages</h2>

        <div className="flex items-center">
          <button
            className={`btn ${!isListViewSelected
              ? "bg-blue-500 text-white"
              : "bg-white border border-gray-300 hover:bg-gray-100 text-gray-800"
              } py-2 px-4 rounded-md mr-2`}
            onClick={() => setIsListViewSelected(false)}
          >
            Package Board
          </button>
          <button
            className={`btn ${isListViewSelected
              ? "bg-blue-500 text-white"
              : "bg-white border border-gray-300 hover:bg-gray-100 text-gray-800"
              } py-2 px-4 rounded-md`}
            onClick={() => setIsListViewSelected(true)}
          >
            List View
          </button>
        </div>

        <div className="flex items-center">

          <div className="relative ml-2" ref={createTaskRef}>
            <button
              className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 py-2 px-4 rounded-md flex items-center"
              onClick={() => setCreateTaskDropdown(!createTaskDropdown)}
            >
              Create <FaCaretDown className="ml-2" />
            </button>
            {createTaskDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <a
                  // href="#task1"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:cursor-pointer"
                  onClick={ShowPackage}
                >
                  Create Package
                </a>
                <a
                  href="#task2"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Create task from template
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PackageDashboard;
