import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NewCompanyForm from "./NewCompanyForm";
import Department from "./Department";
import Designation from "./Designation";
import Roles from "./Roles";
import axios from "axios";
import api from "../apiConfig/config";
import { UserContext } from "../contexts/userContext";

const CompanyProfilePage = () => {
  const navigate = useNavigate();

  const { user } = useContext(UserContext);

  const [addData, setAddData] = useState([]);
  // const [userData, setUserData] = useState(null);
  const [designationData, setDesignationData] = useState(null);


  const handleNavigation = (type) => {
    navigate(`/home/organization-details/${user && user.companyId}`, { state: { type } });
  };
  // useEffect(() => {

  //   const token = localStorage.getItem('token');

  //   axios.get(`${api.baseUrl}/username`,
  //     {
  //       headers: {
  //         'Authorization': `Bearer ${token}`
  //       }
  //     },
  //   ).then((res) => {
  //     setUserData(res.data);
  //   })
  // }, []);

  // useEffect(() => {
  //   userData && axios.get(`${api.baseUrl}/designations/getbyid/${userData && userData.designationId}`).then((res) => {
  //     setDesignationData(res.data);
  //   })
  // }, [userData])

  return (
    <>
      <div className="min-h-screen bg-gray-100 p-6 mb-10">
        <div className="flex flex-col md:flex-row justify-between items-center w-full h-20 bg-white shadow-md mb-6 px-6">
          <h1 className="text-lg font-bold text-center md:text-left">
            Company Admin Center
          </h1>
          <button
            className="border bg-red-500  text-white text-sm py-2 px-4 rounded mb-4 md:mb-0 w-full md:w-auto"
            onClick={() => setAddData(["Company"])}
          >
            Add Branch/Company
          </button>
        </div>

        <div className="bg-white shadow-md rounded-md p-6 mb-6 flex flex-col md:flex-row items-center relative">
          {/* Left Section (Profile Picture and Info) */}
          <div className="flex items-center space-x-4 w-full md:w-1/2">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-3xl font-semibold text-gray-700">A</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {user && user.name} {user && user.mname} {user && user.lname}
              </h2>
              <p className="text-gray-600 text-sm">{user && user.email}</p>
              <span className="text-xs bg-orange-100 text-orange-800 font-medium py-1 px-2 rounded inline-block mt-2">
                {user && user.designation && user.designation.designationName}
              </span>
              <p
                className="text-blue-500 text-sm mt-2 underline cursor-pointer"
                onClick={() => navigate("/home/profile-page")}
              >
                Edit Profile
              </p>
            </div>
          </div>

          {/* Vertical Line Divider (hidden on small screens) */}
          <div className="h-20 w-px bg-gray-500 absolute left-1/2 transform -translate-x-1/2 hidden md:block"></div>

          {/* Right Section (Organization Details and Buttons) */}
          <div className="text-right w-full md:w-1/2 mt-4 md:mt-0">
            <button
              onClick={() => navigate(`/home/organization-details/${user && user.company && user.company.id}`, { state: user.company })}
              className="border  border-gray-300 bg-gray-100 text-gray-600 text-sm py-2 px-4 rounded mb-2"
            >
              Upload Organization Logo
            </button>
            <div className="text-sm text-gray-600">
              <span className="font-semibold">Organization URL: </span>
              <span className="text-gray-800">tourbom.myfreshworks.com</span>
            </div>
            <button
              onClick={() => navigate(`/home/organization-details/${user && user.companyId}`, { state: user.company })}
              className="text-blue-500 underline text-sm mt-2"
            >
              Edit Organization Information
            </button>
          </div>
        </div>

        {/* My Accounts Section */}
        <div className="bg-white shadow-md rounded-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            My Roles
          </h2>
          <p className="text-gray-600 text-sm mb-4">
            All the accounts in this organization that you have access to. Click
            to open.
          </p>

          {/* Account List */}
          <div className="flex items-center space-x-4">
            <button
              className="border border-dashed border-gray-300 bg-gray-100 text-gray-600 text-sm py-2 px-4 rounded mb-2"
              onClick={() => setAddData(["Role"])}
            >
              Add Role
            </button>
            <button
              className="border border-dashed border-gray-300 bg-gray-100 text-gray-600 text-sm py-2 px-4 rounded mb-2"
              onClick={() => navigate("/home/view-departments")}
            >
              View Role
            </button>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            My Department
          </h2>
          <p className="text-gray-600 text-sm mb-4">
            All the accounts in this organization that you have access to. Click
            to open.
          </p>

          {/* Account List */}
          <div className="flex items-center space-x-4">
            <button
              className="border border-gray-300 bg-gray-100 text-gray-600 text-sm py-2 px-4 rounded mb-2"
              onClick={() => setAddData(["Department"])}
            >
              Add Department
            </button>
            <button
              className="border bg-red-500  text-white text-sm py-2 px-4 rounded mb-2"
              onClick={() => navigate("/home/view-departments")}
            >
              View Department
            </button>
          </div>
        </div>

        {/* My Accounts Section */}
        <div className="bg-white shadow-md rounded-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            My Designation
          </h2>
          <p className="text-gray-600 text-sm mb-4">
            All the accounts in this organization that you have access to. Click
            to open.
          </p>

          {/* Account List */}
          <div className="flex items-center space-x-4">
            <button
              className="border border-gray-300 bg-gray-100 text-gray-600 text-sm py-2 px-4 rounded mb-2"
              onClick={() => setAddData(["Designation"])}
            >
              Add Designation
            </button>
            <button
              className="border bg-red-500  text-white  text-sm py-2 px-4 rounded mb-2"
              onClick={() => navigate("/home/view-designations")}
            >
              View Designation
            </button>
          </div>
        </div>
      </div>
      <div
        className="submenu-menu"
        style={{ right: addData[0] === "Company" ? "0" : "-100%" }}
      >
        <NewCompanyForm
          isOpen={addData[0] === "Company"}
          onClose={() => setAddData([])}
        />
      </div>
      <div
        className="submenu-menu"
        style={{ right: addData[0] === "Department" ? "0" : "-100%" }}
      >
        <Department
          isOpen={addData[0] === "Department"}
          onClose={() => setAddData([])}
        />
      </div>
      <div
        className="submenu-menu"
        style={{ right: addData[0] === "Designation" ? "0" : "-100%" }}
      >
        <Designation
          isOpen={addData[0] === "Designation"}
          onClose={() => setAddData([])}
        />
      </div>
      <div
        className="submenu-menu"
        style={{ right: addData[0] === "Role" ? "0" : "-100%" }}
      >
        <Roles
          isOpen={addData[0] === "Role"}
          onClose={() => setAddData([])}
        />
      </div>
    </>
  );
};

export default CompanyProfilePage;
