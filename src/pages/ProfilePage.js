import React, { useState } from "react";
import { FaFacebook, FaLinkedin, FaTwitter } from "react-icons/fa";

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "Aditi",
    middleName: "",
    lastName: "",
    workNumber: "8899889988",
    mobileNumber: "",
    companyName: "Meld Techo",
    jobTitle: "Software Developer",
    language: "English",
    timeZone: "(GMT-04:00) Eastern Time (US & Canada)",
  });

  const [formData, setFormData] = useState(profileData);

  const handleEditProfileClick = () => {
    setFormData(profileData); // Reset form data to current profile data when editing starts
    setIsEditing(true);
  };

  const handleCloseModal = () => {
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    setProfileData(formData);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-200 p-4 overflow-auto mb-12">
      {/* Custom Header */}
      <div className="flex justify-between items-center w-full h-16 bg-white shadow-md mb-4 px-6">
        <h1 className="text-lg font-bold">Profile</h1>
        <div className="w-4 h-4 bg-red-500 rounded-full"></div>
      </div>

      {/* Profile Header */}
      <div className="bg-white shadow-md rounded-md p-6 mb-6">
        <div className="flex items-center justify-between">
          {/* Profile Picture and Info */}
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-3xl font-semibold">
                {profileData.firstName.charAt(0)}
              </span>
            </div>
            <div>
              <h1 className="text-xl font-bold">{profileData.firstName}</h1>
            </div>
          </div>
          {/* Edit Profile Button */}
          <button
            onClick={handleEditProfileClick}
            className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-md border"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-600"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M17.414 2.586a2 2 0 00-2.828 0l-10 10a2 2 0 00-.586 1.414V17a2 2 0 002 2h2.586a2 2 0 001.414-.586l10-10a2 2 0 000-2.828l-2-2zM12.586 6l2 2L5 17H3v-2l9.586-9.586z" />
            </svg>
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-md w-2/3 max-w-2xl h-2/3">
            <h2 className="text-lg font-bold mb-4">Edit Profile</h2>
            {/* Profile Edit Form */}
            <form onSubmit={handleSave} className="grid grid-cols-3 gap-4">
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="First Name"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">
                  Middle Name
                </label>
                <input
                  type="text"
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="Middle Name"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="Last Name"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">
                  Work Number
                </label>
                <input
                  type="text"
                  name="workNumber"
                  value={formData.workNumber}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="Work Number"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">
                  Mobile Number
                </label>
                <input
                  type="text"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="Mobile Number"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="Company Name"
                />
              </div>
              <div className="mb-4 col-span-3">
                <label className="block text-sm font-bold mb-2">
                  Job Title
                </label>
                <input
                  type="text"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="Job Title"
                />
              </div>
              <div className="col-span-3 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-gray-200 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-700 text-white rounded-md"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white shadow-md rounded-md p-6">
        <div className="border-b flex space-x-6 pb-3 mb-6">
          <button className="text-black font-semibold border-b-2 border-black pb-1">
            Profile
          </button>
          <button className="text-gray-500 hover:text-black">Security</button>
        </div>

        {/* Work Information */}
        <section className="mb-6">
          <h2 className="text-lg font-bold mb-4">Work Information</h2>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-sm font-bold">First Name *</p>
              <p className="text-sm">{profileData.firstName || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-bold">Middle Name</p>
              <p className="text-sm">{profileData.middleName || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-bold">Last Name *</p>
              <p className="text-sm">{profileData.lastName || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-bold">Work Number</p>
              <p className="text-sm">{profileData.workNumber || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-bold">Mobile Number</p>
              <p className="text-sm">{profileData.mobileNumber || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-bold">Company Name</p>
              <p className="text-sm">{profileData.companyName || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-bold">Job Title</p>
              <p className="text-sm">{profileData.jobTitle || "-"}</p>
            </div>
          </div>
        </section>
        <hr className="mb-6" />
        {/* Other Information */}
        <section>
          <h2 className="text-lg font-bold mb-4">Other Information</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-bold">Language</p>
              <p className="text-sm">{profileData.language}</p>
            </div>
            <div>
              <p className="text-sm font-bold">Time Zone</p>
              <p className="text-sm">{profileData.timeZone}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 mt-6">
            <a href="#" className="text-blue-600">
              <FaFacebook size={24} />
            </a>
            <a href="#" className="text-blue-500">
              <FaLinkedin size={24} />
            </a>
            <a href="#" className="text-blue-400">
              <FaTwitter size={24} />
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProfilePage;
