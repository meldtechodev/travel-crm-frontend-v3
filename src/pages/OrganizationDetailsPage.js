import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OrganizationDetailsPage = () => {
  const [formData, setFormData] = useState({
    organizationName: "",
    organizationEmail: "",
    organizationAddress: "",
    organizationPhone: "",
    organizationCountryCode: "",
    organizationWebsite: "",
    status: true, // Status field
    organizationLogo: null, // File object for the logo
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFormData((prevState) => ({
      ...prevState,
      organizationLogo: file,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check for required fields
    const requiredFields = [
      "organizationName",
      "organizationEmail",
      "organizationAddress",
      "organizationPhone",
    ];
    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      toast.error(
        `Please fill out the required fields: ${missingFields.join(", ")}`,
        { position: "top-right" }
      );
      return;
    }

    toast.success("Organization details saved successfully!", {
      position: "top-right",
    });

    console.log("Form Data Submitted:", formData);
  };

  const handleCancel = () => {
    setFormData({
      organizationName: "",
      organizationEmail: "",
      organizationAddress: "",
      organizationPhone: "",
      organizationCountryCode: "",
      organizationWebsite: "",
      status: true,
      organizationLogo: null,
    });

    toast.info("Form reset successfully!", { position: "top-right" });
  };

  return (
    <div className="min-h-screen bg-gray-200 p-6">
      <div className="bg-white shadow-md rounded-md p-8 max-w-full mb-10">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Organization details
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          You can use your organization's branding by customizing the settings
          below.
        </p>
        <div className="border border-gray-300 rounded-md p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
          <div className="text-center sm:text-left mb-4 sm:mb-0">
            <p className="text-gray-600 text-sm sm:text-base">
              Your current Freshworks organization account URL is:
            </p>
            <p className="text-blue-600 font-medium mt-1 sm:mt-0 break-words text-sm sm:text-base md:text-lg overflow-x-auto">
              <span className="block w-full break-all">
                https://tourbom.myfreshworks.com
              </span>
            </p>
          </div>

          <div className="mt-4 sm:mt-0 sm:flex sm:gap-2 sm:w-auto w-full">
            <button className="bg-gray-200 border border-gray-300 text-gray-700 px-4 py-2 rounded text-sm mb-2 sm:mb-0 w-full sm:w-auto">
              Change Organization URL
            </button>
            <button className="bg-red-500 text-white px-4 py-2 rounded text-sm w-full sm:w-auto">
              Create Custom URL
            </button>
          </div>
        </div>

        <ToastContainer />
        <div className="bg-white border shadow-md rounded-md p-8 max-w-full mx-auto w-full">
          <form onSubmit={handleSubmit} className="space-y-6 w-full">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Organization Logo
              </h2>
              <div className="border rounded-md p-2 bg-gray-50">
                <div className="flex flex-col md:flex-row items-center">
                  {/* Logo Image Portion */}
                  <div className="w-full md:w-1/2 h-20 border rounded-md bg-gray-100 flex items-center justify-center">
                    {formData.organizationLogo ? (
                      <img
                        src={URL.createObjectURL(formData.organizationLogo)}
                        alt="Uploaded Logo"
                        className="h-full object-contain"
                      />
                    ) : (
                      <span className="text-gray-500">Logo</span>
                    )}
                  </div>
                  {/* Upload Button */}
                  <div className="mt-4 md:mt-0 md:ml-4">
                    <label
                      htmlFor="organizationLogo"
                      className="text-blue-500 underline cursor-pointer"
                    >
                      Upload
                    </label>
                    <input
                      type="file"
                      id="organizationLogo"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  We recommend a resolution of at least 120x80 and 4:1 aspect
                  ratio.
                </p>
              </div>
            </div>

            <hr className="my-6" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="organizationName"
                  className="block text-sm font-medium"
                >
                  Organization Name
                </label>
                <input
                  type="text"
                  id="organizationName"
                  className="mt-1 w-full border rounded p-2"
                  placeholder="Enter organization name"
                  name="organizationName"
                  value={formData.organizationName}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label
                  htmlFor="organizationEmail"
                  className="block text-sm font-medium"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="organizationEmail"
                  className="mt-1 w-full border rounded p-2"
                  placeholder="Enter organization email"
                  name="organizationEmail"
                  value={formData.organizationEmail}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label
                  htmlFor="organizationCountryCode"
                  className="block text-sm font-medium"
                >
                  Country Code
                </label>
                <input
                  type="text"
                  id="organizationCountryCode"
                  className="mt-1 w-full border rounded p-2"
                  placeholder="Enter country code"
                  name="organizationCountryCode"
                  value={formData.organizationCountryCode}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label
                  htmlFor="organizationPhone"
                  className="block text-sm font-medium"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="organizationPhone"
                  className="mt-1 w-full border rounded p-2"
                  placeholder="Enter phone number"
                  name="organizationPhone"
                  value={formData.organizationPhone}
                  onChange={handleInputChange}
                />
              </div>

              <div className="col-span-1 sm:col-span-2">
                <label
                  htmlFor="organizationAddress"
                  className="block text-sm font-medium"
                >
                  Address
                </label>
                <textarea
                  id="organizationAddress"
                  className="mt-1 w-full border rounded p-2"
                  placeholder="Enter organization address"
                  name="organizationAddress"
                  value={formData.organizationAddress}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
              <div>
                <label
                  htmlFor="organizationWebsite"
                  className="block text-sm font-medium"
                >
                  Website
                </label>
                <input
                  type="url"
                  id="organizationWebsite"
                  className="mt-1 w-full border rounded p-2"
                  placeholder="Enter website URL"
                  name="organizationWebsite"
                  value={formData.organizationWebsite}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium">
                  Status
                </label>
                <select
                  id="status"
                  className="mt-1 p-2 w-full border rounded"
                  name="status"
                  value={formData.status.toString()}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      status: e.target.value === "true",
                    }))
                  }
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrganizationDetailsPage;
