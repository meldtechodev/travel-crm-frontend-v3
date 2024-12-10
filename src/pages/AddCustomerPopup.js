import React, { useState } from "react";

const AddCustomerPopup = ({isOpen, onClose}) => {
  // const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      {/* Button to open the popup */}
      {/* <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Add Customer
      </button> */}

      {/* Popup Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative">
            {/* Close Button */}
            <button
              onClick={() => onClose(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
            >
              ✖
            </button>

            {/* Popup Content */}
            <h2 className="text-lg font-semibold mb-4">Add Customer</h2>
            <form className="space-y-4">
              {/* Email ID */}
              <div>
                <label className="block text-sm font-medium">Email ID *</label>
                <input
                  type="email"
                  placeholder="Email ID"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>

              {/* Mobile Number */}
              <div className="flex items-center space-x-2">
                <select className="border border-gray-300 rounded px-2 py-2">
                  <option>+91</option>
                </select>
                <input
                  type="text"
                  placeholder="Mobile Number"
                  className="flex-grow border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <p className="text-red-500 text-sm">
                Customer already exists <a href="/" className="underline">view here</a>
              </p>

              {/* Salutation and First Name */}
              <div className="flex items-center space-x-2">
                <select className="w-1/3 border border-gray-300 rounded px-3 py-2">
                  <option>Select</option>
                </select>
                <input
                  type="text"
                  placeholder="First Name"
                  className="flex-grow border border-gray-300 rounded px-3 py-2"
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium">Last Name</label>
                <input
                  type="text"
                  placeholder="Last Name"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>

              {/* Lead Source */}
              <div>
                <label className="block text-sm font-medium">Lead Source</label>
                <select className="w-full border border-gray-300 rounded px-3 py-2">
                  <option>Agency</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  className="bg-gray-200 text-black px-4 py-2 rounded"
                  onClick={() => isOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="bg-orange-500 text-white px-4 py-2 rounded">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddCustomerPopup;
