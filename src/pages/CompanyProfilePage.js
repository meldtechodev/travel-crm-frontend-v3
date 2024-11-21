import React from "react";
import { useNavigate } from "react-router-dom";

const CompanyProfilePage = () => {
  const navigate = useNavigate();

  const handleNavigation = (type) => {
    navigate("/home/organization-details", { state: { type } });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center w-full h-16 bg-white shadow-md mb-6 px-6">
        <h1 className="text-lg font-bold">Company Admin Center</h1>
        <div className="w-4 h-4 bg-red-500 rounded-full"></div>
      </div>

      <div className="bg-white shadow-md rounded-md p-6 mb-6 flex items-center relative">
        <div className="flex items-center space-x-4 w-1/2">
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
            <p className="text-blue-500 text-sm mt-2 underline cursor-pointer">
              Edit Profile
            </p>
          </div>
        </div>

        <div className="h-20 w-px bg-gray-500 absolute left-1/2 transform -translate-x-1/2"></div>

        <div className="text-right w-1/2">
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
          <div className="w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
            T
          </div>
          <div>
            <h3 className="text-gray-800 font-semibold">Tourbom</h3>
            <p className="text-sm text-gray-500">/crm/sales</p>
          </div>
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
          <div className="w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
            T
          </div>
          <div>
            <h3 className="text-gray-800 font-semibold">Tourbom</h3>
            <p className="text-sm text-gray-500">/crm/sales</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfilePage;
