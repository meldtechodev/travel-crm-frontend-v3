import React, { useState } from "react";
import Select, { components } from 'react-select';

const NewTransportationForm = ({ isOpen, onClose }) => {
  const [selectedDestinations, setSelectedDestinations] = useState([]);
  const [selectedItineraries, setSelectedItineraries] = useState([]);
  const [selectedInclusions, setSelectedInclusions] = useState([]);
  const [selectedExclusions, setSelectedExclusions] = useState([]);
  const [formData, setFormData] = useState({
    transportMode: "",
    transportSupplier: "",
    pricePerDay: 0,
    status: false,
  });

  // Custom Option Component
  const CustomOption = (props) => {
    return (
      <components.Option {...props}>
        <input
          type="checkbox"
          checked={props.isSelected}
          onChange={() => null}
          style={{ marginRight: 10 }}
        />
        {props.label}
      </components.Option>
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  }

  const handleChange = (selectedOptions) => {
    setSelectedDestinations(selectedOptions);
  };

  const handleItineraryChange = (selectedOptions) => {
    setSelectedItineraries(selectedOptions);
  };

  const handleInclusionChange = (selectedOptions) => {
    setSelectedInclusions(selectedOptions);
  };

  const handleExclusionChange = (selectedOptions) => {
    setSelectedExclusions(selectedOptions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    selectedDestinations.map(option => option.label).join(', ');
  };

  return (
    <div className={`fixed top-0 right-0 h-full bg-gray-200 shadow-lg transform transition-transform duration-500 ${isOpen ? "translate-x-0" : "translate-x-[850px]"} mt-4 sm:mt-8 md:mt-12 lg:w-[800px] sm:w-[400px] md:w-[500px] z-50`}>
      <button onClick={() => onClose(true)} className="absolute top-[12px] left-[-22px] font-semibold text-white text-sm bg-red-700 square px-3  py-1.5 border border-1 border-transparent hover:border-red-700 hover:bg-white hover:text-red-700">X</button>
      <div className="flex justify-between items-center p-4 pl-8 bg-white shadow-md">
        <h2 className="text-lg font-bold text-black">New Transportation Mode</h2>
      </div>
      <div className="border-b border-gray-300 shadow-sm"></div>

      <form className="p-4 overflow-y-auto h-[calc(100vh-160px)]" onSubmit={handleSubmit}>
        <div className="mb-6">
          <h3 className="bg-red-700 text-white p-2 rounded">Basic Transportation Details</h3>
        </div>
        <div className="mb-4">
          <label htmlFor="vendors" className="block text-sm font-medium">Transport Mode</label>
          <input
            type="text"
            id="vendorName"
            name="vendorName"
            value={formData.transportMode}
            onChange={handleInputChange}
            className="mt-1 p-2 w-full border rounded"
            placeholder="Enter Transport Mode"
          />
        </div>
        <div className="flex justify-between mb-4">
          <div className="w-1/2 mr-2">
            <label htmlFor="destinations" className="block text-sm font-medium">Transport Supplier</label>
            <input
              type="text"
              id="vendorContactNo"
              name="vendorContactNo"
              value={formData.transportSupplier}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border rounded"
              placeholder="Enter Transport Supplier"
            />
          </div>
          <div className="w-1/2 mr-2">
            <label htmlFor="destinations" className="block text-sm font-medium">Price per day</label>
            <input
              type="email"
              id="vendorEmail"
              name="vendorEmail"
              value={formData.pricePerDay}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border rounded"
              placeholder="Enter Price per day"
            />
          </div>
        </div>
        <div className="flex items-center p-3 bg-white shadow-lg rounded w-full fixed bottom-12 left-0 right-0">
          <button type="submit" className="bg-red-700 text-white px-4 py-2 rounded shadow mr-1">Submit</button>
          <button type="button" className="bg-red-700 text-white px-4 py-2 rounded shadow">Reset</button>
        </div>
      </form>
    </div>
  );
};

export default NewTransportationForm;
