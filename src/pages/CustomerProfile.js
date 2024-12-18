import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaTrash } from 'react-icons/fa6';
import { useLocation } from 'react-router-dom';
import api from '../apiConfig/config';

const CustomerProfile = () => {
  const [tab, setTab] = React.useState('profile');
  const location = useLocation(); // Unix timestamp in milliseconds
  const option = location.state?.option;
  console.log(option)

  const [destination, setDestination] = useState([])
  const [itinerariesList, setItinerayList] = useState([])
  const [inclusion, setInclusion] = useState([])
  const [viewInclusion, setViewInclusion] = useState([])
  const [exclusion, setExclusion] = useState([])
  const [viewExclusion, setViewExclusion] = useState([])
  const [hotelList, setHotelList] = useState([])
  const [itinaryList, setItinearyList] = useState([])
  const [siteSeeing, setSiteSeeing] = useState([])

  // console.log(option)

  // let k = option.packItiDetail.map(item => item.roomtypes.hotel.id)
  // let set = new Set(k)
  // let newSet = [...set]
  // console.log(newSet)
  // setHotelList(newSet)

  const ViewDestination = (view) => {
    let d = destination.filter(item => item.id === view)
    let k = d[0]
    return d.length === 0 ? '' : k?.destinationName
  }
  // useEffect(() => {
  //   console.log(option)
  // }, [])

  const handleView = (data) => {
    // let site = siteSeeing.filter(item => item.id === data)
    // site.length === 0 ? '' : site[0].title
    // console.log(site)
    return ''
  }

  useEffect(() => {
    const fetchData = async () => {
      await axios.get(`${api.baseUrl}/sightseeing/getAll`)
        .then((response) => {
          setSiteSeeing(response.data)
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
      return
    }
    fetchData()
  }, []);

  useEffect(() => {
    axios.get(`${api.baseUrl}/destination/getallDestination`)
      .then((response) => {
        setDestination(response.data)
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    axios.get(`${api.baseUrl}/packageitinerary/getAll`)
      .then((response) => {
        const list = response.data.content.filter(item => item.packid === option.id)
        setItinearyList(list)
        // console.log(option)
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const viewInclusions = (ids) => {
    const incl = inclusion.filter(item => item.id === ids)
    return incl.length !== 0 ? incl[0].inclusionname : ''
  }

  const viewExclusions = (ids) => {
    const incl = exclusion.filter(item => item.id === ids)
    return incl.length !== 0 ? incl[0].exclusionname : ''
  }

  useEffect(() => {
    axios.get(`${api.baseUrl}/itinerarys/getAll`)
      .then((response) => {
        setItinerayList(response.data)
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    axios.get(`${api.baseUrl}/inclusion/getall`)
      .then((response) => {
        setInclusion(response.data.content)
        // handleInclusion(response.data)
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  // useEffect(() => {
  //   axios.get(`${api.baseUrl}/inclusion/getall`)
  //     .then((response) => {
  //       setInclusion(response.data)
  //       // handleInclusion(response.data)
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching data:', error);
  //     });
  // }, []);

  useEffect(() => {
    axios.get(`${api.baseUrl}/exclusion/getall`)
      .then((response) => {
        setExclusion(response.data.content)
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div className="p-4 w-full ml-0  bg-gray-100 mb-10"
    // style={{ marginLeft: "100px" }}
    >
      <div className="bg-white p-4 rounded shadow">
        <div className="flex flex-col md:flex-row justify-between mb-4">
          <div className="mb-2 md:mb-0">
            <p>Package Name : {option.pkName}</p>
            <p>Package Categories : {option.pkCategory}</p>
            <p>Package Specifications : {option.pkSpecifications}</p>
          </div>
          <div className="mb-2 md:mb-0">
            <p>From City : {ViewDestination(option.fromCityId)}</p>
            <p>Destination City : {ViewDestination(option.toCityId)}</p>
          </div>
          <div className="mb-2 md:mb-0">
            <p>Fixed Departure Destinations : {option.fixed_departure_destinations}</p>
            {/* <p>Fixed Departure Destinations : {option.fixed_departure_destinations}</p> */}
          </div>
          <div className="mb-2 md:mb-0">
            <p>{option.days} days/{option.nights} nights</p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <button className="bg-green-500 text-white px-4 py-2 rounded">+ Add Remarks</button>
          <div className="flex space-x-2">
            <button className="bg-blue-500 text-white px-4 py-2 rounded">+ Facebook</button>
            <button className="bg-yellow-500 text-white px-4 py-2 rounded">+ To Do</button>
            <button className="bg-red-500 text-white px-4 py-2 rounded" >+ New Query</button>
          </div>
        </div>
      </div>

      {/* <div className="bg-white p-4 rounded shadow mt-4">
        <div className="flex justify-between items-center mb-4">
          <p>Payments: </p>
          <p>Total Billed: 405,895.66 </p>
          <p>Total Paid: 105,020.00</p>
          <p>Pending: 300,875.66</p>
          <button className="bg-green-500 text-white px-4 py-2 rounded">View</button>
        </div>
      </div> */}


      <div className="flex flex-col md:flex-row space-x-0 md:space-x-4 mt-4">
        <div className="bg-white p-4 rounded shadow w-full">
          <div className="bg-gray-200 w-full flex justify-center">
            <th className="p-2 text-center w-full">Itineraries</th>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-white border-collapse ">
                <th className="p-2 border">Day</th>
                <th className="p-2 border">City Name</th>
                <th className="p-2 border">Title</th>
                <th className="p-2 border">Program</th>
                <th className="p-2 border">Meals</th>
                <th className="p-2 border">Transport</th>
                {/* <th className="p-2">Hotel Name</th> */}
              </tr>
            </thead>
            <tbody>
              {option.itinary.map((item, index) => (
                <tr key={index} className="border-b ">
                  <td className="p-2 border text-center">{item.daynumber}</td>
                  <td className="p-2 border text-center">{item.cityname}</td>
                  <td className="p-2 border text-center">{item.daytitle}</td>
                  <td className="p-2 border">{item.program.length > 5 ? item.program.slice(0, 20) + "..." : item.program}</td>
                  <td className="p-2 border text-center">{item.meals}</td>
                  <td className="p-2 border text-center">{item.transport.transportmode}</td>
                  {/* <td className="p-2 border">{item.}</td> */}
                  {/* <td className="p-2 text-center">
                    <button className="text-red-500"><FaTrash /></button>
                  </td> */}
                </tr>
              ))}
              {option.itinary.length === 0 && (
                <tr className="p-2 border w-full text-center">No Itineraries Found
                </tr>)
              }
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-col md:flex-row space-x-0 md:space-x-4 mt-4">
        <div className="bg-white p-4 rounded shadow w-full md:w-1/2">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">Activities</th>
              </tr>
            </thead>
            <tbody>
              {option.activities.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="p-2">{item}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white p-4 rounded shadow w-full md:w-1/2 mt-4 md:mt-0">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">Site Seeing</th>
                {/* <th className="p-2">Action</th> */}
              </tr>
            </thead>
            <tbody>
              {Array.isArray(option.sightseeings) && option.sightseeings.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="p-2">{item?.title}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-col md:flex-row space-x-0 md:space-x-4 mt-4">
        <div className="bg-white p-4 rounded shadow w-full">
          <div className="bg-gray-200 w-full flex justify-center">
            <th className="p-2 text-center w-full">Hotel</th>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-white border-collapse ">
                <th className="p-2 border">Hotel Name</th>
                <th className="p-2 border">Room Type</th>
                <th className="p-2 border">Address</th>
                <th className="p-2 border">Meals</th>
                <th className="p-2 border">Destination</th>
                {/* <th className="p-2">Hotel Name</th> */}
              </tr>
            </thead>
            <tbody className='text-center'>
              {Array.isArray(option.hotels) && option.hotels.map((item, index) => (
                <tr key={index} className="border-collapse">
                  <td className="p-2 border">{item?.hname}</td>
                  <td className="p-2 border">{item.hname}</td>
                  <td className="p-2 border">{item.haddress}</td>
                  <td className="p-2 border">Meals</td>
                  <td className="p-2 border">{item.destination.destinationName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-col md:flex-row space-x-0 md:space-x-4 mt-4">
        <div className="bg-white p-4 rounded shadow w-full md:w-1/2">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">Inclusion</th>
              </tr>
            </thead>
            <tbody>
              {option.inclusionids.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="p-2">{viewInclusions(item)}</td>
                  {/* <td className="p-2 text-center">
                    <button className="text-red-500"><FaTrash /></button>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white p-4 rounded shadow w-full md:w-1/2 mt-4 md:mt-0">
          {/* <p className="font-bold mb-4">Itineraries</p> */}
          {/* <div className='w-full'> */}
          <table className="w-full">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">Exclusion</th>
                {/* <th className="p-2">Action</th> */}
              </tr>
            </thead>
            <tbody>
              {option.exclusionids.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="p-2">{viewExclusions(item)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* <ul>
            {itinerariesList.map(item =>
              <li className='p-2 border-b-2'>{item.daytitle}</li>
            )}
          </ul> */}
          {/* </div> */}

          {/* <table className="w-full">
            <tbody>
              <tr className="border-b">
                <td className="p-2">Food:</td>
                <td className="p-2">Veg, Jain/Satwik</td>
              </tr>
              <tr className="border-b">
                <td className="p-2">Hotel:</td>
                <td className="p-2">1 Star, 2 Star, 3 Star, 4 Star, 5 Star, Any Star</td>
              </tr>
              <tr className="border-b">
                <td className="p-2">Passport:</td>
                <td className="p-2">31155895 (20-Sep-24)</td>
              </tr>
              <tr>
                <td className="p-2">Marital Status:</td>
                <td className="p-2">
                  <select className="border p-2 rounded w-full">
                    <option>Select your status</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table> */}
        </div>
      </div>
    </div>
  );
}

export default CustomerProfile;
