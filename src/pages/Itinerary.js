import React, { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";
import api from "../apiConfig/config";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const Itinerary = ({ isOpen, onClose }) => {
  const [destinationOptions, setDestinationOptions] = useState([]);
  const [editorData, setEditorData] = useState("");
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [formData, setFormData] = useState([
    {
      daytitle: "",
      meals: {
        breakfast: false,
        lunch: false,
        dinner: false,
      },
      program: "",
      hotelOptionsIds: [null, null, null, null],
      activities: {
        id: null
      },
      sightseeing: {
        id: null
      }
    }
  ]);
  const [user, setUser] = useState({});
  const RoomTypeOptions = [
    { value: "budget", label: "Budget" },
    { value: "deluxe", label: "Deluxe" },
    { value: "luxury", label: "Luxury" },
    { value: "standard", label: "Standard" },
  ];
  //   { value: 1, label: "Thai" },
  //   { value: 2, label: "Indian" },
  //   { value: 3, label: "Chineese" },
  //   { value: 4, label: "Italian" },
  //   { value: 5, label: "American" },
  // ];
  // Fetch destinations
  useEffect(() => {
    axios
      .get(`${api.baseUrl}/destination/getall`)
      .then((response) => {
        const options = response.data.map((destination) => ({
          value: destination.id,
          label: destination.destinationName,
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
    let updateData = [...formData]
    updateData[dayIndex].daytitle = event.target.value
    setFormData(updateData)
  };

  const handleMealChange = (event, dayIndex) => {
    const { name, checked } = event.target;

    setFormData((prev, i) => dayIndex === i ? { ...prev, [name]: checked } : prev)
    // setFormData((prevState) => {
    //   const updatedDays = [...prevState.days];
    //   updatedDays[dayIndex] = {
    //     ...updatedDays[dayIndex],
    //     meals: {
    //       ...updatedDays[dayIndex].meals,
    //       [name]: checked,
    //     },
    //   };
    //   return {
    //     ...prevState,
    //     days: updatedDays,
    //   };
    // });


  };

  const [hotelList, setHotelList] = useState([])
  const [roomTypeList, setRoomTypeList] = useState([])
  const [viewHotelList, setViewHotelList] = useState([])
  const [viewRoomTypeList, setViewRoomTypeList] = useState([])
  const [siteSeeingList, setSiteSeeingList] = useState([])
  const [activityList, setActivityList] = useState([])
  const [mealTypeOptions, setMealTypeOptions] = useState([])
  const [ipaddress, setIpAddress] = useState("")

  useEffect(() => {
    axios.get(`${api.baseUrl}/ipAddress`)
      .then((response) => {
        setIpAddress(response.data)
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      })

    axios.get(`${api.baseUrl}/hotel/getAll`)
      .then((response) => {
        const formattedData = response.data.map(item => ({
          ...item,
          value: item.id,
          label: item.hname,
          status: item.status ? 'Active' : 'Inactive'
        }));
        setHotelList(formattedData)
      }).catch(error =>
        console.error('Error fetching country data:', error)
      )

    axios.get(`${api.baseUrl}/roomtypes/getAll`)
      .then((response) => {
        const formattedData = response.data.map(item => ({
          ...item,
          value: item.id,
          label: item.bed_size,
          status: item.status ? 'Active' : 'Inactive'
        }));
        setRoomTypeList(formattedData)
      }).catch(error =>
        console.error('Error fetching country data:', error)
      )

    axios.get(`${api.baseUrl}/sightseeing/getAll`)
      .then((response) => {
        const formattedData = response.data.map(item => ({
          ...item,
          value: item.id,
          label: item.title,
          status: item.status ? 'Active' : 'Inactive'
        }));
        setSiteSeeingList(formattedData)
      }).catch(error =>
        console.error('Error fetching country data:', error)
      )

    axios.get(`${api.baseUrl}/activities/getAll`)
      .then((response) => {
        const formattedData = response.data.map(item => ({
          ...item,
          value: item.id,
          label: item.title,
          status: item.status ? 'Active' : 'Inactive'
        }));
        setActivityList(formattedData)
      }).catch(error =>
        console.error('Error fetching country data:', error)
      )

    axios.get(`${api.baseUrl}/mealspackage/getall`)
      .then((response) => {
        const formattedData = response.data.map(item => ({
          ...item,
          value: item.id,
          label: item.mealstype_code,
          status: item.status ? 'Active' : 'Inactive'
        }));
        setMealTypeOptions(formattedData)
      }).catch(error =>
        console.error('Error fetching country data:', error)
      )

  }, []);

  // Handle destination change
  const handleDestinationChange = (selectedOption) => {
    setViewHotelList([])
    setSelectedDestination(selectedOption);
    let hotel = hotelList.filter(item => item.destination.id === selectedOption.value)
    setViewHotelList(hotel)
  };

  const handleHotelChange = (selected, hIndex, mainIndex) => {
    let updateData = [...formData]
    let hotelUpdate = [...updateData[mainIndex].hotelOptionsIds]

    hotelUpdate[hIndex] = selected

    setFormData((prev, i) => mainIndex === i ? { ...prev, hotelOptionsIds: hotelUpdate } : prev)
  }

  // Add a new day form
  const addNewDay = () => {
    setFormData([...formData,
    {
      daytitle: "",
      breakfast: false,
      lunch: false,
      dinner: false,
      description: "",
      activities: {
        id: null
      },
      sightseeing: {
        id: null
      }
    }
    ]);
  };

  // Submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();

    formData.map(item => {
      let payload = {
        ...item,
        destination: {
          id: selectedDestination.value
        },
        ipaddress: ipaddress,
        status: 1,
        isdelete: 0,
      }

      console.log(payload)
    })

    const dataToSend = {
      destinationId: selectedDestination ? selectedDestination.value : null,
      createdby: user.username,
      modifiedby: user.username,
      isdelete: false,
      ipaddress: ipaddress,
      itinerary: formData,
    };

    // console.log(dataToSend)
    // console.log(formData)
    // try {
    //   await axios.post(`${api.baseUrl}/itinerary/create`, dataToSend, {
    //     headers: {
    //       "Content-Type": "application/json",
    //       "Access-Control-Allow-Origin": "*",
    //     },
    //   });

    //   alert("Itinerary created successfully");

    // Reset the form and selected destination after successful submission
    setFormData([
      {
        daytitle: "",
        meals: {
          breakfast: false,
          lunch: false,
          dinner: false,
        },
        program: "",
        activities: ""
      },

    ]);
    //   setSelectedDestination(null);
    // } catch (error) {
    //   console.error("Error creating itinerary:", error);
    //   alert("Error creating itinerary, please try again.");
    // }
  };

  // Handle form reset
  const handleReset = () => {
    setFormData([
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
    ]);
    setEditorData('')
    setSelectedDestination(null);
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full bg-gray-200 shadow-lg transform transition-transform duration-500 ${isOpen ? "translate-x-0" : "translate-x-[1050px]"
        } mt-4 sm:mt-8 md:mt-12 w-full sm:w-[calc(100%-120px)] md:w-[800px] lg:w-[1000px]`}
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

          {formData.map((item, index) => (
            <div key={index} className="mb-6">
              <div className="shadow-md p-4 bg-white rounded-lg">
                <div className="flex justify-between mb-4 bg-red-700 rounded">
                  <h3 className="text-white p-2">Day {index + 1}</h3>
                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prevState) => {
                        const updatedDays = [...prevState];
                        updatedDays.splice(index, 1);
                        return {
                          ...prevState,
                          updatedDays,
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
                    name="daytitle"
                    value={item.daytitle}
                    onChange={(e) => handleInputChange(e, index)}
                  />
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
                      let updateData = [...formData]
                      updateData[index].program = data
                      setFormData(updateData)
                    }}
                  />
                </div>

                <div className="mb-4">
                  <div className="flex gap-2 mb-4">
                    <div className="w-1/4 flex items-center">

                      <h3 className="block text-sm font-medium mb-2">Meals</h3>
                    </div>
                    <div className="w-1/4 flex items-center">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="breakfast"
                          checked={item.breakfast}
                          onChange={(e) => handleMealChange(e, index)}
                          className="w-6 h-6 mr-2"
                        />{" "}
                        Breakfast
                      </label>
                    </div>
                    <div className="w-1/4 flex items-center">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="lunch"
                          checked={item.lunch}
                          onChange={(e) => handleMealChange(e, index)}
                          className="w-6 h-6 mr-2"
                        />{" "}
                        Lunch
                      </label>
                    </div>
                    <div className="w-1/4 flex items-center">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="dinner"
                          checked={item.dinner}
                          onChange={(e) => handleMealChange(e, index)}
                          className="w-6 h-6 mr-2"
                        />{" "}
                        Dinner
                      </label>
                    </div>
                  </div>
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
                        {item.hotelOptionsIds.map((hotel, i) => (
                          <td className="py-2 px-4 border-r">
                            <>
                              <div className="mb-2">
                                <label className="block text-sm font-medium">
                                  Hotel Name
                                </label>
                                <Select
                                  id="destinationName"
                                  options={viewHotelList}
                                  value={hotel}
                                  onChange={(e) => handleHotelChange(e, i, index)}
                                  placeholder="Select..."
                                  className="mt-1 border w-full h-[36px] rounded"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium">
                                  Room Type
                                </label>
                                <Select
                                  options={viewRoomTypeList}
                                  placeholder="Rating"
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium">
                                  Meal Type
                                </label>
                                <Select
                                  options={mealTypeOptions}
                                  placeholder="Meals"
                                  className="mt-1"
                                />
                              </div>
                            </>
                          </td>
                        ))}
                        {/* 
                        <td className="py-2 px-4 border-r">
                          <div className="mb-2">
                            <label className="block text-sm font-medium">
                              Hotel Name
                            </label>
                            <Select
                              id="destinationName"
                              options={viewHotelList}
                              onChange={handleHotelChange}
                              placeholder="Select..."
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
                              options={mealTypeOptions}
                              placeholder="Meals"
                              className="mt-1"
                            />
                          </div>
                        </td>

                        <td className="py-2 px-4 border-r">
                          <div className="mb-2">
                            <label className="block text-sm font-medium">
                              Hotel Name
                            </label>
                            <Select
                              id="destinationName"
                              options={viewHotelList}
                              onChange={handleHotelChange}
                              placeholder="Select..."
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
                              options={mealTypeOptions}
                              placeholder="Meals"
                              className="mt-1"
                            />
                          </div>
                        </td>

                        <td className="py-2 px-4">
                          <div className="mb-2">
                            <label className="block text-sm font-medium">
                              Hotel Name
                            </label>
                            <Select
                              id="destinationName"
                              options={viewHotelList}
                              onChange={handleHotelChange}
                              placeholder="Select..."
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
                              options={mealTypeOptions}
                              placeholder="Meals"
                              className="mt-1"
                            />
                          </div>
                        </td> */}
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
                    <Select
                      options={activityList}
                      placeholder="Activity"
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label
                    htmlFor={`activities-${index}`}
                    className="block text-sm font-medium bg-red-700 text-white p-2"
                  >
                    Sight Seeing
                  </label>
                  <div className="border rounded-md p-4">
                    <label
                      className="block text-sm font-medium mb-1"
                      htmlFor={`activities-${index}`}
                    >
                      Sight View
                    </label>
                    <Select
                      options={siteSeeingList}
                      placeholder="Site Seeing"
                      className="mt-1"
                    />
                  </div>
                </div>
                {/* </div> */}
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
                    // value={formData.transportationDetails}
                    onChange={(e) => handleInputChange(e, index)}
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addNewDay}
            className="bg-blue-500 text-white p-2 rounded mb-10"
          >
            Add New Day
          </button>
        </div>
      </form >
      {/* Submit and Reset Buttons */}
      < div className="flex justify-between items-center p-3 bg-white shadow-lg rounded w-full fixed bottom-12" >
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
      </div >
    </div >
  );
};

export default Itinerary;
