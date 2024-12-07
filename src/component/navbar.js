import React, { useEffect, useState, useRef, useContext } from "react";
import { IoMenu, IoClose, IoSearch } from "react-icons/io5";
import {
  FaEnvelope,
  FaBell,
  FaCommentAlt,
  FaQuestionCircle,
  FaUserAlt,
  FaCog,
  FaUserCircle,
  FaSignOutAlt,
} from "react-icons/fa";
import { TfiEmail } from "react-icons/tfi";
import { FaRegBell } from "react-icons/fa";
import { FiMessageSquare } from "react-icons/fi";
import { IoMdHelpCircleOutline } from "react-icons/io";
import Sidebar from "./sidebar"; // Adjust the path as needed
import { Link, useNavigate } from "react-router-dom";
import api from "../apiConfig/config";
import axios from "axios";
import { UserContext } from "../contexts/userContext";
// import NewVendorForm from "../pages/NewVendorForm";
// import NewPackageForm from "../pages/NewPacakgeForm";
// import NewTransportationForm from "../pages/NewTransportationForm";
// import NewMember from "../pages/NewMember";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [addData, setAddData] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false); // State for the "+" dropdown
  const [showSearchField, setShowSearchField] = useState(false); // State for the "+" dropdown
  // const [user, setUser] = useState({ username: "", email: "", roles: "" });
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const isOpenRef = useRef(null);

  const { user, handleLogout } = useContext(UserContext);

  const getFirstCharacter = (word) => {
    return word ? word.charAt(0) : "";
  };

  const [token, setTokens] = useState(null);
  // async function decryptToken(encryptedToken, key, iv) {
  //   const dec = new TextDecoder();

  //   const decrypted = await crypto.subtle.decrypt(
  //     {
  //       name: "AES-GCM",
  //       iv: iv,
  //     },
  //     key,
  //     encryptedToken
  //   );

  //   return dec.decode(new Uint8Array(decrypted));
  // }

  // // Function to retrieve and decrypt the token
  // async function getDecryptedToken() {
  //   const keyData = JSON.parse(localStorage.getItem("encryptionKey"));
  //   const ivBase64 = localStorage.getItem("iv");
  //   const encryptedTokenBase64 = localStorage.getItem("encryptedToken");

  //   if (!keyData || !ivBase64 || !encryptedTokenBase64) {
  //     throw new Error("No token found");
  //   }

  //   // Convert back from base64
  //   const key = await crypto.subtle.importKey(
  //     "jwk",
  //     keyData,
  //     { name: "AES-GCM" },
  //     true,
  //     ["encrypt", "decrypt"]
  //   );
  //   const iv = new Uint8Array(
  //     atob(ivBase64)
  //       .split("")
  //       .map((char) => char.charCodeAt(0))
  //   );
  //   const encryptedToken = new Uint8Array(
  //     atob(encryptedTokenBase64)
  //       .split("")
  //       .map((char) => char.charCodeAt(0))
  //   );

  //   return await decryptToken(encryptedToken, key, iv);
  // }

  // // // Example usage to make an authenticated request
  // // useEffect(() => {
  // //   getDecryptedToken()
  // //     .then(res => {
  // //       setTokens(res);

  // //       return axios.get(`${api.baseUrl}/username`, {
  // //         headers: {
  // //           'Authorization': `Bearer ${token}`,
  // //           'Access-Control-Allow-Origin': '*'
  // //         }
  // //       });
  // //     })
  // //     .then(response => {
  // //       setUser(response.data);
  // //     })
  // //     .catch(error => console.error('Error fetching protected resource:', error))
  // // }, [])

  // useEffect(() => {
  //   const token = localStorage.getItem("token");

  //   axios.get(`${api.baseUrl}/username`, {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //       "Access-Control-Allow-Origin": "*",
  //     },
  //   }).then((response) => {
  //     setUser(response.data);
  //   });
  // }, []);

  // const handleLogout = () => {
  //   localStorage.clear();
  //   navigate("/login");
  // };

  // Close the dropdown on outside click
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
    const handleClickOutside = (event) => {
      if (isOpenRef.current && !isOpenRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full flex flex-col md:flex-row">
      <div className="w-full h-12 z-20 bg-gradient-to-r from-[#db272e] to-[#5b2727] p-5 flex justify-between items-center">
        <div className="flex-1 flex justify-between items-center">
          <div className="flex items-center space-x-4 md:space-x-8">
            <Link to="/home">
              <img
                src="/assets/images/motherson_logo.png"
                alt="Logo"
                className="w-auto h-6 md:w-auto md:h-6 filter brightness-0 invert"
              />
            </Link>
            <div className="flex items-center space-x-2">
              <div className="relative" ref={dropdownRef}>
                <span
                  className="text-[#B4B4B8] hover:text-white text-3xl md:text-3xl cursor-pointer"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  +
                </span>
                {dropdownOpen && (
                  <div className="absolute top-10 left-0 w-48 bg-white shadow-lg rounded-md  text-black">
                    <ul className="space-y-2">
                      <li
                        className="hover:bg-gray-200  hover:border-l-4  border-blue-500 p-2  rounded cursor-pointer"
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
                        className="hover:bg-gray-200 hover:border-l-4  border-blue-500 p-2 rounded cursor-pointer"
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
              {/* Submenu Components */}
              {/* <div
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
                style={{
                  right: addData[0] === "NewPackageForm" ? "0" : "-100%",
                }}
              >
                <NewPackageForm
                  isOpen={addData[0] === "NewPackageForm"}
                  onClose={() => setAddData([])}
                />
              </div>
              <div
                className="submenu-menu"
                style={{
                  right: addData[0] === "Transportation" ? "0" : "-100%",
                }}
              >
                <NewTransportationForm
                  isOpen={addData[0] === "Transportation"}
                  onClose={() => setAddData([])}
                />
              </div>
              <div
                className="submenu-menu"
                style={{ right: addData[0] === "NewMember" ? "0" : "-100%" }}
              >
                <NewMember
                  isOpen={addData[0] === "NewMember"}
                  onClose={() => setAddData([])}
                />
              </div> */}
              <div
                className="hidden md:flex items-center cursor-pointer"
                onClick={() => setShowSearchField(!showSearchField)}
              >
                <IoSearch className="text-[#B4B4B8] hover:text-white text-3xl md:text-3xl cursor-pointer w-6 h-6 mt-2 ml-2" />
              </div>
              {/* <Link to='/home/department-dashboard'>
                <p>Dashboard</p>
              </Link> */}
              {showSearchField && (
                <input
                  type="text"
                  placeholder="Search"
                  className="border-2 border-gray-300 rounded-md p-1"
                />
              )}
            </div>
          </div>
          {/* Hamburger Menu */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white">
              {isOpen ? (
                <IoClose className="w-8 h-8" />
              ) : (
                <IoMenu className="w-8 h-8" />
              )}
            </button>
          </div>

          {/* Right Side Profile and Icons */}
          <div
            className={`flex items-center gap-6
            ${isOpen ? "block" : "hidden"} md:flex`}
          >
            <TfiEmail className="w-7 h-7 p-1 cursor-pointer  text-[#B4B4B8] hover:text-white" />
            <FaRegBell className="w-7 h-7 p-1 cursor-pointer  text-[#B4B4B8] hover:text-white" />
            <FiMessageSquare className="w-7 h-7 p-1 cursor-pointer  text-[#B4B4B8] hover:text-white" />
            <IoMdHelpCircleOutline
              className="w-7 h-10 p-1 text-[#B4B4B8] hover:text-white
            cursor-pointer "
            />

            <div className="relative" ref={isOpenRef}>
              <div
                onClick={() => setIsOpen(!isOpen)}
                className="bg-green-500 text-white text-center p-2 cursor-pointer rounded-sm w-8 h-8 
                flex items-center justify-center"
              >
                {user && user.name && getFirstCharacter(user.name.toUpperCase())}
              </div>

              {/* Dropdown Menu */}
              {isOpen && (
                <div
                  className="absolute right-0 w-72 bg-gradient-to-b from-[#db272e] to-[#5b2727]  bg-opacity-90 text-white 
                rounded-lg shadow-lg mt-2 mr-4"
                >
                  <div className="flex items-center space-x-2 border-b border-red-500 p-2">
                    <div className="bg-green-500 h-8 w-8 text-white flex items-center justify-center rounded-full">
                      {user && user.name && getFirstCharacter(user.name.toUpperCase())}
                    </div>

                    <div>
                      <p className="text-lg">{user && user.name && `${user.name[0].toUpperCase()}${user.name.substring(1)}`}{" "}{user && user.lname}</p>
                      <p>{user.email}</p>
                      <p className="text-sm">{user && user.role && user.role.roleName}</p>
                    </div>
                  </div>

                  {/* Dropdown Links */}
                  <div className="flex flex-col p-2 space-y-2">
                    <div
                      className="flex items-center space-x-2 hover:bg-red-500 p-2 rounded cursor-pointer"
                      onClick={() => navigate("/home/profile-page")}
                    >
                      <FaUserAlt />
                      <p>My Profile</p>
                      {/* <Profile/> */}
                    </div>
                    <div className="flex items-center space-x-2 hover:bg-red-500 p-2 rounded cursor-pointer">
                      <FaCog />
                      <p>Personalization</p>
                    </div>
                    <div className="flex items-center space-x-2 hover:bg-red-500 p-2 rounded cursor-pointer">
                      <FaCog />
                      <p>Portal Settings</p>
                    </div>
                    <div className="flex items-center space-x-2 hover:bg-red-500 p-2 rounded cursor-pointer">
                      <FaUserCircle />
                      <p>My Accounts</p>
                    </div>
                    <div
                      className="flex items-center space-x-2 hover:bg-red-500 p-2 rounded cursor-pointer"
                      onClick={handleLogout}
                    >
                      <FaSignOutAlt />
                      <p>Logout</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
