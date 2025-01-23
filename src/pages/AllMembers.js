import React, { useState, useRef, useEffect } from "react";
import { FaEdit, FaTrashAlt, FaSearch, FaCog } from "react-icons/fa";
import { FiFilter } from "react-icons/fi";
import Table from "./TableComponent";
import NewVendorForm from "./NewVendorForm";
import NewPackageForm from "./NewPackageForm";
import NewTransportationForm from "./NewTransportationForm";
import NewMember from "./NewMember";
// Import Settings component at the top of AllMembers.js
import { FaCaretDown } from "react-icons/fa"; // Import the dropdown icon
import Settings from "./SettingsPage";
import axios from "axios";
import api from "../apiConfig/config";
import Roles from "./Roles";

const AllMembers = () => {
  const [showDropdown, setShowDropdown] = useState(false); // State for showing the dropdown
  const [selectedUser, setSelectedUser] = useState(""); // State for selected User
  const [selectedRole, setSelectedRole] = useState(""); // State for selected Role
  const [stateData, setStateData] = useState([]);
  const [addData, setAddData] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false); // State for controlling the dropdown open/close
  const [status, setStatus] = useState(true); // State for the toggle switch
  const [activeTab, setActiveTab] = useState("roles"); // State to manage active tab
  const dropdownRef = useRef(null);
  const [currentTable, setCurrentTable] = useState("list"); // State to track the selected table
  const [selectedMemberColumns, setSelectedMemberColumns] = useState({
    name: true,
    email: false,
    mobnumber: true,
    roles: false,
    status: true,
  });

  const [selectedRolesColumns, setSelectedRolesColumns] = useState({
    roleName: true,
    description: false,
    numOfUsers: true,
    status: true,
  })

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setShowDropdown(false);
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setShowDropdown(false);
  };

  const handleStatusToggle = () => {
    setStatus(!status);
  };
  // Inside AllMembers component
  const [isMemberSettingsOpen, setIsMemberSettingsOpen] = useState(false);
  const [isRolesSettingsOpen, setIsRolesSettingsOpen] = useState(false);

  const handleMembersSaveSettings = (columns) => {
    setSelectedMemberColumns(columns);
  };

  const handleRolesSaveSettings = (columns) => {
    setSelectedRolesColumns(columns);
  };

  const memberColumns = [
    {
      header: "Select",
      render: () => (
        <div className="flex justify-center items-center">
          <input type="checkbox" className="form-checkbox" />
        </div>
      ),
    },
    {
      header: "Name",
      render: (row) => {
        return (
          <>
            <div>{row.name} {row.mname} {row.lname}</div>
          </>
        )
      },
    },

    { header: "Email", accessor: "email" },
    { header: "Phone", accessor: "mobnumber" },
    { header: "Roles", accessor: "roles" },
    {
      header: "Status",
      render: () => (
        <div className="flex items-center justify-center">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={status}
              onChange={handleStatusToggle}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:bg-green-500 dark:bg-gray-700 dark:peer-focus:ring-green-800">
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${status ? "translate-x-5" : ""
                  }`}
              ></div>
            </div>
          </label>
        </div>
      ),
    },
    {
      header: "Action",
      render: (row) => (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => handleEdit(row)}
            className="text-purple-500 hover:text-purple-700"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => handleDelete(row)}
            className="text-red-500 hover:text-red-700"
          >
            <FaTrashAlt />
          </button>
        </div>
      ),
    },
  ];

  const filteredMemberColumns = memberColumns.filter(
    (col) => selectedMemberColumns[col.accessor] || col.accessor === undefined
  );

  const [roleData, setRoleData] = useState([])

  const [membersData, setMembersData] = useState([])
  // [
  //   {
  //     name: "Aditi",
  //     email: "aditishahi2000@gmail.com",
  //     phone: "7905955636",
  //     roles: "Admin",
  //     status: "Active",
  //   },
  // ];


  useEffect(() => {
    axios.get(`${api.baseUrl}/usergetall`)
      .then(response => {
        setMembersData(response.data)
      })
      .catch(error => console.error(error)
      );


    axios.get(`${api.baseUrl}/role/getall`)
      .then(response => {
        setRoleData(response.data.content)
      })
      .catch(error => console.error(error)
      );


  }, [])

  const handleEdit = (row) => {
    alert(`Edit clicked for ${row.name}`);
  };

  const handleDelete = (row) => {
    alert(`Delete clicked for ${row.name}`);
  };
  const roleColumns = [
    {
      header: "Select",
      render: () => (
        <div className="flex justify-center items-center">
          <input type="checkbox" className="form-checkbox" />
        </div>
      ),
    },
    { header: "Role Name", accessor: "roleName" },
    { header: "Description", accessor: "description" },
    // { header: "No of Users", accessor: "numOfUsers" },
    {
      header: "Status",
      render: () => (
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={status}
            onChange={handleStatusToggle}
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:bg-green-500 dark:bg-gray-700 dark:peer-focus:ring-green-800">
            <div
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${status ? "translate-x-5" : ""
                }`}
            ></div>
          </div>
        </label>
      ),
    },
    {
      header: "Action",
      render: (row) => (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => handleEdit(row)}
            className="text-purple-500 hover:text-purple-700"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => handleDelete(row)}
            className="text-red-500 hover:text-red-700"
          >
            <FaTrashAlt />
          </button>
        </div>
      ),
    },
  ];

  const filteredRolesColumns = roleColumns.filter(
    (col) => selectedRolesColumns[col.accessor] || col.accessor === undefined
  );

  // const roleData = [
  //   {
  //     name: "Admin",
  //     description: "Administrator with full access",
  //     numOfUsers: 5,
  //     status: "Active",
  //   },
  //   {
  //     name: "Member",
  //     description: "Member with limited access",
  //     numOfUsers: 10,
  //     status: "Inactive",
  //   },
  // ];

  return (
    <div className=" p-4 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">My Team</h1>

        {/* Add Button with Dropdown */}
        <div className="relative">
          <button
            className="flex items-center justify-between bg-blue-500 text-white px-5 py-2 rounded-md"
            onClick={toggleDropdown}
          >
            Add
            <FaCaretDown className="ml-2" /> {/* Add the dropdown icon here */}
          </button>
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-md z-10">
              <ul>
                <li
                  className="p-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => {
                    setAddData([]);
                    setAddData(["NewMember"])
                    handleUserSelect("User 1");
                  }}
                >
                  User
                </li>
                <li
                  className="p-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => {
                    setAddData([]);
                    setAddData(["Roles"])
                    handleUserSelect("User 2");
                  }}
                >
                  User role
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center border-b border-gray-200 mb-4">
        <p
          className={`pb-2 mr-6 cursor-pointer ${activeTab === "list"
            ? "border-b-4 border-red-700 text-black"
            : "hover:border-b-4 hover:border-red-400"
            }`}
          onClick={() => setActiveTab("list")}
        >
          Member
        </p>
        <p
          className={`pb-2 cursor-pointer ${activeTab === "roles"
            ? "border-b-4 border-red-700 text-black"
            : "hover:border-b-4 hover:border-red-400"
            }`}
          onClick={() => setActiveTab("roles")}
        >
          Roles
        </p>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 w-full">
          {/* Search Input */}
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

          {/* Plus Icon */}
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
          <div className="flex-grow"></div>
          {/* Settings Icon */}
          <FaCog
            className="text-gray-500 text-xl cursor-pointer hover:text-gray-700"
            title="Settings"
            onClick={
              activeTab === "list"
                ? () => setIsMemberSettingsOpen(true)
                : () => setIsRolesSettingsOpen(true)
            }
          />

          {
            isMemberSettingsOpen &&
            <Settings
              onClose={
                activeTab === "list"
                  ? () => setIsMemberSettingsOpen(false)
                  : () => setIsRolesSettingsOpen(false)
              }
              onSave={
                activeTab === "list"
                  ? handleMembersSaveSettings
                  : handleRolesSaveSettings
              }
              initialColumns={selectedMemberColumns}
            />
          }
          {
            isRolesSettingsOpen &&
            <Settings
              onClose={
                activeTab === "list"
                  ? () => setIsMemberSettingsOpen(false)
                  : () => setIsRolesSettingsOpen(false)
              }
              onSave={
                activeTab === "list"
                  ? handleMembersSaveSettings
                  : handleRolesSaveSettings
              }
              initialColumns={selectedRolesColumns}
            />
          }
        </div>
      </div>
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        {activeTab === "list" ? (
          <Table columns={filteredMemberColumns} data={membersData} />
        ) : (
          <Table columns={filteredRolesColumns} data={roleData} />
        )}
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
        style={{ right: addData[0] === "Roles" ? "0" : "-100%" }}
      >
        <Roles
          isOpen={addData[0] === "Roles"}
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
        style={{ right: addData[0] === "NewMember" ? "0" : "-100%" }}
      >
        <NewMember
          isOpen={addData[0] === "NewMember"}
          onClose={() => setAddData([])}
        />
      </div>
      <div>
        {currentTable === "list" && (
          <div className="bg-white shadow rounded-lg">
            <div className="py-4 px-6 text-gray-500">
              Showing 1 to 1 of 1 rows
            </div>
          </div>
        )}

        {currentTable === "roles" && (
          <div className="bg-white shadow rounded-lg">
            <div className="py-4 px-6 text-gray-500">
              Showing 1 to 2 of 2 rows
            </div>
          </div>
        )}
      </div>
      {/* Table Component */}
      {/* <div className="bg-white shadow rounded-lg">
        <Table columns={columns} data={data} isSelectable={true} />
        <div className="py-4 px-6 text-gray-500">Showing 1 to 1 of 1 rows</div>
      </div> */}
    </div>
  );
};

export default AllMembers;