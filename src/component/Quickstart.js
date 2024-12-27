import React, { useContext, useState } from "react";
import BodyHeader from "./BodyHeader";
import { Link } from "react-router-dom";
import Department from "../pages/Department";
import Designation from "../pages/Designation";
import Roles from "../pages/Roles";
import NewMember from "../pages/NewMember";
import { UserContext } from "../contexts/userContext";


const Quickstart = () => {
  const [addData, setAddData] = useState('');
  const { user, setUser } = useContext(UserContext);

  return (<>
    <div className="w-full mt-0">
      <BodyHeader />
      <div className="flex flex-col lg:flex-row overflow-auto bg-[#e2e8f0] w-full ">
        {/* Left Section */}
        <div className="quickstartLeft w-3/4 p-4 ">
          {/* Welcome Box */}
          <div className="welcome-box bg-white p-4 mb-4 rounded-lg shadow-md">
            <p className="text-2xl font-bold text-red-500">{user && user.company && user.company.companyname}</p>
            <p className="mt-2 text-gray-600">
              Meld Techo Travel CRM is designed to transform the way you manage your business. Here are some simple steps to get you started
            </p>
          </div>

          {/* Set Up Your Account Box */}
          <div className="setup-box bg-white p-4 rounded-lg shadow-md mb-4">
            {/* Step 1 */}
            <div className="flex items-start mb-4">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-300 mr-3">
                <span className="text-gray-800 font-semibold">1</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Set Up Your Profile</h3>
                <p className="newtext text-gray-600">
                  Add your personal details to the profile, upload your photo, and customize how your account looks.
                </p>
                <Link to='/home/profile-page'>
                  <button className="mt-2 border bg-red-500  text-white  text-sm py-2 px-4 rounded mb-2">
                    Complete Your Profile
                  </button>
                </Link>
              </div>
            </div>
            <hr className="border-t border-black my-4" />

            {/* Step 2 */}
            <div className="flex items-start mb-4">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-300 mr-3">
                <span className="text-gray-800 font-semibold">2</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Set Up Your Organisation Profile</h3>
                <p className="text-gray-600">
                  Update and manage your organization's details and key information in one place.
                </p>
                <Link to='/home/organization-details/1'>
                  <button className="mt-2 border bg-red-500  text-white  text-sm py-2 px-4 rounded mb-2">
                    Complete Your Organisation Profile
                  </button>
                </Link>
              </div>
            </div>
            <hr className="border-t border-black my-4" />

            {/* Step 3 */}
            <div className="flex items-start mb-4">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-300 mr-3">
                <span className="text-gray-800 font-semibold">3</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Invite Your Teammates</h3>
                <p className="text-gray-600">
                  Add new members to your team and assign roles for seamless collaboration.
                </p>
                <button className="mt-2 border bg-red-500  text-white  text-sm py-2 px-4 rounded mb-2"
                  onClick={() => setAddData('New Member')}>
                  Add More Members
                </button>
              </div>
            </div>
            <hr className="border-t border-black my-4" />

            {/* Step 4 */}
            <div className="flex items-start mb-4">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-300 mr-3">
                <span className="text-gray-800 font-semibold">4</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Set Up Your Roles</h3>
                <p className="text-gray-600">
                  Define specific permissions and responsibilities for system users.
                </p>
                <button className="mt-2 border bg-red-500  text-white  text-sm py-2 px-4 rounded mb-2"
                  onClick={() => setAddData('Roles')}
                >
                  Add More Roles
                </button>
              </div>
            </div>
            <hr className="border-t border-black my-4" />

            {/* Step 5 */}
            <div className="flex items-start mb-4">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-300 mr-3">
                <span className="text-gray-800 font-semibold">5</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Set Up Your Departments</h3>
                <p className="text-gray-600">
                  Organize your workforce into distinct functional areas for better management.
                </p>
                <button className="mt-2 border bg-red-500  text-white  text-sm py-2 px-4 rounded mb-2"
                  onClick={() => setAddData('Department')}>
                  Add More Departments
                </button>
              </div>
            </div>

            <hr className="border-t border-black my-4" />

            <div className="flex items-start mb-4">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-300 mr-3">
                <span className="text-gray-800 font-semibold">6</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Set Up Your Designations</h3>
                <p className="text-gray-600">
                  Specify titles and roles within the organization to streamline reporting.
                </p>
                <button className="mt-2 border bg-red-500  text-white  text-sm py-2 px-4 rounded mb-2"
                  onClick={() => setAddData('Designation')}>
                  Add More Designations
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="quickstartRight flex-auto lg:w-1/3 p-4 pl-0">
          {/* Video Boxes */}
          <div className="video-section bg-white p-4 mb-4 rounded-lg shadow-md h-32 sm:h-48">
            <h2 className="text-lg font-bold">Motherson Travel CRM Video Tour</h2>
            <button className="mt-2 border bg-red-500  text-white  text-sm py-2 px-4 rounded mb-2">
              Watch video
            </button>
          </div>

          <div className="video-section bg-white p-4 mb-4 rounded-lg shadow-md h-32 sm:h-48">
            <h2 className="text-lg font-bold">Motherson Travel CRM Video Tour</h2>
            <button className="mt-2 border bg-red-500  text-white  text-sm py-2 px-4 rounded mb-2">
              Watch video
            </button>
          </div>

          <div className="video-section bg-white p-4 mb-4 rounded-lg shadow-md h-32 sm:h-48">
            <h2 className="text-lg font-bold">Motherson Travel CRM Video Tour</h2>
            <button className="mt-2 border bg-red-500  text-white  text-sm py-2 px-4 rounded mb-2">
              Watch video
            </button>
          </div>

          <div className="video-section bg-white p-4 mb-4 rounded-lg shadow-md h-32 sm:h-48">
            <h2 className="text-lg font-bold">Motherson Travel CRM Video Tour</h2>
            <button className="mt-2 border bg-red-500  text-white  text-sm py-2 px-4 rounded mb-2">
              Watch video
            </button>
          </div>
        </div>
      </div>
    </div>
    <div
      className="submenu-menu"
      style={{ right: addData === "Department" ? "0" : "-100%" }}
    >
      <Department
        isOpen={addData === "Department"}
        onClose={() => setAddData('')}
      />
    </div>
    <div
      className="submenu-menu"
      style={{ right: addData === "Designation" ? "0" : "-100%" }}
    >
      <Designation
        isOpen={addData === "Designation"}
        onClose={() => setAddData('')}
      />
    </div>
    <div
      className="submenu-menu"
      style={{ right: addData.toLowerCase().includes("Roles".toLowerCase()) ? "0" : "-100%" }}
    >
      <Roles isOpen={addData.toLowerCase().includes("Roles".toLowerCase())} onClose={() => setAddData('')} />
    </div>
    <div
      className="submenu-menu"
      style={{ right: addData.toLowerCase().includes("New Member".toLowerCase()) ? "0" : "-100%" }}
    >
      <NewMember
        isOpen={addData.toLowerCase().includes("New Member".toLowerCase())}
        onClose={() => setAddData('')}
      />
    </div>
  </>

  );
};

export default Quickstart;