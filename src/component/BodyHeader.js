import React, { useState } from 'react';
import { Link, useLocation, Route, Routes } from 'react-router-dom';

const BodyHeader = () => {
  const location = useLocation();
  const activeTab = location.pathname;


  return (
    <>
      <div className=" bg-gray-100 px-10 py-0 shadow-md">
        <div className="flex space-x-4 justify-between md:space-x-10">
          <Link to="/home">
            <button
              className={`header-button text-black font-medium text-sm md:text-base py-2`}
            >
              Home
            </button>
          </Link>

          <div className='flex m-0 p-0 gap-8'>
            <Link to="/home/quickstart" className={` pb-1 ${activeTab === '/home/quickstart' || activeTab === '/home' ? 'border-b-4 border-red-700' : 'hover:border-b-4 hover:border-red-400'
              }`}>
              <button
                className={`header-button text-black font-medium text-sm md:text-base py-2 px-2`}
              >
                Quickstart
              </button>
            </Link>

            <Link to="/home/dashboard" className={` pb-1 ${activeTab === '/home/dashboard' ? 'border-b-4 border-red-700' : 'hover:border-b-4 hover:border-red-400'
              }`}>
              <button
                className={`header-button text-black font-medium text-sm md:text-base px-2 py-2`}
              >
                Dashboard
              </button>
            </Link>
          </div>
          <p></p>
        </div>
      </div>

    </>
  );
};

export default BodyHeader;
