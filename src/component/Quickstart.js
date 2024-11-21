import React from "react";
import BodyHeader from "./BodyHeader";

const Quickstart = () => {
  return (
    <div className="w-full mt-0">
      <BodyHeader />
      <div className="flex flex-col lg:flex-row overflow-auto bg-[#e2e8f0] w-full ">
        {/* Left Section */}
        <div className="quickstartLeft lg:w-full p-6 ">
          {/* Welcome Box */}
          <div className="welcome-box bg-white p-4 mb-4 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-[#5867dd]">Welcome to Motherson</h1>
            <p className="mt-2 text-gray-600">
              Motherson is designed to transform the way you manage your business. Here are some simple steps to get you started.
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
                <h3 className="text-lg font-semibold">Set up your account</h3>
                <p className="newtext text-gray-600">
                  Add your personal details to the profile, upload your photo, and customize how your account looks.
                </p>
                <button className="mt-2 bg-[#5867dd] text-white px-4 py-2 rounded-md transition-colors duration-300">
                  Complete your profile
                </button>
              </div>
            </div>
            <hr className="border-t border-black my-4" />

            {/* Step 2 */}
            <div className="flex items-start mb-4">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-300 mr-3">
                <span className="text-gray-800 font-semibold">2</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Set up your account</h3>
                <p className="text-gray-600">
                  Add your personal details to the profile, upload your photo, and customize how your account looks.
                </p>
                <button className="mt-2 bg-[#5867dd] text-white px-4 py-2 rounded-md transition-colors duration-300">
                  Complete your profile
                </button>
              </div>
            </div>
            <hr className="border-t border-black my-4" />

            {/* Step 3 */}
            <div className="flex items-start mb-4">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-300 mr-3">
                <span className="text-gray-800 font-semibold">3</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Set up your account</h3>
                <p className="text-gray-600">
                  Add your personal details to the profile, upload your photo, and customize how your account looks.
                </p>
                <button className="mt-2 bg-[#5867dd] text-white px-4 py-2 rounded-md transition-colors duration-300">
                  Complete your profile
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
                <h3 className="text-lg font-semibold">Set up your account</h3>
                <p className="text-gray-600">
                  Add your personal details to the profile, upload your photo, and customize how your account looks.
                </p>
                <button className="mt-2 bg-[#5867dd] text-white px-4 py-2 rounded-md transition-colors duration-300">
                  Complete your profile
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
                <h3 className="text-lg font-semibold">Set up your account</h3>
                <p className="text-gray-600">
                  Add your personal details to the profile, upload your photo, and customize how your account looks.
                </p>
                <button className="mt-2 bg-[#5867dd] text-white px-4 py-2 rounded-md transition-colors duration-300">
                  Complete your profile
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="quickstartRight flex-auto lg:w-1/3 p-6">
          {/* Video Boxes */}
          <div className="video-section bg-white p-4 mb-4 rounded-lg shadow-md h-32 sm:h-48">
            <h2 className="text-lg font-bold">Motherson Video Tour</h2>
            <button className="mt-2 bg-[#5867dd] text-white px-4 py-2 rounded-md transition-colors duration-300">
              Watch video
            </button>
          </div>

          <div className="video-section bg-white p-4 mb-4 rounded-lg shadow-md h-32 sm:h-48">
            <h2 className="text-lg font-bold">Motherson Video Tour</h2>
            <button className="mt-2 bg-[#5867dd] text-white px-4 py-2 rounded-md transition-colors duration-300">
              Watch video
            </button>
          </div>

          <div className="video-section bg-white p-4 mb-4 rounded-lg shadow-md h-32 sm:h-48">
            <h2 className="text-lg font-bold">Motherson Video Tour</h2>
            <button className="mt-2 bg-[#5867dd] text-white px-4 py-2 rounded-md transition-colors duration-300">
              Watch video
            </button>
          </div>

          <div className="video-section bg-white p-4 mb-4 rounded-lg shadow-md h-32 sm:h-48">
            <h2 className="text-lg font-bold">Motherson Video Tour</h2>
            <button className="mt-2 bg-[#5867dd] text-white px-4 py-2 rounded-md transition-colors duration-300">
              Watch video
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quickstart;
