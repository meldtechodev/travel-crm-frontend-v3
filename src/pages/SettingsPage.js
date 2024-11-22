import React from "react";
import {
  FaProjectDiagram,
  FaTasks,
  FaUsers,
  FaRegCalendarAlt,
  FaComments,
  FaMoneyBillWave,
  FaFileAlt,
  FaSlack,
  FaBitbucket,
  FaGitlab,
  FaMailchimp,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { MdOutlineGroup, MdTimeline, MdBusinessCenter } from "react-icons/md";
import { IoIosChatbubbles } from "react-icons/io";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { FiMoreVertical } from "react-icons/fi";

const SettingsPage = () => {
  const coreModules = [
    { icon: <FaProjectDiagram />, name: "Projects", status: "Installed" },
    { icon: <FaTasks />, name: "Tasks", status: "Installed" },
    { icon: <MdBusinessCenter />, name: "CRM", status: "Installed" },
    { icon: <FaFileAlt />, name: "Files", status: "Installed" },
    { icon: <FaUsers />, name: "My Team", status: "Installed" },
    { icon: <FaComments />, name: "Messenger", status: "Installed" },
    { icon: <FaMoneyBillWave />, name: "Finance", status: "Installed" },
    { icon: <FaRegCalendarAlt />, name: "Calendar", status: "Installed" },
  ];

  const addons = [
    { icon: <MdOutlineGroup />, name: "Groups", status: "Installed" },
    { icon: <MdTimeline />, name: "Time Indicator", status: "Not Active" },
    { icon: <MdBusinessCenter />, name: "Products", status: "Installed" },
    { icon: <MdBusinessCenter />, name: "Project Issues", status: "Installed" },
  ];

  const integrations = [
    { icon: <AiOutlineCloudUpload />, name: "CSV-Import", status: "Installed" },
    { icon: <IoIosChatbubbles />, name: "Telephony", status: "Not Active" },
    { icon: <FaRegCalendarAlt />, name: "Tilda", status: "Not Active" },
    { icon: <FaRegCalendarAlt />, name: "Calendly", status: "Not Active" },
    { icon: <FaMailchimp />, name: "Mailchimp", status: "Not Active" },
    { icon: <FaSlack />, name: "Slack", status: "Not Active" },
    { icon: <IoIosChatbubbles />, name: "JivoChat", status: "Not Active" },
    { icon: <FaBitbucket />, name: "Bitbucket", status: "Not Active" },
    { icon: <FaGitlab />, name: "GitLab", status: "Not Active" },
    { icon: <IoIosChatbubbles />, name: "UseResponse", status: "Not Active" },
  ];

  return (
    <div className="min-h-screen bg-gray-200 mb-12">
      {/* Top Navigation Bar */}
      <div className="flex flex-wrap fixed top-10 left-20 right-0 justify-between items-center px-4 sm:px-6 py-4 bg-white border-b">
        <h1 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-0">
          Settings
        </h1>
        <div className="flex flex-wrap items-center justify-between space-x-4 sm:space-x-8 w-full sm:w-auto">
          <nav className="flex space-x-4 sm:space-x-6 overflow-x-auto">
            <button className="text-gray-600 pb-1 hover:text-blue-600 whitespace-nowrap">
              Subscription
            </button>
            <Link to="/home/company-profile">
              <button className="text-gray-600 pb-1 hover:text-blue-600 whitespace-nowrap">
                Portal Settings
              </button>
            </Link>
          </nav>
          <FiMoreVertical className="text-gray-400 text-xl cursor-pointer" />
        </div>
      </div>

      <div className="flex flex-col md:flex-row mt-10">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md p-6 hidden md:block">
          <ul className="space-y-4">
            <li className="text-blue-600 font-medium cursor-pointer">Apps</li>
            <li className="text-gray-600 cursor-pointer">All</li>
            <li className="text-gray-600 cursor-pointer">Core Modules</li>
            <li className="text-gray-600 cursor-pointer">Add-Ons</li>
            <li className="text-gray-600 cursor-pointer">Integrations</li>
          </ul>
        </aside>

        {/* Toggle Sidebar for small screens */}
        <button
          className="block md:hidden bg-blue-600 text-white px-4 py-2 m-4 rounded shadow-md"
          onClick={() =>
            document.getElementById("sidebar").classList.toggle("hidden")
          }
        >
          Menu
        </button>
        <aside
          id="sidebar"
          className="w-64 bg-white shadow-md p-6 hidden absolute top-0 left-0 z-10 h-full md:hidden"
        >
          <ul className="space-y-4">
            <li className="text-blue-600 font-medium cursor-pointer">Apps</li>
            <li className="text-gray-600 cursor-pointer">All</li>
            <li className="text-gray-600 cursor-pointer">Core Modules</li>
            <li className="text-gray-600 cursor-pointer">Add-Ons</li>
            <li className="text-gray-600 cursor-pointer">Integrations</li>
          </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {/* Core Modules Section */}
          <h3 className="text-xl font-semibold text-gray-800 mb-6">
            Core Modules
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {coreModules.map((module, index) => (
              <div
                key={index}
                className="flex flex-col items-center p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition"
              >
                <div className="text-4xl text-blue-500 mb-2">{module.icon}</div>
                <h4 className="text-lg font-medium text-gray-800">
                  {module.name}
                </h4>
                <p className="text-sm text-gray-500">{module.status}</p>
              </div>
            ))}
          </div>

          {/* Add-ons Section */}
          <h3 className="text-xl font-semibold text-gray-800 my-6">Add-ons</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {addons.map((addon, index) => (
              <div
                key={index}
                className={`flex flex-col items-center p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition ${
                  addon.status === "Not Active" ? "opacity-75" : ""
                }`}
              >
                <div className="text-4xl text-blue-500 mb-2">{addon.icon}</div>
                <h4 className="text-lg font-medium text-gray-800">
                  {addon.name}
                </h4>
                <p
                  className={`text-sm ${
                    addon.status === "Not Active"
                      ? "text-red-500"
                      : "text-gray-500"
                  }`}
                >
                  {addon.status}
                </p>
              </div>
            ))}
          </div>

          {/* Integrations Section */}
          <h3 className="text-xl font-semibold text-gray-800 my-6">
            Integrations
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {integrations.map((integration, index) => (
              <div
                key={index}
                className={`flex flex-col items-center p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition ${
                  integration.status === "Not Active" ? "opacity-75" : ""
                }`}
              >
                <div className="text-4xl text-blue-500 mb-2">
                  {integration.icon}
                </div>
                <h4 className="text-lg font-medium text-gray-800">
                  {integration.name}
                </h4>
                <p
                  className={`text-sm ${
                    integration.status === "Not Active"
                      ? "text-red-500"
                      : "text-gray-500"
                  }`}
                >
                  {integration.status}
                </p>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;
