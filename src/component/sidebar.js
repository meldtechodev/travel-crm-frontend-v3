import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// Icons
import { FaArrowRight, FaHome, FaListAlt, FaUserTie, FaListUl } from "react-icons/fa";
import { FiPackage } from "react-icons/fi";
import { TbChecklist } from "react-icons/tb";
import { IoIosPeople, IoMdAdd } from "react-icons/io";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { FcSalesPerformance } from "react-icons/fc";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { BsGraphUpArrow } from "react-icons/bs";

// Pages
import { CiSettings } from "react-icons/ci";
import Department from "../pages/Department";
import Designation from "../pages/Designation";
import NewCompanyForm from "../pages/NewCompanyForm";
import axios from "axios";
import api from "../apiConfig/config";

const Sidebar = () => {
  const [homeStyle, setHomeStyle] = useState();
  const [addData, setAddData] = useState();
  const [module, setModule] = useState([])

  useEffect(() => {
    axios.get(`${api.baseUrl}/modules/getall`)
      .then(response =>
        setModule(response.data))
      .catch(error =>
        console.error(error)
      )
  }, [])
  const navigate = useNavigate();

  return (
    <>
      <div
        className="sidebar w-18 h-[calc(100vh-3rem)] bg-gradient-to-b from-[#db272e] to-[#5b2727] text-white py-2 truncate px-auto flex flex-col justify-between"
        style={{ zIndex: "2" }}
      >
        <div
          className="sidebar-menu flex flex-col justify-between items-center space-y-4 overflow-x-hidden overflow-y-auto">
          {/* Sidebar Home Item */}
          <div className="sidebar-item group relative">
            <div
              className="sidebar-icons flex flex-col justify-center items-center rounded cursor-pointer m-0 p-0  w-full"
              style={{ minWidth: "100%" }}
              onMouseEnter={() => setHomeStyle("Home")}
              onMouseLeave={() => setHomeStyle()}>
              <FaHome
                size="30px"
                color={homeStyle === "Home" ? "#fff" : "#B4B4B8"}
              />
              <p
                className={`menu-name text-[14px] mt-2 ${homeStyle === "Home" ? "text-white" : "text-[#B4B4B8]"
                  } `}
              >
                Home
              </p>
            </div>
            {/* Animated Submenu */}
            <div
              className="submenu fixed left-20 top-10 h-screen pointer-events-none transform opacity-0 scale-95 transition-all duration-500 ease-in-out group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto bg-[#f9f9f9] text-[#333338] p-4 z-2 rounded shadow-lg space-y-2 mt-2"
              style={{ width: "340px" }}
            >
              <div className="flex flex-col">
                <p className="font-bold text-lg">Home</p>
                {module.map((item, i) =>
                  (item.moduleName === 'Quickstart' || item.moduleName === 'Dashboard') ?
                    (<Link to={`/home/${item.moduleName}`}>
                      <button class="w-[90%] mt-6 p-4 flex justify-between items-center bg-gradient-to-r from-[#FFF9F9] to-[#F7C6C6]  cursor-pointer border-none text-left shadow-md my-3">
                        {item.moduleName}
                      </button>
                    </Link>) : <></>
                )}
                {/* </Link> */}
              </div>
            </div>
          </div>

          {/* Sidebar Packages Item */}
          {module.map((items, i) =>
            ((items.moduleName !== 'Quickstart' && items.moduleName !== 'Dashboard') && items.parentId === 0) ?
              (<div className="sidebar-item group relative hover:w-full">
                <div
                  className="sidebar-icons flex flex-col justify-center  items-center p-2 rounded cursor-pointer hover:color-black"
                  style={{ zIndex: "2" }}
                  onMouseEnter={() => setHomeStyle(items.moduleName)}
                  onMouseLeave={() => setHomeStyle()}
                >
                  <FiPackage
                    size="30px"
                    color={homeStyle === items.moduleName ? "#fff" : "#B4B4B8"}
                  />
                  <p
                    className={`menu-name text-[14px] mt-2 ${homeStyle === items.moduleName ? "text-white" : "text-[#B4B4B8]"} `}
                  >
                    {items.moduleName}
                  </p>
                </div>
                <div className="submenu fixed left-20 top-10 h-screen pointer-events-none transform opacity-0 scale-95 transition-all duration-500 ease-in-out group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto bg-[#f9f9f9] text-black p-4 rounded shadow-lg space-y-2 mt-2"
                  style={{ width: "340px" }} >
                  <div className="flex flex-col">
                    <p className="font-bold text-lg">{items.moduleName}</p>
                    <div className="mt-4 border-b-2">
                      <h6 className="flex  gap-4 items-center">
                        <FaListUl size="18px" />
                        {items.moduleName} List
                      </h6>
                    </div>
                    <div className="mt-6 flex flex-col justify-center items-center">
                      {module.map(item => (items.id === item.parentId) ? (<button
                        class="w-[90%] p-4 flex justify-between items-center bg-gradient-to-r from-[#FFF9F9] to-[#F7C6C6]  cursor-pointer border-none text-left shadow-md my-2"
                        onClick={() => {
                          setAddData();
                          setAddData(item.moduleName);
                        }}>
                        {item.moduleName}
                        <span>
                          <IoMdAdd size="16px" />
                        </span>
                      </button>) : <></>)}
                      {/* <button class="w-[90%] p-4 flex justify-between items-center bg-gradient-to-r from-[#FFF9F9] to-[#F7C6C6]  cursor-pointer border-none text-left shadow-md my-2">
                        Ouick Package
                        <span>
                          <IoMdAdd size="16px" />
                        </span>
                      </button>
                      <Link to="/home/packageDashboard" className="w-[90%]">
                        <button class="w-full p-4 flex justify-between items-center bg-gradient-to-r from-[#FFF9F9] to-[#F7C6C6]  cursor-pointer border-none text-left shadow-md my-2">
                          Packages Dashboard
                        </button>
                      </Link> */}
                    </div>
                  </div>
                </div>
              </div>) : <></>
          )}

          {/* <div className="sidebar-item group relative hover:w-full">
            <div
              className="sidebar-icons flex flex-col justify-center  items-center p-2 rounded cursor-pointer"
              onMouseEnter={() => setHomeStyle(["Bookings"])}
              onMouseLeave={() => setHomeStyle([])}
            >
              <TbChecklist
                size="30px"
                color={homeStyle[0] === "Bookings" ? "#fff" : "#B4B4B8"}
              />
              <p
                className={`menu-name text-[14px] mt-2 ${homeStyle[0] === "Bookings" ? "text-white" : "text-[#B4B4B8]"
                  } `}
              >
                Bookings
              </p>
            </div>
            <div
              className="submenu fixed left-20 top-10 h-screen pointer-events-none transform opacity-0 scale-95 transition-all duration-500 ease-in-out group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto bg-[#f9f9f9] text-black p-4 rounded shadow-lg space-y-2 mt-2"
              style={{ width: "340px" }}
            >
              <div className="flex flex-col">
                <p className="font-bold text-lg">Booking</p>
                <div className="flex justify-center items-center flex-col mt-6">
                  <button
                    class="w-[90%] p-4 flex justify-between items-center bg-gradient-to-r from-[#FFF9F9] to-[#F7C6C6]  cursor-pointer border-none text-left shadow-md my-2"
                    onClick={() => {
                      setAddData([]);
                      setAddData(["NewQuery"]);
                    }}
                  >
                    New Query
                    <span>
                      <IoMdAdd size="16px" />
                    </span>
                  </button>
                  <Link to="/home/booking-dashboard" className="w-[90%]">
                    <button class="w-full p-4 flex justify-between items-center bg-gradient-to-r from-[#FFF9F9] to-[#F7C6C6]  cursor-pointer border-none text-left shadow-md my-2">
                      Bookings Dashboard
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="sidebar-item group hover:w-full">
            <div
              className="sidebar-icons flex flex-col justify-center  items-center p-2 rounded cursor-pointer"
              onMouseEnter={() => setHomeStyle(["MyTeams"])}
              onMouseLeave={() => setHomeStyle([])}
            >
              <IoIosPeople
                size="30px"
                color={homeStyle[0] === "MyTeams" ? "#fff" : "#B4B4B8"}
              />
              <p
                className={`menu-name text-[14px] mt-2 ${homeStyle[0] === "MyTeams" ? "text-white" : "text-[#B4B4B8]"
                  } `}
              >
                My Teams
              </p>
            </div>
            <div
              className="submenu fixed left-20 top-10 h-screen pointer-events-none transform opacity-0 scale-95 transition-all duration-500 ease-in-out group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto bg-[#f9f9f9] text-black p-4 rounded shadow-lg space-y-2 mt-2"
              style={{ width: "340px" }}
            >
              <div className="flex flex-col h-full">
                <p className="font-bold text-lg  mb-4">My Teams</p>

                <div className="flex items-center py-4 border-b-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-black mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a9 9 0 00-9 9h18a9 9 0 00-9-9z"
                    />
                  </svg>
                  <p className="text-sm font-semibold">Members</p>
                </div>

                <div className="flex flex-col justify-between  border-b-2 mb-2">
                  <div className="flex items-center space-x-2 py-4">
                    <div className="w-12 h-12 rounded-full bg-red-500 text-white flex items-center justify-center">
                      <span className="text-xl">A</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold">
                        Alexander7@gmail.com
                      </span>
                      <span className="text-sm text-gray-600">Alexander7</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col justify-between  border-b-2 mb-2">

                  <button className="w-full px-4 py-2 mt-40 text-blue-600 font-semibold border border-blue-600 hover:bg-blue-600 hover:text-white rounded-md my-4" onClick={() => navigate('/home/all-members')}>
                    All Members
                  </button>
                </div>

                <div className="flex flex-col items-center pb-4 border-b">
                  <button
                    className="w-[90%] p-4 flex justify-between items-center bg-gradient-to-r from-[#FFF9F9] to-[#F7C6C6]  cursor-pointer border-none text-left shadow-md my-2"
                    onClick={() => {
                      setAddData([]);
                      setAddData(["Roles"]);
                    }}
                  >
                    Roles & Permission
                    <span>
                      <IoMdAdd size="16px" />
                    </span>
                  </button>
                  <button
                    className="w-[90%] p-4 flex justify-between items-center bg-gradient-to-r from-[#FFF9F9] to-[#F7C6C6]  cursor-pointer border-none text-left shadow-md my-2"
                    onClick={() => {
                      setAddData([]);
                      setAddData(["NewMember"]);
                    }}
                  >
                    New Member
                    <span>
                      <IoMdAdd size="16px" />
                    </span>
                  </button>
                  <button className="w-[90%] p-4 flex justify-between items-center bg-gradient-to-r from-[#FFF9F9] to-[#F7C6C6]  cursor-pointer border-none text-left shadow-md my-2">
                    Member Board
                  </button>
                </div>
              </div>
            </div>
          </div> */}

          {/* <div className="sidebar-item group relative hover:w-full">
            <div
              className="sidebar-icons flex flex-col justify-center  items-center  p-2 rounded cursor-pointer"
              onMouseEnter={() => setHomeStyle(["Reports"])}
              onMouseLeave={() => setHomeStyle([])}
            >
              <HiOutlineDocumentReport
                size="30px"
                color={homeStyle[0] === "Reports" ? "#fff" : "#B4B4B8"}
              />
              <p
                className={`menu-name text-[14px] mt-2 ${homeStyle[0] === "Reports" ? "text-white" : "text-[#B4B4B8]"
                  } `}
              >
                Reports
              </p>
            </div>
            <div
              className="submenu fixed left-20 top-10 h-screen pointer-events-none transform opacity-0 scale-95 transition-all duration-500 ease-in-out group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto bg-[#f9f9f9] text-black p-4 rounded shadow-lg space-y-2 mt-2"
              style={{ width: "340px" }}
            >
              <div className="flex flex-col">
                <p className="font-bold text-lg">Reports</p>
              </div>
            </div>
          </div> */}

          {/* <div className="sidebar-item group relative hover:w-full">
            <div
              className="sidebar-icons flex flex-col text-center justify-center items-center p-2 rounded cursor-pointer"
              onMouseEnter={() => setHomeStyle(["Sales"])}
              onMouseLeave={() => setHomeStyle([])}
            >
              <BsGraphUpArrow
                size="30px"
                color={homeStyle[0] === "Sales" ? "#fff" : "#B4B4B8"}
              />
              <p
                className={`menu-name text-[14px] mt-2 ${homeStyle[0] === "Sales" ? "text-white" : "text-[#B4B4B8]"
                  } `}
              >
                Sales
              </p>
            </div>
            <div
              className="submenu fixed left-20 top-10 h-screen pointer-events-none transform opacity-0 scale-95 transition-all duration-500 ease-in-out group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto bg-[#f9f9f9] text-black p-4 rounded shadow-lg space-y-2 mt-2"
              style={{ width: "270px" }}
            >
              <div className="flex flex-col">
                <p className="font-bold text-lg">Sales</p>
              </div>
            </div>
          </div>

          <div className="sidebar-item group relative hover:w-full">
            <div
              className="sidebar-icons flex flex-col justify-center items-center text-center p-2 rounded cursor-pointer"
              onMouseEnter={() => setHomeStyle(["Masters"])}
              onMouseLeave={() => setHomeStyle([])}
            >
              <FaUserTie
                size="30px"
                color={homeStyle[0] === "Masters" ? "#fff" : "#B4B4B8"}
              />
              <p
                className={`menu-name text-[14px] mt-2 ${homeStyle[0] === "Masters" ? "text-white" : "text-[#B4B4B8]"
                  } `}
              >
                Masters
              </p>
            </div>
            <div
              className="submenu fixed left-20 top-10 h-screen pointer-events-none transform opacity-0 scale-95 transition-all duration-500 ease-in-out group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto bg-[#f9f9f9] text-black p-4 rounded shadow-lg space-y-2 mt-2"
              style={{ width: "340px" }}
            >
              <div className="flex flex-col h-full overflow-auto pb-8">
                <p className="font-bold text-lg">Masters</p>
                <Link to="/home/master-list">
                  <p className="py-2 my-4 border-b-2 flex items-center gap-4">
                    <FaListUl size="18px" />
                    Master List
                  </p>
                </Link>
                <div className="mt-6">
                  <div className="flex">
                    <div className="w-1/2 mb-2">
                      <button
                        className="w-[90%] p-4 flex justify-between items-center bg-gradient-to-r from-[#FFF9F9] to-[#F7C6C6]  cursor-pointer border-none text-left shadow-md my-3"
                        onClick={() => {
                          setAddData([]);
                          setAddData(["Country"]);
                        }}
                      >
                        Country
                        <span>
                          <IoMdAdd size="16px" />
                        </span>
                      </button>
                    </div>
                    <div className="w-1/2 mb-2">
                      <button
                        className="w-[90%] p-4 flex justify-between items-center bg-gradient-to-r from-[#FFF9F9] to-[#F7C6C6]  cursor-pointer border-none text-left shadow-md my-2"
                        onClick={() => {
                          setAddData([]);
                          setAddData(["State"]);
                        }}
                      >
                        State
                        <span>
                          <IoMdAdd size="16px" />
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="w-1/2 mb-2">
                      <button
                        className="w-[90%] p-4 flex justify-between items-center bg-gradient-to-r from-[#FFF9F9] to-[#F7C6C6]  cursor-pointer border-none text-left shadow-md my-2"
                        onClick={() => {
                          setAddData([]);
                          setAddData(["Destination"]);
                        }}
                      >
                        Destinations
                        <span>
                          <IoMdAdd size="16px" />
                        </span>
                      </button>
                    </div>
                    <div className="w-1/2 mb-2">
                      <button
                        className="w-[90%] p-4 flex justify-between items-center bg-gradient-to-r from-[#FFF9F9] to-[#F7C6C6]  cursor-pointer border-none text-left shadow-md my-2"
                        onClick={() => {
                          setAddData([]);
                          setAddData(["Hotel"]);
                        }}
                      >
                        Hotels
                        <span>
                          <IoMdAdd size="16px" />
                        </span>
                      </button>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="w-1/2 mb-2">
                      <button
                        className="w-[90%] p-4 flex justify-between items-center bg-gradient-to-r from-[#FFF9F9] to-[#F7C6C6]  cursor-pointer border-none text-left shadow-md my-2"
                        onClick={() => {
                          setAddData([]);
                          setAddData(["Transportation"]);
                        }}
                      >
                        Transportation
                        <span>
                          <IoMdAdd size="16px" />
                        </span>
                      </button>
                    </div>
                    <div className="w-1/2 mb-2">
                      <button
                        className="w-[90%] p-4 flex justify-between items-center bg-gradient-to-r from-[#FFF9F9] to-[#F7C6C6]  cursor-pointer border-none text-left shadow-md my-2"
                        onClick={() => {
                          setAddData([]);
                          setAddData(["Policies"]);
                        }}
                      >
                        Policies
                        <span>
                          <IoMdAdd size="16px" />
                        </span>
                      </button>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="w-1/2 mb-2">
                      <button
                        className="w-[90%] p-4 flex justify-between items-center bg-gradient-to-r from-[#FFF9F9] to-[#F7C6C6]  cursor-pointer border-none text-left shadow-md my-2"
                        onClick={() => {
                          setAddData([]);
                          setAddData(["Vendors"]);
                        }}
                      >
                        Vendors
                        <span>
                          <IoMdAdd size="16px" />
                        </span>
                      </button>
                    </div>
                    <div className="w-1/2 mb-2">
                      <button
                        className="w-[90%] p-4 flex justify-between items-center bg-gradient-to-r from-[#FFF9F9] to-[#F7C6C6]  cursor-pointer border-none text-left shadow-md my-2"
                        onClick={() => {
                          setAddData([]);
                          setAddData(["Itinerary"]);
                        }}
                      >
                        Itinerary
                        <span>
                          <IoMdAdd size="16px" />
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="w-1/2 mb-2">
                      <button
                        className="w-[90%] p-4 flex justify-between items-center bg-gradient-to-r from-[#FFF9F9] to-[#F7C6C6]  cursor-pointer border-none text-left shadow-md my-2"
                        onClick={() => {
                          setAddData([]);
                          setAddData(["Department"]);
                        }}
                      >
                        Department
                        <span>
                          <IoMdAdd size="16px" />
                        </span>
                      </button>
                    </div>
                    <div className="w-1/2 mb-2">
                      <button
                        className="w-[90%] p-4 flex justify-between items-center bg-gradient-to-r from-[#FFF9F9] to-[#F7C6C6]  cursor-pointer border-none text-left shadow-md my-2"
                        onClick={() => {
                          setAddData([]);
                          setAddData(["Designation"]);
                        }}
                      >
                        Designation
                        <span>
                          <IoMdAdd size="16px" />
                        </span>
                      </button>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="w-1/2 mb-2">
                      <button
                        className="w-[90%] p-4 flex justify-between items-center bg-gradient-to-r from-[#FFF9F9] to-[#F7C6C6]  cursor-pointer border-none text-left shadow-md my-2"
                        onClick={() => {
                          setAddData([]);
                          setAddData(["Company"]);
                        }}
                      >
                        Company
                        <span>
                          <IoMdAdd size="16px" />
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
        </div>
        <div className="sidebar-item group relative hover:w-full shadow-sm">
          <div className="w-full h-[1px] bg-transparent my-2 shadow-[0_0_10px_2px_rgba(255,255,255,0.7)]"></div>
          <div className="sidebar-item group relative hover:w-full">
            <div className="sidebar-icons flex flex-col justify-center  items-center  p-2 rounded cursor-pointer"
              onMouseEnter={() => setHomeStyle("Reports")}
              onMouseLeave={() => setHomeStyle()}
            >
              <HiOutlineDocumentReport
                size="30px"
                color={homeStyle === "Reports" ? "#fff" : "#B4B4B8"}
              />
              <p
                className={`menu-name text-[14px] mt-2 ${homeStyle === "Reports" ? "text-white" : "text-[#B4B4B8]"
                  } `}
              >
                Reports
              </p>
            </div>
            <div
              className="submenu fixed left-20 top-10 h-screen pointer-events-none transform opacity-0 scale-95 transition-all duration-500 ease-in-out group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto bg-[#f9f9f9] text-black p-4 rounded shadow-lg space-y-2 mt-2"
              style={{ width: "340px" }}
            >
              <div className="flex flex-col">
                <p className="font-bold text-lg">Reports</p>
              </div>
            </div>
          </div>
          <div className="sidebar-icons flex flex-col justify-center items-center text-center p-2 rounded cursor-pointer"
            onMouseEnter={() => setHomeStyle("Settings")}
            onMouseLeave={() => setHomeStyle()}>
            <div className="sidebar-icons flex flex-col justify-center items-center text-center p-2 rounded cursor-pointer">
              <CiSettings
                size="30px"
                color={"#B4B4B8"}
              />
              <p className="menu-name text-[14px] mt-2 text-[#B4B4B8]">
                Settings
              </p>
            </div>
            <div
              className="submenu fixed left-20 top-10 h-screen pointer-events-none transform opacity-0 scale-95 transition-all duration-500 ease-in-out group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto bg-[#f9f9f9] text-black p-4 rounded shadow-lg space-y-2 mt-2"
              style={{ width: "340px" }}
            >
              <div className="flex flex-col">
                <p className="font-bold text-lg">Settings</p>
                {/* <Link to='/home' className="block px-4 py-2 hover:bg-gray-600 rounded"> */}
                <Link to="/home/app-settings">
                  <button class="w-[90%] mt-6 p-4 flex justify-between items-center bg-gradient-to-r from-[#FFF9F9] to-[#F7C6C6]  cursor-pointer border-none text-left shadow-md my-3"
                  //  onClick={() => {
                  //   setAddData([]);
                  //   setAddData(["AppSettings"]);
                  // }}
                  >
                    App Settings
                  </button>
                </Link>
                {/* </Link> */}
                {/* <Link to='/home/dashboard' className="block px-4 py-2 hover:bg-gray-600 rounded">       */}
                <Link to="/home/company-profile">
                  <button className="w-[90%] p-4 flex justify-between items-center bg-gradient-to-r from-[#FFF9F9] to-[#F7C6C6]  cursor-pointer border-none text-left shadow-md my-3">
                    Portal Settings
                  </button>
                </Link>
                {/* </Link> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div
        className="submenu-menu"
        style={{ right: addData[0] === "Country" ? "0" : "-100%" }}
      >
        <Country
          isOpen={addData[0] === "Country"}
          onClose={() => setAddData([])}
        />
      </div>
      <div
        className="submenu-menu"
        style={{ right: addData[0] === "State" ? "0" : "-100%" }}
      >
        <State isOpen={addData[0] === "State"} onClose={() => setAddData([])} />
      </div>
      <div
        className="submenu-menu"
        style={{ right: addData[0] === "Destination" ? "0" : "-100%" }}
      >
        <Destination
          isOpen={addData[0] === "Destination"}
          onClose={() => setAddData([])}
        />
      </div>
      <div
        className="submenu-menu"
        style={{ right: addData[0] === "Hotel" ? "0" : "-100%" }}
      >
        <Hotel isOpen={addData[0] === "Hotel"} onClose={() => setAddData([])} />
      </div>
      <div
        className="submenu-menu"
        style={{ right: addData[0] === "Roles" ? "0" : "-100%" }}
      >
        <Roles isOpen={addData[0] === "Roles"} onClose={() => setAddData([])} />
      </div>
      <div
        className="submenu-menu"
        style={{ right: addData[0] === "NewMember" ? "0" : "-100%" }}
      >
        <NewMember
          isOpen={addData[0] === "NewMember"}
          onClose={() => setAddData([])}
        />
      </div>
      <div
        className="submenu-menu"
        style={{ right: addData[0] === "Itinerary" ? "0" : "-100%" }}
      >
        <Itinerary
          isOpen={addData[0] === "Itinerary"}
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
        style={{ right: addData[0] === "NewQuery" ? "0" : "-100%" }}
      >
        <NewQuery
          isOpen={addData[0] === "NewQuery"}
          onClose={() => setAddData([])}
        />
      </div>
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
        style={{ right: addData[0] === "Transportation" ? "0" : "-100%" }}
      >
        <NewTransportationForm
          isOpen={addData[0] === "Transportation"}
          onClose={() => setAddData([])}
        />
      </div>
      <div
        className="submenu-menu"
        style={{ right: addData[0] === "Policies" ? "0" : "-100%" }}
      >
        <NewPolicyForm
          isOpen={addData[0] === "Policies"}
          onClose={() => setAddData([])}
        />
      </div> */}
      <div
        className="submenu-menu"
        style={{ right: addData === "Department" ? "0" : "-100%" }}
      >
        <Department
          isOpen={addData === "Department"}
          onClose={() => setAddData()}
        />
      </div>
      <div
        className="submenu-menu"
        style={{ right: addData === "Designation" ? "0" : "-100%" }}
      >
        <Designation
          isOpen={addData === "Designation"}
          onClose={() => setAddData()}
        />
      </div>
      <div
        className="submenu-menu"
        style={{ right: addData === "Company" ? "0" : "-100%" }}
      >
        <NewCompanyForm
          isOpen={addData === "Company"}
          onClose={() => setAddData()}
        />
      </div>
    </>
  );
};

export default Sidebar;