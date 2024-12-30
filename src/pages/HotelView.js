import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaEdit, FaRegStar, FaStar } from "react-icons/fa";
import axios from "axios";
import api from "../apiConfig/config";

const HotelView = () => {
  const params = useParams();
  const hotelId = params.hotelId;

  const initialState = {
    hdescription: "",
    groupedPrices: {}
  };

  const [data, setData] = useState(initialState);
  const [isEditing, setIsEditing] = useState({
    hdescription: false,
    groupedPrices: false,
  });

  const groupPricesByRoomType = (hotelPrices) => {
    const groupedData = {};

    hotelPrices.forEach((item) => {
      const roomType = item.rooms_name;
      const seasonName = item.season_name;

      if (!groupedData[roomType]) {
        groupedData[roomType] = {};
      }

      if (!groupedData[roomType][seasonName]) {
        groupedData[roomType][seasonName] = {
          off_season_price: item.off_season_price || 0,
          extra_bed_price: item.extra_bed_price || 0,
          direct_booking_price: item.direct_booking_price || 0,
          third_party_price: item.third_party_price || 0,
        };
      }
    });

    return groupedData;
  };

  useEffect(() => {
    axios.get(`${api.baseUrl}/hotel/getallHotel?hotelId=${hotelId}`).then((res) => {
      const hotelData = res.data && res.data.data;
      if (hotelData && hotelData.hotelPrice) {
        hotelData.groupedPrices = groupPricesByRoomType(hotelData.hotelPrice);
      }
      setData(hotelData);
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
    // Here you can add the logic to save the updated data to the backend if needed
  };

  const handleCancel = (field) => {
    setTempState(data);
    setIsEditing((prev) => ({ ...prev, [field]: false }));
  };

  const handleChange = (field, value, type = null, season = null) => {
    setTempState((prev) => {
      if (type) {
        return {
          ...prev,
          groupedPrices: {
            ...prev.groupedPrices,
            [type]: {
              ...prev.groupedPrices[type],
              [season]: {
                ...prev.groupedPrices[type][season],
                [field]: value,
              },
            },
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
      <div className="w-full mt-4" key={type}>
        <div className="border border-gray-300 rounded-lg p-4 shadow-sm bg-gray-50">
          <h3 className="text-lg font-semibold mb-4">
            {type.charAt(0).toUpperCase() + type.slice(1)} Prices:
          </h3>
          {Object.entries(prices).map(([season, seasonPrices]) => (
            <div key={season} className="mb-4">
              <h4 className="text-md font-semibold mb-2">
                {season.charAt(0).toUpperCase() + season.slice(1)}:
              </h4>
              <div className="flex flex-row gap-4">
                {Object.entries(seasonPrices).map(([key, value]) => (
                  <label key={key} className="flex items-center mb-2">
                    <span className="text-black-500">{key.replace(/_/g, " ")}:</span>
                    {isEditing.groupedPrices ? (
                      <input
                        type="text"
                        value={tempState.groupedPrices[type][season][key]}
                        onChange={(e) => handleChange(key, e.target.value, type, season)}
                        className="ml-2 p-2 border rounded"
                      />
                    ) : (
                      <span>{value}</span>
                    )}
                  </label>
                ))}
              </div>
            </div>
          ))}
          {isEditing.groupedPrices && (
            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={() => handleSave("groupedPrices")}
                className="px-4 py-2 bg-red-500 text-white rounded shadow hover:bg-red-600"
              >
                Save
              </button>
              <button
                onClick={() => handleCancel("groupedPrices")}
                className="px-4 py-2 bg-gray-300 rounded shadow hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          )}
          {!isEditing.groupedPrices && (
            <div className="flex justify-end mt-2">
              <button
                onClick={() => handleEdit("groupedPrices")}
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
                  <strong>Country:</strong> {data?.countryName}
                </p>
              </div>
              <div className="mb-2 md:mb-0">
                <p>
                  <strong>State:</strong> {data?.stateName}
                </p>
              </div>
              <div className="mb-2 md:mb-0">
                <p>
                  <strong>City:</strong> {data?.destinationName}
                </p>
              </div>
            </div>
            {/* Contact and Address Section */}
            <div className="flex flex-col md:flex-row justify-start gap-6">
              <div className="mb-2 md:mb-0">
                <p>
                  <strong>Contact Person Name:</strong> <br /> {data?.hcontactname}{" "}
                </p>
              </div>
              <div className="mb-2 md:mb-0">
                <p>
                  <strong>Contact Person Number:</strong> <br /> {data?.hcontactnumber}{" "}
                </p>
              </div>
              <div className="mb-2 md:mb-0">
                <p>
                  <strong>Contact Person Email:</strong> <br /> {data?.hcontactemail}
                </p>
              </div>
              <div className="mb-2 md:mb-0">
                <p>
                  <strong>Address:</strong> <br /> {data?.haddress}{" "}
                </p>
              </div>
              <div className="mb-2 md:mb-0">
                <p>
                  <strong>Pincode:</strong>  <br /> {data?.hpincode}{" "}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="mt-4 bg-white p-4 rounded shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Description</h2>
          {!isEditing.hdescription ? (
            <button
              onClick={() => handleEdit("hdescription")}
              className="text-purple-500 text-xl"
            >
              <FaEdit />
            </button>
          ) : (
            <div className="flex gap-4">
              <button
                onClick={() => handleSave("hdescription")}
                className="px-4 py-2 bg-red-500 text-white rounded shadow hover:bg-red-600"
              >
                Save
              </button>
              <button
                onClick={() => handleCancel("hdescription")}
                className="px-4 py-2 bg-gray-300 rounded shadow hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
        {isEditing.hdescription ? (
          <textarea
            value={tempState.hdescription}
            onChange={(e) => handleChange("hdescription", e.target.value)}
            className="w-full h-32 p-2 border rounded"
          />
        ) : (
          <p dangerouslySetInnerHTML={{ __html: data?.hdescription }}></p>
        )}
      </div>

      {/* Prices Section */}
      <div className="mt-4">
        {data.groupedPrices &&
          Object.entries(data.groupedPrices).map(([type, prices]) => (
            renderPriceSection(type, prices)
          ))}
      </div>
    </div>
  );
};

export default HotelView;
