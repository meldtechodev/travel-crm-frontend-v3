import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaEdit, FaRegStar, FaStar } from "react-icons/fa";
import axios from "axios";
import api from "../apiConfig/config";

const HotelView = () => {
  const params = useParams();
  const hotelId = params.hotelId;

  const initialState = {
    description:
      "This is a placeholder description of the hotel. Update this with at least 500 characters of content describing the hotel, its amenities, location, and other details.",
    deluxePrices: {
      extraBedPrice: "100$",
      maxPersonPrice: "100$",
      offerPrice: "100$",
      directHotelPrice: "100$",
      thirdPartyPrice: "100$",
    },
    standardPrices: {
      extraBedPrice: "80$",
      maxPersonPrice: "80$",
      offerPrice: "80$",
      directHotelPrice: "80$",
      thirdPartyPrice: "80$",
    },
    suitePrices: {
      extraBedPrice: "150$",
      maxPersonPrice: "150$",
      offerPrice: "150$",
      directHotelPrice: "150$",
      thirdPartyPrice: "150$",
    },
  };

  const [data, setData] = useState(initialState);
  const [isEditing, setIsEditing] = useState({
    description: false,
    deluxe: false,
    standard: false,
    suite: false,
  });

  useEffect(() => {
    axios.get(`${api.baseUrl}/hotel/gethotelby/${hotelId}`).then((res) => {
      setData(res.data);
    });
  }, [hotelId]);

  const [tempState, setTempState] = useState(initialState);

  // Handling description edit actions
  const handleEdit = (field) => {
    setIsEditing((prev) => ({ ...prev, [field]: true }));
    setTempState(data);
  };

  const handleSave = (field) => {
    setData(tempState);
    setIsEditing((prev) => ({ ...prev, [field]: false }));
  };

  const handleCancel = (field) => {
    setTempState(data);
    setIsEditing((prev) => ({ ...prev, [field]: false }));
  };

  const handleChange = (field, value, type = null) => {
    setTempState((prev) => {
      if (type) {
        return {
          ...prev,
          [`${type}Prices`]: {
            ...prev[`${type}Prices`],
            [field]: value,
          },
        };
      }
      return { ...prev, [field]: value };
    });
  };

  const renderStarRating = (starRatingText) => {
    const maxStars = 5;
    const starCount = parseInt(starRatingText?.split(" ")[0]) || 0; // Extract the numeric value
    const stars = [];

    for (let i = 0; i < maxStars; i++) {
      stars.push(
        i < starCount ? (
          <FaStar key={i} className="text-yellow-500" />
        ) : (
          <FaRegStar key={i} className="text-gray-400" />
        )
      );
    }

    return <div className="flex">{stars}</div>;
  };

  const renderPriceSection = (type, prices) => {
    return (
      <div className="w-full mt-4">
        <div className="border border-gray-300 rounded-lg p-4 shadow-sm bg-gray-50">
          <h3 className="text-lg font-semibold mb-4">
            {type.charAt(0).toUpperCase() + type.slice(1)} Price :
          </h3>
          <div className="flex flex-row gap-4">
            {prices &&
              Object.entries(prices).map(([key, value]) => (
                <label key={key} className="flex items-center mb-2">
                  <span className="text-black-500">{`${key.replace(
                    /([A-Z])/g,
                    " $1"
                  )}: `}</span>
                  {isEditing[type] ? (
                    <input
                      type="text"
                      value={tempState[`${type}Prices`][key]}
                      onChange={(e) => handleChange(key, e.target.value, type)}
                      className="ml-2 p-2 border rounded"
                    />
                  ) : (
                    <span>{value}</span>
                  )}
                </label>
              ))}
          </div>

          {isEditing[type] && (
            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={() => handleSave(type)}
                className="px-4 py-2 bg-red-500 text-white rounded shadow hover:bg-red-600"
              >
                Save
              </button>
              <button
                onClick={() => handleCancel(type)}
                className="px-4 py-2 bg-gray-300 rounded shadow hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          )}

          {!isEditing[type] && (
            <div className="flex justify-end mt-2">
              <button
                onClick={() => handleEdit(type)}
                className="text-purple-500 text-xl"
              >
                <FaEdit />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 w-full mb-14">
      <div className="bg-white p-4 flex rounded shadow flex-col w-full gap-4">
        {/* Header Section */}
        <div className="flex w-full gap-4">
          <div className="mb-4 md:mb-0">
            <img
              src="https://via.placeholder.com/150"
              alt="Hotel"
              className="square shadow w-full"
            />
          </div>
          <div className="w-full md:w-3/4">
            {/* Hotel Name and Rating */}
            <div className="flex items-center mb-2 md:mb-0">
              <p className="mr-2 font-bold text-xl">
                Hotel Name: {data?.hname}
              </p>
              <div className="flex items-center ml-2">
                {renderStarRating(data?.star_ratings)}
              </div>
            </div>

            {/* Location Details */}
            <div className="flex flex-col md:flex-row justify-start gap-4 mb-4">
              <div className="mb-2 md:mb-0">
                <p>
                  <strong>Country:</strong> {data?.country?.countryName}
                </p>
              </div>
              <div className="mb-2 md:mb-0">
                <p>
                  <strong>State:</strong> {data?.state?.stateName}
                </p>
              </div>
              <div className="mb-2 md:mb-0">
                <p>
                  <strong>City:</strong> {data?.destination?.destinationName}
                </p>
              </div>
            </div>

            {/* Contact and Address Section */}
            <div className="flex flex-col md:flex-row justify-start gap-4">
              <div className="mb-2 md:mb-0">
                <p>
                  <strong>Contact Person Name:</strong> {data?.hcontactname}{" "}
                </p>
              </div>
              <div className="mb-2 md:mb-0">
                <p>
                  <strong>Contact Person Number:</strong> {data?.hcontactnumber}{" "}
                </p>
              </div>
              <div className="mb-2 md:mb-0">
                <p>
                  <strong>Contact Person Email:</strong> {data?.hcontactemail}
                </p>
              </div>
              <div className="mb-2 md:mb-0">
                <p>
                  <strong>Address:</strong> {data?.haddress}{" "}
                </p>
              </div>
              <div className="mb-2 md:mb-0">
                <p>
                  <strong>Pincode:</strong> {data?.hpincode}{" "}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="w-full mt-4">
        <div className="border border-gray-300 rounded-lg p-4 shadow-sm bg-gray-50">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg">
              {" "}
              <strong>Description :</strong> {data?.hdescription}
            </h3>
            {!isEditing.description && (
              <FaEdit
                className="text-purple-500 text-xl cursor-pointer"
                onClick={() => handleEdit("description")}
              />
            )}
          </div>
          {isEditing.description ? (
            <div>
              <textarea
                className="w-full p-3 border rounded shadow resize-none"
                rows="6"
                minLength={500}
                value={tempState.description}
                onChange={(e) => handleChange("description", e.target.value)}
              />
              <div className="flex justify-end mt-2">
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded shadow hover:bg-green-600 mr-2"
                  onClick={() => handleSave("description")}
                >
                  Save
                </button>
                <button
                  className="px-4 py-2 bg-gray-300 rounded shadow hover:bg-gray-400"
                  onClick={() => handleCancel("description")}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-700">{data.description}</p>
          )}
        </div>
      </div>
      {/* Room Type Section */}
      <div className="w-full mt-4">
        <div className="border border-gray-300 rounded-lg p-4 shadow-sm bg-gray-50">
          <h3 className="text-lg font-semibold mb-4">Room Type :</h3>
          <div className="flex flex-row gap-4">
            <label className="flex items-center">
              <input type="checkbox" checked disabled className="mr-2" />
              <span className="text-black-500">Standard</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" checked disabled className="mr-2" />
              <span className="text-black-500">Deluxe</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" checked disabled className="mr-2" />
              <span className="text-black-500">Suite</span>
            </label>
          </div>
        </div>
      </div>

      {/* Price Sections */}
      {renderPriceSection("deluxe", data.deluxePrices)}
      {renderPriceSection("standard", data.standardPrices)}
      {renderPriceSection("suite", data.suitePrices)}
    </div>
  );
};

export default HotelView;
