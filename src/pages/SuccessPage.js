import React from 'react';
import Confetti from 'react-confetti';
import { useNavigate } from 'react-router-dom';
import { useWindowSize } from 'react-use';

const SuccessPage = () => {
  const { width, height } = useWindowSize(); // Dynamically adjust confetti size

  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 relative">
      {/* Confetti Animation */}
      <Confetti width={width} height={height} />

      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md text-center">
        <div className="mb-6">
          <div className="flex justify-center items-center w-12 h-12 rounded-full bg-green-100 mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Congratulations!!!
          </h2>
          <p className="text-gray-600">
            You have successfully completed the installation process.
          </p>
        </div>
        <div className="flex justify-center space-x-4">
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
            onClick={() => navigate("/login")}
          >
            Browse Admin Panel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
