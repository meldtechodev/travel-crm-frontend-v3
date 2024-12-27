import React, { useContext, useEffect, useState } from "react";
import Select, { components } from "react-select";
import CreatableSelect from "react-select/creatable";
import axios from "axios";
import api from "../apiConfig/config";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { UserContext } from "../contexts/userContext";

const Itinerary = ({ isOpen, onClose }) => {
  const [editorData, setEditorData] = useState("");
  const [selectedDestination, setSelectedDestination] = useState(null);

  const { user, destinationDetails, ipAddress } = useContext(UserContext)

  const [formData, setFormData] = useState([
    {
      daytitle: "",
      program: "",
      breakfast: false,
      lunch: false,
      dinner: false,
      hotelOptionsIds: [null, null, null, null],
      roomtypes: [null, null, null, null],
      mealspackage: [null, null, null, null],
      activities: [null],
      sightseeing: [null],
      image: null
    }
  ]);

  // Handle input changes for the current day
  const handleInputChange = (event, dayIndex) => {
    let updateData = [...formData]
    updateData[dayIndex].daytitle = event.target.value
    setFormData(updateData)
  };

  const handleMealChange = (event, dayIndex) => {
    const { name, checked } = event.target;

    const update = formData.map((prev, i) => dayIndex === i ? { ...prev, [name]: checked } : prev)
    setFormData(update)
  };

  const [hotelList, setHotelList] = useState([])
  const [roomTypeList, setRoomTypeList] = useState([])
  const [viewHotelList, setViewHotelList] = useState([])
  const [viewRoomTypeList, setViewRoomTypeList] = useState([])
  const [siteSeeingList, setSiteSeeingList] = useState([])
  const [activityList, setActivityList] = useState([])
  const [mealTypeOptions, setMealTypeOptions] = useState([])

  useEffect(() => {
    axios.get(`${api.baseUrl}/hotel/getallHotel`)
      .then((response) => {
        const formattedData = response.data.data.map(item => ({
          ...item,
          value: item.hotel_id,
          label: item.hname,
          status: item.status ? 'Active' : 'Inactive'
        }));
        // console.log(response.data.data)v
        setHotelList(formattedData)
      }).catch(error =>
        console.error('Error fetching hotel data:', error)
      )

    axios.get(`${api.baseUrl}/roomtypes/getall`)
      .then((response) => {
        const formattedData = response.data.map(item => ({
          ...item,
          value: item.id,
          label: item.bedSize
        }));
        // console.log(response.data)
        setRoomTypeList(formattedData)
      }).catch(error =>
        console.error('Error fetching room type data:', error)
      )

    axios.get(`${api.baseUrl}/sightseeing/getAll`)
      .then((response) => {
        const formattedData = response.data.content.map(item => ({
          ...item,
          value: item.id,
          label: item.title,
          status: item.status ? 'Active' : 'Inactive'
        }));
        setSiteSeeingList(formattedData)
      }).catch(error =>
        console.error('Error fetching country data:', error)
      )

    axios.get(`${api.baseUrl}/activities/getall`)
      .then((response) => {
        const formattedData = response.data.content.map(item => ({
          ...item,
          value: item.id,
          label: item.title,
          status: item.status ? 'Active' : 'Inactive'
        }));
        setActivityList(formattedData)
      }).catch(error =>
        console.error('Error fetching country data:', error)
      )

    axios.get(`${api.baseUrl}/mealspackage/getAll`)
      .then((response) => {
        const formattedData = response.data.content.map(item => ({
          ...item,
          value: item.id,
          label: item.mealstypeCode,
          status: item.status ? 'Active' : 'Inactive'
        }));
        setMealTypeOptions(formattedData)
      }).catch(error =>
        console.error('Error fetching country data:', error)
      )
  }, [isOpen]);

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

  const handleActivityChange = (selectedOption, index) => {
    const update = formData.map((item, i) => i === index ? { ...item, activities: selectedOption } : item)
    setFormData(update)
  }

  const handleSiteseeingChange = (selectedOption, index) => {
    const update = formData.map((item, i) => i === index ? { ...item, sightseeing: selectedOption } : item)
    setFormData(update)
  }

  // Handle destination change
  const handleDestinationChange = (selectedOption) => {
    setViewHotelList([])
    setSelectedDestination(selectedOption);
    let hotel = hotelList.filter(item => item.destinationId === selectedOption.value)
    setViewHotelList(hotel)
  };

  const handleHotelChange = (selected, hIndex, mainIndex) => {
    setViewRoomTypeList([])
    let updateData = [...formData]
    let hotelUpdate = [...updateData[mainIndex].hotelOptionsIds]
    console.log(selected)

    hotelUpdate[hIndex] = selected;
    let updateRoomtype = roomTypeList.filter(item => item.hotel?.id === selected.value)
    setViewRoomTypeList(updateRoomtype)
    const update = formData.map((prev, i) => mainIndex === i ? { ...prev, hotelOptionsIds: hotelUpdate } : prev)
    setFormData(update)
    console.log(formData)
  }
  const handleRoomTypeChange = (select, rIndex, mainIndex) => {
    let updateData = [...formData]
    let roomUpdate = [...updateData[mainIndex].roomtypes]
    roomUpdate[rIndex] = select;
    let update = formData.map((prev, i) => mainIndex === i ? { ...prev, roomtypes: roomUpdate } : prev)
    setFormData(update)
  }
  const handleMealsPackage = (select, mIndex, mainIndex) => {
    let updateData = [...formData]
    let roomUpdate = [...updateData[mainIndex].mealspackage]
    roomUpdate[mIndex] = select;
    let update = formData.map((prev, i) => mainIndex === i ? { ...prev, mealspackage: roomUpdate } : prev)
    setFormData(update)
  }

  const handleDelete = (id) => {
    let update = formData.filter((item, i) => i !== id)
    setFormData(update)
  }

  const handleImage = (e, i) => {
    let update = formData.map((item, index) => index === i ? { ...item, image: e.target.files[0] } : item)
    setFormData(update)
  }
  // Add a new day form
  const addNewDay = () => {
    if (formData.length === 0) {
      setFormData([
        {
          daytitle: "",
          program: "",
          breakfast: false,
          lunch: false,
          dinner: false,
          hotelOptionsIds: [null, null, null, null],
          roomtypes: [null, null, null, null],
          mealspackage: [null, null, null, null],
          activities: [null],
          sightseeing: [null],
          image: null
        }])

    } else {

      setFormData([...formData,
      {
        daytitle: "",
        program: "",
        breakfast: false,
        lunch: false,
        dinner: false,
        hotelOptionsIds: [null, null, null, null],
        roomtypes: [null, null, null, null],
        mealspackage: [null, null, null, null],
        activities: [null],
        sightseeing: [null],
        image: null
      }
      ]);
    }
  };

  // Submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();

    for (let i = 0; formData.length > i; i++) {
      let activit = formData[i].activities.filter(it => it !== null && it?.__isNew__)
      // let a = [...activit.map(item => item.label)]
      let a = []

      activit.length > 0 && activit.forEach((act) => {
        let activityPayload = {
          "title": act.label,
          "ipaddress": ipAddress,
          "status": 1,
          "isdelete": 0,
          "createdby": user.name,
          "modifiedby": user.name
        }
        axios.post(`${api.baseUrl}/activities/create`, activityPayload, {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }).then(response => {
          a.push(response.data.id)
          setActivityList(...activityList, { ...response.data, label: response.data.title, value: response.data.id })
        })
          .catch(error => console.error("error creating activities in Itinary ", error))
      });

      activit = formData[i].activities.filter(ite => ite !== null && !ite.__isNew__)
      activit = activit.map(ite => ite?.id)

      let sight = formData[i].sightseeing.filter(it => it !== null && it.__isNew__)
      // let s = [...sight.map(item => item.label)]
      let s = []
      sight.length > 0 && sight.forEach((sight) => {
        let sightseeingPayload = {
          "title": sight.label,
          "ipaddress": ipAddress,
          "status": 1,
          "isdelete": 0,
          "createdby": user.name,
          "modifiedby": user.name
        }
        axios.post(`${api.baseUrl}/sightseeing/create`, sightseeingPayload, {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        })
          .then(response => {
            s.push(response.data.id)
            setSiteSeeingList(...siteSeeingList, { ...response.data, label: response.data.title, value: response.data.id })
          })
          .catch(error => console.error("error creating activities in Itinary ", error))
      })
      // formData[i].activities = [...activit, ...a]
      // formData[i].sightseeing = [...sight, ...s]
      sight = formData[i].sightseeing.filter(ite => ite !== null && !ite.__isNew__)
      sight = sight.map(ite => ite?.id)

      formData[i].activities = [...activit, ...a]
      formData[i].sightseeing = [...sight, ...s]

      // let update = formData.map((item, ind) => ind === i ? { ...item, activities: [...activit, ...a], sightseeing: [...sight, ...s] } : item)
      // setFormData(update)
    }

    formData.forEach((item, i) => {
      const hotel = item.hotelOptionsIds.filter(data => data !== null)
      const hotelList = hotel.map(item => item.value)


      let room = item.roomtypes.filter(item => item !== null)
      let mealspack = item.mealspackage.filter(item => item !== null)

      var meald = ""
      if (item.breakfast) {
        meald = meald + 'Breakfast'
      }
      if (item.lunch) {
        meald = meald + (item.breakfast ? ', Lunch' : 'Lunch')
      }
      if (item.dinner) {
        meald = meald + (item.breakfast ? ', Dinner' : 'Dinner')
      }
      // let sight = item.sightseeing.map(item => item.id)

      const dataToSend = {
        daytitle: item.daytitle,
        program: item.program,
        meals: meald,
        activitiesIds: item.activities,
        sightseeingIds: item.sightseeing,
        hotelOptionIds: hotelList,
        destination: {
          id: selectedDestination ? selectedDestination.value : null,
        },
        roomtypes: {
          id: room.length > 0 ? room[0].id : 1
        },
        mealspackage: {
          id: mealspack.length > 0 ? mealspack[0].id : 1
        },
        createdby: user.name,
        modifiedby: user.name,
        isdelete: 0,
        ipaddress: ipAddress,
        status: 1
      };

      try {
        axios.post(`${api.baseUrl}/itinerarys/create`, dataToSend, {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });
      } catch (error) {
        console.error("Error creating itinerary:", error);
        alert("Error creating itinerary, please try again.");
      }
    })
    setFormData([{
      daytitle: "",
      program: "",
      breakfast: false,
      lunch: false,
      dinner: false,
      hotelOptionsIds: [null, null, null, null],
      roomtypes: [null, null, null, null],
      mealspackage: [null, null, null, null],
      activities: [null],
      sightseeing: [null],
      image: null
    }])
    // setEditorData("")

  };

  // Handle form reset
  const handleReset = () => {
    setFormData([{
      daytitle: "",
      program: "",
      breakfast: false,
      lunch: false,
      dinner: false,
      hotelOptionsIds: [null, null, null, null],
      roomtypes: [null, null, null, null],
      mealspackage: [null, null, null, null],
      activities: [null],
      sightseeing: [null]
    }]);
    setEditorData('')
    setSelectedDestination(null);
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full bg-gray-200 shadow-lg transform transition-transform duration-500 ${isOpen ? "translate-x-0" : "translate-x-[1050px]"
        } mt-4 sm:mt-8 md:mt-12 w-full sm:w-[calc(100%-120px)] md:w-[800px] lg:w-[1000px] z-50`}
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
                options={destinationDetails}
                value={selectedDestination}
                onChange={handleDestinationChange}
                placeholder="Select..."
              />
            </div>
          </div>

          {formData.length > 0 && formData.map((item, index) => (
            <div key={index} className="mb-6">
              <div className="shadow-md p-4 bg-white rounded-lg">
                <div className="flex justify-between mb-4 bg-red-700 rounded">
                  <h3 className="text-white p-2">Day {index + 1}</h3>
                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() => {
                      handleDelete(index)
                      // setFormData((prevState) => {
                      //   const updatedDays = [...prevState];
                      //   updatedDays.splice(index, 1);
                      //   return {
                      //     ...prevState,
                      //     updatedDays,
                      //   };
                      // });
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
                    placeholder="Title"
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

                <div className="mb-4 flex justify-between items-center gap-5">
                  <div className="flex gap-8 mb-4 items-center">
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
                  <div className="flex gap-4 items-center mb-4">
                    <label htmlFor="image" className="block text-sm font-medium">
                      Image
                    </label>
                    <input
                      type="file"
                      className="w-full text-gray-700 mt-1 p-[4.5px] bg-white rounded border border-gray-200"
                      name="image"
                      value={item.image}
                      onChange={(e) => handleImage(e, index)}
                    // value={pkImage}
                    />
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
                                  value={item.roomtypes[i]}
                                  onChange={(select) => handleRoomTypeChange(select, i, index)}
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
                                  value={item.mealspackage[i]}
                                  onChange={(select) => handleMealsPackage(select, i, index)}
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
                    {/* <Select
                      options={activityList}
                      placeholder="Activity"
                      value={item.activities}
                      className="mt-1"
                      onChange={(e) => handleActivityChange(e, index)}
                    /> */}
                    <CreatableSelect
                      isMulti
                      value={item.activities}
                      onChange={(e) => handleActivityChange(e, index)}
                      options={activityList}
                      closeMenuOnSelect={false}
                      hideSelectedOptions={false}
                      components={{ Option: CustomOption }}
                      isClearable={true}
                      placeholder="Type or select options..."
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
                    {/* <Select
                      options={siteSeeingList}
                      placeholder="Site Seeing"
                      className="mt-1"
                      value={item.sightseeing}
                      onChange={(e) => handleSiteseeingChange(e, index)}
                    /> */}
                    <CreatableSelect
                      isMulti
                      value={item.sightseeing}
                      onChange={(e) => handleSiteseeingChange(e, index)}
                      options={siteSeeingList}
                      closeMenuOnSelect={false}
                      hideSelectedOptions={false}
                      components={{ Option: CustomOption }}
                      isClearable={true}
                      placeholder="Type or select options..."
                    />

                  </div>
                </div>
                {/* </div> */}
                {/* <div className="mb-4">
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
                </div> */}
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
