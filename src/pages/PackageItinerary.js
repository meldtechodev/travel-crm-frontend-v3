import React, { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";
import api from "../apiConfig/config";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const PackageItinerary = ({ isOpen, onClose }) => {
  const [destinationOptions, setDestinationOptions] = useState([]);
  const [editorData, setEditorData] = useState("");
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [formData, setFormData] = useState({
    days: [
      {
        title: "",
        meals: {
          breakfast: false,
          lunch: false,
          dinner: false,
        },
        description: "",
        activities: "",
        transportation: "",
        transportationDetails: "",
      },
    ],
  });
  const [user, setUser] = useState({});
  const RoomTypeOptions = [
    { value: "budget", label: "Budget" },
    { value: "deluxe", label: "Deluxe" },
    { value: "luxury", label: "Luxury" },
    { value: "standard", label: "Standard" },
  ];
  const MealTypeOptions = [
    { value: 1, label: "Thai" },
    { value: 2, label: "Indian" },
    { value: 3, label: "Chineese" },
    { value: 4, label: "Italian" },
    { value: 5, label: "American" },
  ];
  // Fetch destinations
  useEffect(() => {
    axios
      .get(`${api.baseUrl}/destinations`)
      .then((response) => {
        const options = response.data.map((destination) => ({
          value: destination.id,
          label: destination.name,
        }));
        setDestinationOptions(options);
      })
      .catch((error) => console.error("Error fetching destinations:", error));
  }, []);

  // Decrypt Token and Fetch User Info
  async function decryptToken(encryptedToken, key, iv) {
    const dec = new TextDecoder();
    const decrypted = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      key,
      encryptedToken
    );
    return dec.decode(new Uint8Array(decrypted));
  }

  async function getDecryptedToken() {
    const keyData = JSON.parse(localStorage.getItem("encryptionKey"));
    const ivBase64 = localStorage.getItem("iv");
    const encryptedTokenBase64 = localStorage.getItem("encryptedToken");

    if (!keyData || !ivBase64 || !encryptedTokenBase64) {
      throw new Error("No token found");
    }

    const key = await crypto.subtle.importKey(
      "jwk",
      keyData,
      { name: "AES-GCM" },
      true,
      ["encrypt", "decrypt"]
    );
    const iv = new Uint8Array(
      atob(ivBase64)
        .split("")
        .map((char) => char.charCodeAt(0))
    );
    const encryptedToken = new Uint8Array(
      atob(encryptedTokenBase64)
        .split("")
        .map((char) => char.charCodeAt(0))
    );

    return await decryptToken(encryptedToken, key, iv);
  }

  useEffect(() => {
    getDecryptedToken()
      .then((token) => {
        return axios.get(`${api.baseUrl}/getbytoken`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Access-Control-Allow-Origin": "*",
          },
        });
      })
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) =>
        console.error("Error fetching protected resource:", error)
      );
  }, []);

  // Handle input changes for the current day
  const handleInputChange = (event, dayIndex) => {
    const { name, value } = event.target;
    setFormData((prevState) => {
      const updatedDays = [...prevState.days];
      updatedDays[dayIndex] = {
        ...updatedDays[dayIndex],
        [name]: value,
      };
      return {
        ...prevState,
        days: updatedDays,
      };
    });
  };
  const handleMealChange = (event, dayIndex) => {
    const { name, checked } = event.target;
    setFormData((prevState) => {
      const updatedDays = [...prevState.days];
      updatedDays[dayIndex] = {
        ...updatedDays[dayIndex],
        meals: {
          ...updatedDays[dayIndex].meals,
          [name]: checked,
        },
      };
      return {
        ...prevState,
        days: updatedDays,
      };
    });
  };

  // Handle destination change
  const handleDestinationChange = (selectedOption) => {
    setSelectedDestination(selectedOption);
  };

  // Add a new day form
  const addNewDay = () => {
    setFormData((prevState) => ({
      ...prevState,
      days: [
        ...prevState.days,
        {
          title: "",
          meals: {
            breakfast: false,
            lunch: false,
            dinner: false,
          },
          description: "",
          activities: "",
          transportation: "",
          transportationDetails: "",
        },
      ],
    }));
  };

  // Submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      destinationId: selectedDestination ? selectedDestination.value : null,
      createdby: user.username,
      modifiedby: user.username,
      isdelete: false,
      itinerary: formData.days,
    };

    try {
      await axios.post(`${api.baseUrl}/itinerary/create`, dataToSend, {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });

      alert("Itinerary created successfully");

      // Reset the form and selected destination after successful submission
      setFormData({
        days: [
          {
            title: "",
            meals: {
              breakfast: false,
              lunch: false,
              dinner: false,
            },
            description: "",
            activities: "",
            transportation: "",
            transportationDetails: "",
          },
        ],
      });
      setSelectedDestination(null);
    } catch (error) {
      console.error("Error creating itinerary:", error);
      alert("Error creating itinerary, please try again.");
    }
  };

  // Handle form reset
  const handleReset = () => {
    setFormData({
      days: [
        {
          title: "",
          meals: {
            breakfast: false,
            lunch: false,
            dinner: false,
          },
          description: "",
          activities: "",
          transportation: "",
          transportationDetails: "",
        },
      ],
    });
    setEditorData('')
    setSelectedDestination(null);
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full bg-gray-200 shadow-lg transform transition-transform duration-500 ${isOpen ? "translate-x-0" : "translate-x-[650px] z-200"
        } w-full sm:w-[calc(100%-120px)] md:w-[400px] lg:w-[600px]`}
    >
      <button
        onClick={() => onClose(true)}
        className="absolute top-[12px] left-[-22px] font-semibold text-white text-sm bg-red-700 square px-3  py-1.5 border border-1 border-transparent hover:border-red-700 hover:bg-white hover:text-red-700"
      >
        X
      </button>
      <div className="flex justify-between items-center p-4 pl-8 bg-white shadow-md">
        <h2 className="text-lg font-bold text-black">New Itinerary</h2>
      </div>
      <div className="border-b border-gray-300 shadow-sm"></div>

      <form className="p-4 h-4/5" onSubmit={handleSubmit}>
        <div className="h-full overflow-y-scroll">
          <div className="mb-6">
            <h3 className="bg-red-700 text-white p-2 rounded">
              List of Itinerary
            </h3>
          </div>

          <div className="flex gap-2 mb-4">
            <div className="w-full">
              <label
                htmlFor="destinationName"
                className="block text-sm font-medium"
              >
                Destination Name
              </label>
              <Select
                id="destinationName"
                options={destinationOptions}
                value={selectedDestination}
                onChange={handleDestinationChange}
                placeholder="Select..."
              />
            </div>
          </div>

          {formData.days.map((day, index) => (
            <div key={index} className="mb-6">
              <div className="shadow-md p-4 bg-white rounded-lg">
                <div className="flex justify-between mb-4 bg-red-700 rounded">
                  <h3 className="text-white p-2">Day {index + 1}</h3>
                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prevState) => {
                        const updatedDays = [...prevState.days];
                        updatedDays.splice(index, 1);
                        return {
                          ...prevState,
                          days: updatedDays,
                        };
                      });
                    }}
                    className="text-white p-2 rounded font-bold"
                  >
                    -
                  </button>
                </div>

                <div className="mb-4">
                  <label
                    htmlFor={`title-${index}`}
                    className="block text-sm font-medium"
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    id={`title-${index}`}
                    className="mt-1 p-2 w-full border rounded bg-gray-200"
                    name="title"
                    value={formData.days[index].title}
                    onChange={(e) => handleInputChange(e, index)}
                  />
                </div>

                <div className="mb-4">
                  <h3 className="block text-sm font-medium mb-2">Meals</h3>
                  <div className="flex gap-2 mb-4">
                    <div className="w-1/3 flex items-center">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="breakfast"
                          checked={formData.days[index].meals.breakfast}
                          onChange={(e) => handleMealChange(e, index)}
                          className="w-6 h-6 mr-2"
                        />{" "}
                        Breakfast
                      </label>
                    </div>
                    <div className="w-1/3 flex items-center">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="lunch"
                          checked={formData.days[index].meals.lunch}
                          onChange={(e) => handleMealChange(e, index)}
                          className="w-6 h-6 mr-2"
                        />{" "}
                        Lunch
                      </label>
                    </div>
                    <div className="w-1/3 flex items-center">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="dinner"
                          checked={formData.days[index].meals.dinner}
                          onChange={(e) => handleMealChange(e, index)}
                          className="w-6 h-6 mr-2"
                        />{" "}
                        Dinner
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium"
                  >
                    Description
                  </label>
                  <CKEditor
                    editor={ClassicEditor}
                    data={editorData}
                    config={{
                      toolbar: [
                        "heading",
                        "|",
                        "bold",
                        "italic",
                        "link",
                        "bulletedList",
                        "numberedList",
                        "blockQuote",
                      ],
                    }}
                    onChange={(event, editor) => {
                      const data = editor.getData();
                      setEditorData(data);
                    }}
                  />
                </div>

                {/* Hotels Table */}
                <div className="mb-4">
                  <h3 className="bg-red-700 text-white p-2 rounded">
                    Select Hotel
                  </h3>
                  <table className="min-w-full bg-white mb-4 border">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="py-2 px-4 border-r">Budget</th>
                        <th className="py-2 px-4 border-r">Deluxe</th>
                        <th className="py-2 px-4 border-r">Luxury</th>
                        <th className="py-2 px-4">Standard</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        {/* Budget Column */}
                        <td className="py-2 px-4 border-r">
                          <div className="mb-2">
                            <label className="block text-sm font-medium">
                              Hotel Name
                            </label>
                            <input
                              type="text"
                              placeholder="Type"
                              className="mt-1 border w-full h-[36px] rounded"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium">
                              Room Type
                            </label>
                            <Select
                              options={RoomTypeOptions}
                              placeholder="Rating"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium">
                              Meal Type
                            </label>
                            <Select
                              options={MealTypeOptions}
                              placeholder="Meals"
                              className="mt-1"
                            />
                          </div>
                        </td>

                        {/* Deluxe Column */}
                        <td className="py-2 px-4 border-r">
                          <div className="mb-2">
                            <label className="block text-sm font-medium">
                              Hotel Name
                            </label>
                            <input
                              type="text"
                              placeholder="Type"
                              className="mt-1 border w-full h-[36px] rounded"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium">
                              Room Type
                            </label>
                            <Select
                              options={RoomTypeOptions}
                              placeholder="Rating"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium">
                              Meal Type
                            </label>
                            <Select
                              options={MealTypeOptions}
                              placeholder="Meals"
                              className="mt-1"
                            />
                          </div>
                        </td>

                        {/* Luxury Column */}
                        <td className="py-2 px-4 border-r">
                          <div className="mb-2">
                            <label className="block text-sm font-medium">
                              Hotel Name
                            </label>
                            <input
                              type="text"
                              placeholder="Type"
                              className="mt-1 border w-full h-[36px] rounded"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium">
                              Room Type
                            </label>
                            <Select
                              options={RoomTypeOptions}
                              placeholder="Rating"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium">
                              Meal Type
                            </label>
                            <Select
                              options={MealTypeOptions}
                              placeholder="Meals"
                              className="mt-1"
                            />
                          </div>
                        </td>

                        {/* Standard Column */}
                        <td className="py-2 px-4">
                          <div className="mb-2">
                            <label className="block text-sm font-medium">
                              Hotel Name
                            </label>
                            <input
                              type="text"
                              placeholder="Type"
                              className="mt-1 border w-full h-[36px] rounded"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium">
                              Room Type
                            </label>
                            <Select
                              options={RoomTypeOptions}
                              placeholder="Rating"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium">
                              Meal Type
                            </label>
                            <Select
                              options={MealTypeOptions}
                              placeholder="Meals"
                              className="mt-1"
                            />
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="mb-4">
                  <label
                    htmlFor={`activities-${index}`}
                    className="block text-sm font-medium bg-red-700 text-white p-2"
                  >
                    Select Activities
                  </label>
                  <div className="border rounded-md p-4">
                    <label
                      className="block text-sm font-medium mb-1"
                      htmlFor={`activities-${index}`}
                    >
                      Activities
                    </label>
                    <select
                      id={`activities-${index}`}
                      className="mt-1 w-full border rounded p-2"
                      name="activities"
                      value={formData.days[index].activities}
                      onChange={(e) => handleInputChange(e, index)}
                    >
                      <option>Select Activity</option>
                      {/* Add options here */}
                    </select>
                  </div>
                </div>
                <div className="mb-4">
                  <label
                    htmlFor={`activities-${index}`}
                    className="block text-sm font-medium bg-red-700 text-white p-2"
                  >
                    Sightseeing
                  </label>
                  <div className="border rounded-md p-4">
                    <label
                      className="block text-sm font-medium mb-1"
                      htmlFor={`activities-${index}`}
                    >
                      sightView
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="sightseeing"
                        className="mt-1 p-2 w-full border border-gray-300 rounded bg-white"
                        name="sightseeing"
                        placeholder="Abu Dhabi City tour (Dubai, United Arab Emirates)"
                        list="sightseeing-options"
                      />
                      <datalist id="sightseeing-options">
                        <option value="Abu Dhabi City tour (Dubai, United Arab Emirates)" />
                        <option value="Abu Dhabi city tour with Ferrari world (Dubai, United Arab Emirates)" />
                      </datalist>
                    </div>
                  </div>
                </div>
                <div className="mb-4">
                  <label
                    htmlFor={`transportationDetails-${index}`}
                    className="block text-sm font-medium bg-red-700 text-white p-2 rounded"
                  >
                    Transportation Types
                  </label>
                  <input
                    type="text"
                    id={`transportationDetails-${index}`}
                    className="mt-1 p-2 w-full border rounded bg-gray-200"
                    name="transportationDetails"
                    value={formData.days[index].transportationDetails}
                    onChange={(e) => handleInputChange(e, index)}
                  />
                </div>
              </div>
            </div>
          ))}

        </div>
      </form>
      {/* Submit and Reset Buttons */}
      <div className="flex justify-between items-center p-3 bg-white shadow-lg rounded w-full fixed bottom-12">
        <div className="flex justify-start space-x-4">
          <button
            type="button"
            className="bg-red-700 text-white px-4 py-2 rounded shadow"
            onClick={handleSubmit}
          >
            Submit
          </button>
          <button
            type="button"
            className="bg-red-700 text-white px-4 py-2 rounded shadow"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  )
}

export default PackageItinerary