import React, { useEffect } from "react";
import NewQuery from "../pages/NewQuery";
import { FaTrash } from "react-icons/fa6";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import api from "../apiConfig/config";
import { AiOutlineEye } from "react-icons/ai";
import { defaults } from "autoprefixer";
import TableComponent from "../component/TableComponent";

const CustomerProfile = () => {
  // const location = useLocation();
  // const option = location.state?.option;
  // console.log(option)
  const queries = [
    {
      queryDate: "18-Jan-21 01:1",
      queryID: "Q/21/202962",
      travelDate: "28-Jan-21 - 28-Jan-21",
      type: "Flight",
      destination: "Dubai, AE - Dubai Intl Airport (DXB)",
      pax: "1 Adult(s)",
      lastUpdate: "18-Jan-2021 01:52",
      proposals: "0",
      stage: "Query Created",
      owner: "Gaurav Gupta",
    },
    {
      queryDate: "18-Jan-21 01:1",
      queryID: "Q/21/202961",
      travelDate: "31-Jan-21 - 05-Feb-21",
      type: "Visa",
      destination: "Singapore",
      pax: "1 Applicant(s)",
      lastUpdate: "18-Jan-2021 01:51",
      proposals: "1",
      stage: "Proposal Sent",
      owner: "Gaurav Gupta",
    },
    {
      queryDate: "18-Jan-21 01:1",
      queryID: "Q/21/202968",
      travelDate: "22-Jan-21 - 26-Jan-21",
      type: "Package",
      destination: "Kerala",
      pax: "2 Adult(s)",
      lastUpdate: "18-Jan-2021 01:45",
      proposals: "1",
      stage: "Proposal Sent",
      owner: "Gaurav Gupta",
    },
    {
      queryDate: "18-Jan-21 01:1",
      queryID: "Q/21/202965",
      travelDate: "28-Jan-21",
      type: "Package",
      destination: "Singapore",
      pax: "5 Adult(s)",
      lastUpdate: "18-Jan-2021 01:03",
      proposals: "2",
      stage: "Query Created",
      owner: "Gaurav Gupta",
    },
    {
      queryDate: "18-Jan-21 00:1",
      queryID: "Q/21/202964",
      travelDate: "20-Jan-21",
      type: "Package",
      destination: "Singapore",
      pax: "2 Adult(s)",
      lastUpdate: "18-Jan-2021 00:07",
      proposals: "0",
      stage: "Query Created",
      owner: "Gaurav Gupta",
    },
    {
      queryDate: "08-Jan-21 18:1",
      queryID: "Q/21/202900",
      travelDate: "28-Jan-21 - 25-Jan-21",
      type: "Package",
      destination: "Kerala",
      pax: "2 Adult(s)",
      lastUpdate: "08-Jan-2021 18:52",
      proposals: "1",
      stage: "Confirmed - Payment Pending",
      owner: "Gaurav Gupta",
    },
    {
      queryDate: "08-Jan-21 18:1",
      queryID: "Q/21/202967",
      travelDate: "14-Jan-21",
      type: "Package",
      destination: "Kerala",
      pax: "2 Adult(s)",
      lastUpdate: "08-Jan-2021 18:24",
      proposals: "0",
      stage: "Query Created",
      owner: "Gaurav Gupta",
    },
  ];

  const [tab, setTab] = React.useState("profile");
  const [addData, setAddData] = React.useState([]);

  const [userData, setUserData] = React.useState({});

  const [query, setQuery] = React.useState(null);
  const [packageDetails, setPackageDetails] = React.useState(null);
  const [packageitineraryDetails, setPackageitineraryDetails] =
    React.useState(null);

  const uniqueFoodPreferences = [...new Set(query && query.map(query => query.foodPreferences))];

  const params = useParams();

  const userId = params.userId;

  console.log(params);
  console.log(userId);

  useEffect(() => {
    axios.get(`${api.baseUrl}/customer/getbyid/${userId}`).then((res) => {
      setUserData(res.data);
    });
  }, [userId]);

  // <tr className="bg-gray-200">
  //   <th className="p-2 border">Query Date</th>
  //   <th className="p-2 border">Query ID</th>
  //   <th className="p-2 border">Travel Date</th>
  //   <th className="p-2 border">Type</th>
  //   <th className="p-2 border">Destination</th>
  //   <th className="p-2 border">Pax</th>
  //   <th className="p-2 border">Last Update</th>
  //   <th className="p-2 border">Proposals</th>
  //   <th className="p-2 border">Stage</th>
  //   <th className="p-2 border">Owner</th>
  //   <th className="p-2 border">Action</th>
  // </tr>
  const columns = [
    {
      header: 'Query Date',
      accessor: 'query_Date',
    },
    {
      header: 'Query ID',
      accessor: 'id',
    },
    {
      header: 'Travel Date',
      accessor: 'travelDate',
    },
    {
      header: 'Type',
      accessor: 'queryType',
    },
    {
      header: 'Destination',
      render: ({row}) => (
        row.destination && row.destination.destinationName && row.destination.destinationName
      )
    },
    {
      header: 'Pax',
      accessor: 'pax',
    },
    {
      header: 'Last Update',
      accessor: 'lastUpdated_Date',
    },
    {
      header: 'Proposals',
      accessor: 'proposalId',
    },
    {
      header: 'Stage',
      accessor: 'stage',
    },
    {
      header: 'Owner',
      accessor: 'owner',
    },
    {
      header: 'Action',
      accessor: 'action',
      render: (row) => (
        <AiOutlineEye className="text-xl cursor-pointer" />
      ),
    },
  ];

  useEffect(() => {
    if (userData && userData.id) {
      axios.get(`${api.baseUrl}/query/getall?customerId=${userData.id}`)
        .then((res) => {
          const queriesData = res.data;
          setQuery(queriesData);

          const packageDetailsPromises = queriesData && queriesData.map(query => {
            if (query.id) {
              return axios.get(`${api.baseUrl}/packages/getby/${query.packid}`)
                .then(res => res.data);
            }
            return null;
          }).filter(Boolean);

          Promise.all(packageDetailsPromises)
            .then((packagesData) => {
              setPackageDetails(packagesData);

              const itineraryDetailsPromises = packagesData.map(packageData => {
                // /packageitinerary/getAll?packageId=1 
                return axios.get(`${api.baseUrl}/packageitinerary/getAll?packageId=${packageData.id}`)
                  .then(res => res.data);
              });

              Promise.all(itineraryDetailsPromises)
                .then((itinerariesData) => {
                  setPackageitineraryDetails(itinerariesData);
                })
                .catch(err => console.error("Failed to fetch package itineraries", err));
            })
            .catch(err => console.error("Failed to fetch package details", err));
        })
        .catch(err => console.error("Failed to fetch queries", err));
    }
  }, [userData]);
  // console.log(query[0].destination && query[0].destination.destinationName && query[0].destination.destinationName);

  // TODO: Make Make use of packageDetails to show data

  return (
    <div className="p-4 w-full mb-14">
      <div className="bg-white p-4 rounded shadow">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between mb-4">
          <div className="mb-2 md:mb-0">
            <p>
              Customer Name : {userData.salutation} {userData.fName}{" "}
              {userData.lName}
            </p>
            <p>Owner Name : Gaurav Gupta</p>
          </div>
          <div className="mb-2 md:mb-0">
            <p>Contact No : {userData.contactNo}</p>
            <p>Customer Type: B2C</p>
          </div>
          <div className="mb-2 md:mb-0">
            <p>Email ID : {userData.emailId}</p>
            <p>Lead Source: {userData.leadSource}</p>
          </div>
          <div className="mb-2 md:mb-0">
            <p>Active Since : 02-Aug-17 05:26:00</p>
          </div>
        </div>

        {/* New Query Button */}
        <div className="flex justify-end mb-4">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={() => {
              setAddData(["NewQuery"]);
            }}
          >
            + New Query
          </button>
        </div>

        {/* New Query Modal */}
        <div
          className="submenu-menu"
          style={{
            right: addData[0] === "NewQuery" ? "0" : "-100%",
          }}
        >
          <NewQuery
            isOpen={addData[0] === "NewQuery"}
            onClose={() => setAddData([])}
          />
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white p-4 rounded shadow mt-4">
        <div className="flex overflow-x-auto space-x-4 mb-4">
          {["profile", "queries", "bookings"].map((item) => (
            <button
              key={item}
              className={`px-4 py-2 ${tab === item ? "bg-blue-500 text-white rounded-md" : ""
                }`}
              onClick={() => setTab(item)}
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}{" "}
              {item === "queries" && (
                <span className="bg-white text-red-500 rounded-full px-2">
                  236
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content Section Based on Tab */}
      {tab === "profile" && (
        <>
          <div>
            {/* Payments Section */}
            <div className="bg-white p-4 rounded shadow mt-4">
              <div className="flex justify-between items-center mb-4">
                <p>Payments: </p>
                <p>Total Billed: 405,895.66 </p>
                <p>Total Paid: 105,020.00</p>
                <p>Pending: 300,875.66</p>
                <button className="bg-green-500 text-white px-4 py-2 rounded">
                  View
                </button>
              </div>
            </div>

            {/* Preferences and Destinations */}
            <div className="flex flex-col md:flex-row space-x-0 md:space-x-4 mt-4">
              <div className="bg-white p-4 rounded shadow w-full md:w-1/2">
                <p className="font-bold">I want to go:</p>
                <div className="overflow-y-auto max-h-48 mt-2">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="p-2">Destination</th>
                        <th className="p-2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {query ? query.map((dest, index) => (

                        <tr className="border-b">
                          <td className="p-2 text-center">
                            {dest &&
                              dest.destination &&
                              dest.destination.destinationName &&
                              dest.destination.destinationName}
                          </td>
                          <td className="p-2 text-center">
                            <button className="text-red-500">
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      )
                      ) :
                        <tr>
                          <td className="p-2 text-center" colSpan="2">
                            No record found
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white p-4 rounded shadow w-full md:w-1/2 mt-4 md:mt-0">
                <p className="font-bold mb-4">Customer Profile / Preferences</p>
                <table className="w-full">
                  <tbody>
                    <tr className="border-b">
                      <td className="p-2">Food:</td>
                      {uniqueFoodPreferences && uniqueFoodPreferences.map((preference, index) => (
                        <td key={index} className="p-2">{preference}</td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-2">Hotel:</td>
                      <td className="p-2">
                        {/* {packageitineraryDetails &&
                          packageitineraryDetails.roomtypes &&
                          packageitineraryDetails.room_types.hotel &&
                          packageitineraryDetails.room_types.hotel
                            .star_ratings &&
                          packageitineraryDetails.room_types.hotel.star_ratings} */}
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2">Passport:</td>
                      <td className="p-2">{userData ? userData.passportId ? userData.passportId : 'N/A' : 'N/A'}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2">Adhar:</td>
                      <td className="p-2">{userData ? userData.adharNo ? userData.adharNo : 'N/A' : 'N/A'}</td>
                    </tr>
                    <tr>
                      <td className="p-2">Marital Status:</td>
                      <td className="p-2">
                        {userData ? userData.marritalStatus ? userData.marritalStatus : 'N/A' : 'N/A'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row space-x-0 md:space-x-4 mt-4">
            {/* Recent Queries Section */}
            <div className="bg-white p-4 rounded shadow w-full md:w-1/2">
              <div className="flex justify-between items-center mb-4">
                <p className="font-bold">Recent Queries:</p>
              </div>
              <div className="overflow-y-auto max-h-96">
              <TableComponent
              columns={columns}
              data={query}
            />
                
              </div>
            </div>

            {/* Have Been To Section */}
            <div className="bg-white p-4 rounded shadow w-full md:w-1/2 mt-4 md:mt-0">
              <div className="flex justify-between items-center mb-4">
                <p className="font-bold">Have Been To:</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="p-2">Last Visited</th>
                      <th className="p-2">Country</th>
                      <th className="p-2">City</th>
                      <th className="p-2">Type</th>
                      <th className="p-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-2 text-center" colSpan="5">
                        No record found
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}

      {tab === "queries" && (
        <div className="bg-white p-4 rounded shadow mt-4">
          {/* Recent Queries */}
          <p className="font-bold mb-4">Recent Queries:</p>
          <div className="overflow-y-auto max-h-88">
            {/* <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 border">Query Date</th>
                  <th className="p-2 border">Query ID</th>
                  <th className="p-2 border">Travel Date</th>
                  <th className="p-2 border">Type</th>
                  <th className="p-2 border">Destination</th>
                  <th className="p-2 border">Pax</th>
                  <th className="p-2 border">Last Update</th>
                  <th className="p-2 border">Proposals</th>
                  <th className="p-2 border">Stage</th>
                  <th className="p-2 border">Owner</th>
                  <th className="p-2 border">Action</th>
                </tr>
              </thead>
              <tbody>
                {queries.map((query, index) => (
                  <tr key={index} className="border-b hover:bg-gray-100">
                    <td className="p-2 border">{query.queryDate}</td>
                    <td className="p-2 border">{query.queryID}</td>
                    <td className="p-2 border">{query.travelDate}</td>
                    <td className="p-2 border">{query.type}</td>
                    <td className="p-2 border">{query.destination}</td>
                    <td className="p-2 border">{query.pax}</td>
                    <td className="p-2 border">{query.lastUpdate}</td>
                    <td className="p-2 border">{query.proposals}</td>
                    <td className="p-2 border">{query.stage}</td>
                    <td className="p-2 border">{query.owner}</td>
                    <td className="p-2 border text-center">
                      <AiOutlineEye className="text-xl cursor-pointer" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table> */}
            <TableComponent
              columns={columns}
              data={query}
            />
          </div>
        </div>
      )}

      {tab === "bookings" && (
        <div className="bg-white p-4 rounded shadow mt-4">
          <p className="font-bold mb-4">Recent Queries:</p>
          <div className="overflow-y-auto max-h-88">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 border">Query Date</th>
                  <th className="p-2 border">Query ID</th>
                  <th className="p-2 border">Travel Date</th>
                  <th className="p-2 border">Type</th>
                  <th className="p-2 border">Destination</th>
                  <th className="p-2 border">Pax</th>
                  <th className="p-2 border">Last Update</th>
                  <th className="p-2 border">Proposals</th>
                  <th className="p-2 border">Stage</th>
                  <th className="p-2 border">Owner</th>
                  <th className="p-2 border">Action</th>
                </tr>
              </thead>
              <tbody>
                {queries.map((query, index) => (
                  <tr key={index} className="border-b hover:bg-gray-100">
                    <td className="p-2 border">{query.queryDate}</td>
                    <td className="p-2 border">{query.queryID}</td>
                    <td className="p-2 border">{query.travelDate}</td>
                    <td className="p-2 border">{query.type}</td>
                    <td className="p-2 border">{query.destination}</td>
                    <td className="p-2 border">{query.pax}</td>
                    <td className="p-2 border">{query.lastUpdate}</td>
                    <td className="p-2 border">{query.proposals}</td>
                    <td className="p-2 border">{query.stage}</td>
                    <td className="p-2 border">{query.owner}</td>
                    <td className="p-2 border text-center">
                      <AiOutlineEye className="text-xl cursor-pointer" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerProfile;
