import React, { useState } from 'react'

const AddPopHotel = ({ isOpen, onClose }) => {

  const [totalRoomDetails, setTotalRoomDetails] = useState([{
    roomMasterSelected: '',
    roomMasterSelectedId: null,
    bed_size: [],
    max_person: null,
    status: { value: true, label: 'Active' },
    created_by: '',
    modified_by: '',
    isdelete: false,
    ipaddress: '',
    image: null
  }])

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
            <form className="space-y-4">
              <div className='flex gap-2 w-full'>
                <div className='flex flex-col w-full'>
                  <label className="block text-sm font-medium">Hotel name *</label>
                  <input
                    type="text"
                    name="hname"
                    placeholder="Hotel Name."
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
              </div>

              <div className='flex flex-col w-full'>
                <label className="block text-sm font-medium">Hotel Ratings *</label>
                <select name="star_ratings"
                  className="w-full border border-gray-300 rounded px-3 py-2" >
                  <option>1 star</option>
                  <option>2 star</option>
                  <option>3 star</option>
                  <option>4 star</option>
                  <option>5 star</option>
                </select>
              </div>

              {totalRoomDetails.map((roomDetails, index) => (
                <>
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
                </>

              ))}



              <div className='flex gap-2'>
                <div className='flex flex-col w-full'>
                  <label className="block text-sm font-medium">Address *</label>
                  <input
                    type="text"
                    name="address"
                    placeholder="Hotel Address."
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
              </div>

              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  className="bg-gray-200 text-black px-4 py-2 rounded"
                  onClick={() => onClose()}
                >
                  Cancel
                </button>
                <button type="submit" className="bg-red-500 text-white px-4 py-2 rounded">
                  Next
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AddPopHotel