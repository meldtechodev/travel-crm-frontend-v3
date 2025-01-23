import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import Select from "react-select";
import api from '../apiConfig/config';
import { toast } from 'react-toastify';
import { UserContext } from '../contexts/userContext';

const AddPopHotel = ({ isOpen, onClose }) => {
  const { user, ipAddress } = useContext(UserContext);

  const [totalRoomDetails, setTotalRoomDetails] = useState([{
    roomMasterSelected: null,
    bed_size: []
  }])
  const [hotelName, setHotelName] = useState('')

  const handleRoom = () => {
    let data = [...totalRoomDetails, {
      roomMasterSelected: null,
      bed_size: []
    }]
    setTotalRoomDetails(data)
  }
  const handleReset = () => {
    setTotalRoomDetails([{
      roomMasterSelected: null,
      bed_size: []
    }])
    setHotelName('')
  }

  const handleDeleteTag = (index, i) => {
    setTotalRoomDetails((prev) =>
      prev.map((item, j) =>
        index === j ? { ...item, bed_size: item.bed_size.filter(data => data !== item.bed_size[i]) } : item))
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Enter' || e.key === ',') {
      const newTag = e.target.value.trim();
      if (newTag) {
        setTotalRoomDetails((prevItems) =>
          prevItems.map((item, i) =>
            index === i ?
              { ...item, bed_size: [...item.bed_size, newTag] } : item))
        e.target.value = ""; // Clear input
      }
    }
  }

  const [roomMaster, setRoomMaster] = useState([])

  useEffect(() => {
    axios.get(`${api.baseUrl}/rooms/getAll`)
      .then(response => {
        const formattedOptions = response.data.content.map(item => ({
          value: item.id, // or any unique identifier
          label: item.roomname // or any display label you want
        }));
        setRoomMaster(formattedOptions);
      })
      .catch((error) => {
        console.error('Error fetching Room Master data :', error);
      });
  }, [])

  const [hotelReponse, sethotelResponse] = useState({})

  const handleSubmit = (e) => {
    e.preventDefault()

    for (let i = 0; i < totalRoomDetails.length; i++) {
      if (hotelName === '' || totalRoomDetails[i].roomMasterSelected === null || totalRoomDetails[i].bed_size.length === 0) {
        toast.error('Add details.', {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return
      }
    }

    axios.post(`${api.baseUrl}/hotel/quickadd`, {
      "hname": hotelName,
      "created_by": user.name,
      "modified_by": user.name,
      "ipaddress": ipAddress,
      "status": true,
      "isdelete": false,
      "country": {
        "id": 3
      },
      "state": {
        "id": 11
      },
      "destination": {
        "id": 1
      }
    })
      .then(response => sethotelResponse(response.data))
      .catch(err => console.log(err));

    for (let i = 0; i < totalRoomDetails.length; i++) {
      for (let j = 0; j < totalRoomDetails[i].bed_size.length; j++) {

        axios.post(`${api.baseUrl}/roomtypes/quickcreate`, {
          "bedSize": totalRoomDetails[i].bed_size[j],
          "max_person": 2,
          "hotel": {
            "id": hotelReponse.id
          },
          "rooms": {
            "id": totalRoomDetails[i].roomMasterSelected.value
          },
          "status": true,
          "created_by": user.name,
          "modified_by": user.name,
          "isdelete": false,
          "ipaddress": ipAddress
        })
          .catch(err => console.log(err));
      }
    }
    toast.success('Hotel and Room Type Added.', {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    })

    handleReset()
    onClose()
  }


  return (
    <div>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg w-1/3 p-6 relative">
            <p
              onClick={() => onClose()}
              className="absolute top-2 text-lg right-4 cursor-pointer text-black hover:text-black"
            >
              ✖
            </p>

            <h2 className="text-lg font-semibold mb-4">New Hotel</h2>
            <div className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className='flex gap-2 w-full'>
                <div className='flex flex-col w-full'>
                  <label className="block text-sm font-medium">Hotel name *</label>
                  <input
                    type="text"
                    name="hname"
                    value={hotelName}
                    onChange={(e) => setHotelName(e.target.value)}
                    placeholder="Hotel Name."
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
              </div>
              <label className="block text-sm font-medium">Select All Room *</label>


              {/* <div className='flex flex-col w-full'>
                <label className="block text-sm font-medium">Hotel Ratings *</label>
                <select name="star_ratings"
                  className="w-full border border-gray-300 rounded px-3 py-2" >
                  <option>1 star</option>
                  <option>2 star</option>
                  <option>3 star</option>
                  <option>4 star</option>
                  <option>5 star</option>
                </select>
              </div> */}

              {totalRoomDetails.map((roomDetails, index) => (
                <div className='mb-4'>

                  <Select
                    options={roomMaster}
                    value={roomDetails.roomMasterSelected}
                    onChange={(e) => {
                      let det = totalRoomDetails.map((item, i) => index === i ? {
                        ...item, roomMasterSelected: e
                      } : item)
                      setTotalRoomDetails(det)
                    }}
                    placeholder="Select Room"
                  />

                  <div className="border border-gray-300 rounded p-2 mt-1 bg-white flex items-start flex-wrap w-full min-h-[calc(100% - 20px)] mb-2">

                    {roomDetails.bed_size.map((tag, i) => (
                      <div
                        key={i}
                        className="flex items-center bg-blue-700 text-white rounded px-2 py-1 mr-1 mb-1"
                      >
                        <span className="text-sm">{tag}</span>
                        <button
                          type="button"
                          className="ml-1 text-white hover:text-gray-600"
                          onClick={() => handleDeleteTag(index, i)}
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                    <input
                      type="text"
                      // value={inputValue[index]}
                      // onChange={handleInputChange}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      placeholder="Add Bed Size"
                      className="flex-grow p-2 text-sm outline-none border-none focus:ring-0 w-full h-full "
                    />
                  </div>
                </div>
              ))}

              {roomMaster.length > totalRoomDetails.length &&
                <button className="bg-red-500 text-white px-4 py-2 rounded w-full"
                  onClick={handleRoom}
                >Add More Room</button>
              }



              {/* <div className='flex gap-2'>
                <div className='flex flex-col w-full'>
                  <label className="block text-sm font-medium">Address *</label>
                  <input
                    type="text"
                    name="address"
                    placeholder="Hotel Address."
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
              </div> */}

              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  className="bg-gray-200 text-black px-4 py-2 rounded"
                  onClick={() => onClose()}
                >
                  Cancel
                </button>
                <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={handleSubmit}>
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AddPopHotel