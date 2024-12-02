import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NewCompanyForm from "./NewCompanyForm";
import Department from "./Department";
import Designation from "./Designation";

const CompanyProfilePage = () => {
  const navigate = useNavigate();

  const handleNavigation = (type) => {
    navigate("/home/organization-details", { state: { type } });
  };

  const [addData, setAddData] = useState([]);

  return (
    <>
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="flex flex-col md:flex-row justify-between items-center w-full h-20 bg-white shadow-md mb-6 px-6">
          <h1 className="text-lg font-bold text-center md:text-left">
            Company Admin Center
          </h1>
          <button
            className="border border-dashed border-gray-300 bg-gray-100 text-gray-600 text-sm py-2 px-4 rounded mb-4 md:mb-0 w-full md:w-auto"
            onClick={() => setAddData(["Company"])}
          >
            Add Branch/Company
          </button>
        </div>

        <div className="bg-white shadow-md rounded-md p-6 mb-6 flex flex-col md:flex-row items-center relative">
          {/* Left Section (Profile Picture and Info) */}
          <div className="flex items-center space-x-4 w-full md:w-1/2">
            <div className="w-16 h-16 bg-green-200 rounded-full flex items-center justify-center">
              <span className="text-3xl font-semibold text-gray-700">A</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Anshul Kumar
              </h2>
              <p className="text-gray-600 text-sm">kartezayke@gmail.com</p>
              <span className="text-xs bg-orange-100 text-orange-800 font-medium py-1 px-2 rounded inline-block mt-2">
                ORGANIZATION ADMIN
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
              onClick={() => handleNavigation("upload-logo")}
              className="border border-dashed border-gray-300 bg-gray-100 text-gray-600 text-sm py-2 px-4 rounded mb-2"
            >
              Upload Organization Logo
            </button>
            <div className="text-sm text-gray-600">
              <span className="font-semibold">Organization URL: </span>
              <span className="text-gray-800">tourbom.myfreshworks.com</span>
            </div>
            <button
              onClick={() => handleNavigation("edit-info")}
              className="text-blue-500 underline text-sm mt-2"
            >
              Edit Organization Information
            </button>
          </div>
        </div>

        {/* My Accounts Section */}
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
              className="border border-dashed border-gray-300 bg-gray-100 text-gray-600 text-sm py-2 px-4 rounded mb-2"
              onClick={() => setAddData(["Department"])}
            >
              Add Department
            </button>
            <button
              className="border border-dashed border-gray-300 bg-gray-100 text-gray-600 text-sm py-2 px-4 rounded mb-2"
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
              className="border border-dashed border-gray-300 bg-gray-100 text-gray-600 text-sm py-2 px-4 rounded mb-2"
              onClick={() => setAddData(["Designation"])}
            >
              Add Designation
            </button>
            <button
              className="border border-dashed border-gray-300 bg-gray-100 text-gray-600 text-sm py-2 px-4 rounded mb-2"
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
    </>
  );
};

export default CompanyProfilePage;
