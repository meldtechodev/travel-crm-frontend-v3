import React from 'react';
import { FaListAlt } from 'react-icons/fa'; // Import an icon for the list
import { Link } from 'react-router-dom'; // Import Link for navigation

const Package = () => {
  return (
    <div className="flex flex-col items-start justify-start w-80 h-full bg-gray-100 p-4 shadow-md"> {/* Increased width and added shadow */}
      <h1 className="text-2xl font-bold mb-4">Packages</h1> {/* Adjusted margin for better spacing */}
      
      {/* Icon and Text Section */}
      <div className="flex items-center mb-2">
        <FaListAlt className="text-gray-700 mr-2" /> {/* Icon on the left */}
        <span className="text-gray-700 font-bold">All Package List</span> {/* Text on the right */}
      </div>

      <hr className="border-gray-700 mb-16 w-full" /> {/* Line below the icon and text */}

      <div className="button-container flex flex-col space-y-2 w-full"> {/* Adjusted spacing for buttons */}
        <button className="bg-gray-300 p-2 rounded mx-auto w-full text-left flex justify-between items-center"> {/* Centered button */}
          <span>New Packages</span>
          <span className="ml-2">+</span> {/* Plus symbol on the right */}
        </button>
        <button className="bg-gray-300 p-2 rounded mx-auto w-full text-left">Quick Packages</button> {/* Centered button */}
        
        {/* Link to PackageDashboard */}
        <Link to="/home/packageDashboard" className="w-full"> {/* Adjust Link */}
          <button className="bg-gray-300 p-2 rounded mx-auto w-full text-left">Package Dashboard</button>
        </Link>
      </div>
    </div>
  );
};

export default Package;
