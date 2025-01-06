import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import api from "../apiConfig/config";
import Select from "react-select";
import { toast } from "react-toastify";
import PdfFile from "./PdfFile";
import jsPDF from "jspdf";
import html2canvas from 'html2canvas';
import { UserContext } from "../contexts/userContext";

const NewQuery = ({ isOpen, onClose }) => {
  const [customer, setCustomer] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [queryData, setQueryData] = useState();


  const pdfRef = useRef();

  const { user, ipAddress, destinationDetails } = useContext(UserContext);

  // const RoomTypeOptions = [
  //   { value: "budget", label: "Budget" },
  //   { value: "deluxe", label: "Deluxe" },
  //   { value: "luxury", label: "Luxury" },
  //   { value: "standard", label: "Standard" },
  // ];
  // const MealTypeOptions = [
  //   { value: 1, label: "Thai" },
  //   { value: 2, label: "Indian" },
  //   { value: 3, label: "Chineese" },
  //   { value: 4, label: "Italian" },
  //   { value: 5, label: "American" },
  // ];


  const [formData, setFormData] = useState({
    ipAddress: "",
    status: true,
    customer: null,
    requirementType: "",
    travelDate: "",
    toTravelDate: "",
    nights: 0,
    days: 0,
    totalTravellers: 1,
    adults: 1,
    kids: 0,
    infants: 0,
    salutation: "",
    fname: "",
    lname: "",
    emailId: "",
    contactNo: "",
    leadSource: { value: "Website", label: "Website" },
    foodPreferences: "",
    basicCost: 0,
    gst: 0,
    totalCost: 0,
    queryType: { value: "B2C", label: "B2C" },
    queryCreatedFrom: "",
    emailStatus: 0,
    leadStatus: 0,
    pkg: null,
    did: null,
    fromcityid: null,
    userId: {
      id: 0
    }
  });

  const [customerData, setCustomerData] = useState({
    fname: "",
    lName: "",
    contactNo: "",
    emailId: "",
    salutation: "",
    id: 0

  })
  const handleCustomerChange = (selected) => {
    setFormData((prev) => ({ ...prev, customer: selected }))
    setCustomerData(prev => ({ ...prev, id: selected.value, salutation: selected.salutation, fname: selected.fName, lName: selected.lName, contactNo: selected.contactNo, emailId: selected.emailId }));
  }

  // const addDaysAndFormat = (date, days) => {
  //   const result = new Date(date);
  //   result.setDate(result.getDate() + days);

  //   // Format the date back to string in "MM/DD/YYYY" format
  //   const day = String(result.getDate()).padStart(2, "0");
  //   const month = String(result.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  //   const year = result.getFullYear();

  //   return `${day}-${month}-${year}`;
  // };

  const addDaysAndFormat = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    // console.log(result)
    return result.toISOString().split("T")[0]; // Format date as YYYY-MM-DD
  };

  // Function to format date as DD-MM-YYYY
  // const formatDate = (date) => {
  //   const options = { day: "2-digit", month: "2-digit", year: "numeric" };
  //   const dateObj = new Date(date);
  //   return dateObj.toLocaleDateString("en-GB", options); // Example: "DD/MM/YYYY"
  // };


  // const [queryDate, setQueryDate] = useState('')
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    // const formattedDateTime = value.includes("T")
    //   ? value
    //   : `${value}T00:00:00`;

    const newToDate = new Date(value);

    if (name === "travelDate") {
      newToDate.setDate(newToDate.getDate() + formData.days);
      setFormData(prev => ({ ...prev, [name]: value, toTravelDate: newToDate.toISOString().split("T")[0] }))
    } else {
      newToDate.setDate(newToDate.getDate() - formData.days);
      setFormData(prev => ({ ...prev, [name]: value, travelDate: newToDate.toISOString().split("T")[0] }))
    }
  }

  // const handleInputChange = (event) => {
  //   const { name, value } = event.target;
  //   setFormData({
  //     ...formData,
  //     [name]: value,
  //   });
  // };

  // const handleFileChange = (event) => {
  //   setFormData({
  //     ...formData,
  //     image: event.target.files[0],
  //   });
  // };

  const [iti, setIti] = useState([])
  const [packages, setPackages] = useState([])

  const [hotelList, setHotelList] = useState([])
  const [allPolicyList, setAllPolicyList] = useState([])

  useEffect(() => {
    axios.get(`${api.baseUrl}/hotel/getAll`)
      .then((response) => {
        setHotelList(response.data)
      })
      .catch((error) => console.error(error));

    axios.get(`${api.baseUrl}/policydetails/getallpkgploicy`)
      .then((response) => {
        setAllPolicyList(response.data)
      })
      .catch((error) => console.error(error));
  }, [])

  const [viewPrice, setViewPrice] = useState({
    markup: 0,
    basiccost: 0,
    gst: 0,
    totalcost: 0,
    packid: 0

  })
  const [viewPolicy, setViewPolicy] = useState([])
  const [viewHotel, setViewHotel] = useState([])

  const [selectedPackage, setSelectedPackage] = useState(null)
  const [viewSightSeeing, setViewSightSeeing] = useState([])
  const [viewActivity, setViewActivity] = useState([])


  const handlePackageChange = (selected) => {
    // console.log(selected)
    setIti([])
    setViewPolicy([])
    setViewPrice({ markup: 0, basiccost: 0, gst: 0, totalcost: 0, packid: 0 })
    setFormData(prev => ({ ...prev, days: selected.days, nights: selected.nights }))

    setViewPolicy(allPolicyList.filter(item => item.packitid.id === selected.value))

    setSelectedPackage(selected)

    let itiList = itinerarys.filter(item => item.packid === selected.value)
    let pkd = pkgItiDet.filter(item => item.packitid.packid === selected.value)

    setViewPkgDet(pkd)

    let check = []
    for (let i = 0; i < pkd.length; i++) {
      pkd[i].sightseeingIds?.forEach(item => check.push(sightSeeing.filter(items => items.id === item)[0]))
      // console.log(pkd[i])
    }
    let ne = new Set(check.map(item => item.title))
    setViewSightSeeing({ ...ne })
    check = []
    for (let i = 0; i < pkd.length; i++) {
      pkd[i].activitiesIds?.forEach(item => check.push(activities.filter(items => items.id === item)[0]))
    }
    ne = new Set(check.map(item => item.title))
    setViewActivity([...ne])

    let catHote = pkd.map(item => ({
      ...item,
      mealsType: item.mealspackageIds
    }))

    let vH = catHote.filter(item => item.roomtypes !== null)

    let viewdat = vH.map(item => ({
      category: item.category,
      hotel: item.roomtypes?.hotel,
      roomtypes: item.roomtypes
    }))
    // let viewcat = vH.map(item => item.category)
    var newH = new Set(viewdat.map(item => item.category))
    let catList = [...newH]

    let data = []
    for (let i = 0; i < catList.length; i++) {
      data.push(viewdat.filter(item => item.category === catList[i])[0])
    }

    setViewHotel(data)
    console.log(data)

    // console.log(iti)
    setIti(itiList.map(item => ({
      ...item,
      sight: viewSightSeeing,
      activity: viewActivity
    })))


    let price = packagePrice.filter(item => item.packid === selected.value)
    if (price.length > 0) {
      setViewPrice({ markup: price[0].markup, basiccost: price[0].basiccost, gst: price[0].gst, totalcost: price[0].totalcost, packid: price[0].packid })
    }
    // let policyDet = policyDetails.filter(item => item.packitid.packitid === selected.value)
    // console.log(policyDet)
    setFormData(prev => ({ ...prev, pkg: selected }))
  }

  const handleCustomerEmail = (e) => {
    const { name, value } = e.target
    setCustomerData((prev) => ({ ...prev, [name]: value }))
  }


  const [viewPackage, setViewPackage] = useState([])
  const handleDestinationChange = (selected) => {
    setFormData((prev) => ({ ...prev, pkg: null }))
    setFormData(prev => ({ ...prev, did: selected }))
    let listPack = packages.filter(item => item.toCityId === selected.value)
    setViewPackage(listPack)
  }

  const [policyDetails, setPolicyDetails] = useState([])
  useEffect(() => {
    axios.get(`${api.baseUrl}/policydetails/getallpkgploicy`)
      .then((response) => {
        setPolicyDetails(response.data)
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });

    axios.get(`${api.baseUrl}/packages/getAllPkg`)
      .then((response) => {
        const formated = response.data.map((item) => ({
          ...item,
          value: item.id,
          label: item.pkName,
        }))
        setPackages(formated)
      })
      .catch((error) => console.error(error))
  }, [])


  const [itinerarys, setItinerays] = useState([])
  useEffect(() => {
    axios.get(`${api.baseUrl}/packageitinerary/getAll`)
      .then((response) => {
        setItinerays(response.data)
      })
      .catch((error) => console.error(error))
  }, [])

  const [pkgItiDet, setPkgItiDet] = useState([])
  const [viewPkgDet, setViewPkgDet] = useState([])

  const [sightSeeing, setSightSeeing] = useState([])
  const [activities, setActivities] = useState([])

  useEffect(() => {
    axios.get(`${api.baseUrl}/packageitinerarydetails/getAll`)
      .then((response) => {
        setPkgItiDet(response.data)
      })
      .catch((error) => console.error(error));


    // axios.get(`${api.baseUrl}/destination/getallDestination`)
    //   .then(res => {
    //     const format = res.data.map(item => ({
    //       ...item,
    //       value: item.id,
    //       label: item.destinationName
    //     }))
    //     setDestinationDetails(format)
    //   })
    //   .catch(error => console.error(error));

    axios.get(`${api.baseUrl}/sightseeing/getAllSightseeing`)
      .then(response => {
        setSightSeeing(response.data)
      })
      .catch(error => console.error(error)
      );

    axios.get(`${api.baseUrl}/activities/getAllActivities`)
      .then(response => {
        setActivities(response.data)
      })
      .catch(error => console.error(error)
      );
  }, [isOpen])

  useEffect(() => {
    axios.get(`${api.baseUrl}/customer/getall`)
      .then((response) => {
        const formated = response.data.content.map((item) => ({
          ...item,
          value: item.id,
          label: item.salutation + " " + item.fName + " " + item.lName,
        }))
        setCustomer(formated)
      })
      .catch((error) => console.error(error));

    // axios.get(`${api.baseUrl}/customer/getall`)
    //   .then((response) => {
    //     const formated = response.data.content.map((item) => ({
    //       ...item,
    //       value: item.id,
    //       label: item.salutation + " " + item.fName + " " + item.lName,
    //     }))
    //     setCustomer(formated)
    //   })
    //   .catch((error) => console.error(error));
  }, [])


  const [packagePrice, setPackagePrice] = useState([])
  useEffect(() => {
    axios.get(`${api.baseUrl}/packageprice/getall`)
      .then((response) => {
        setPackagePrice(response.data)
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const formatDate = (dateString, addDays) => {

    let newToDate = new Date(dateString)

    newToDate.setDate(newToDate.getDate() + addDays)
    const date = new Date(dateString); // Convert string to Date object
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short", // Short weekday (e.g., Fri)
      year: "numeric", // Full year (e.g., 2024)
      month: "short", // Short month (e.g., Aug)
      day: "numeric", // Day of the month (e.g., 2)
    }).format(date);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      requirementType: selectedPackage.pkName || " ",
      travelDate: `${formData.travelDate}T00:00:00`,
      nights: formData.nights,
      days: formData.days,
      totalTravellers: formData.totalTravellers,
      adults: formData.totalTravellers,
      kids: 0,
      infants: 0,
      salutation: customerData.salutation,
      fname: customerData.fname || ' ',
      lname: customerData.lName,
      emailId: customerData.emailId || " ",
      contactNo: customerData.contactNo,
      leadSource: formData.leadSource.value,
      foodPreferences: "Veg",
      basicCost: viewPrice.basiccost,
      gst: viewPrice.gst,
      totalCost: viewPrice.totalcost,
      queryType: formData.queryType.value || " ",
      queryCreatedFrom: formData.leadSource.value,
      emailStatus: 0,
      leadStatus: 1,
      ipAddress: ipAddress,
      packid: selectedPackage.value,
      destination: {
        id: formData.did && formData.did.id
        // id: 1
      },
      fromcityid: {
        id: formData.fromcityid && formData.fromcityid.id
        // id: 1
      },
      userid: {
        userId: user.userId
        // id: 1
      }, customer: {
        id: customerData.id
      }
    }
    console.log(payload)

    await axios.post(`${api.baseUrl}/query/create`, payload, {
      headers: {
        // 'Authorization': `Bearer ${token}`,
        'Access-Control-Allow-Origin': '*',
        "Content-Type": "Application/json"
      }
    })
      .then((response) => {


        let pkgIt = []
        if (formData.days > selectedPackage?.days) {
          pkgIt = [...iti.slice(0, formData.days)]
        } else {
          pkgIt = [...iti]
        }
        let update = pkgIt.map((item, i) => ({
          ...item,
          date: formatDate(response.data.travelDate, i)
        }))

        setQueryData({
          query: response.data, pkgItinerary: update, pkgItiDetails: pkgItiDet,
          destination: formData.did.label, hotel: viewHotel, policy: viewPolicy
        })
        setIsModalOpen(true)
        toast.success("Query saved Successfully.", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        // setFormData({
        //   ipAddress: "",
        //   status: true,
        //   customer: null,
        //   requirementType: "",
        //   travelDate: "",
        //   toTravelDate: "",
        //   nights: 0,
        //   days: 0,
        //   totalTravellers: 1,
        //   adults: 1,
        //   kids: 0,
        //   infants: 0,
        //   salutation: "",
        //   fname: "",
        //   lname: "",
        //   emailId: "",
        //   contactNo: "",
        //   leadSource: { value: "Website", label: "Website" },
        //   foodPreferences: "",
        //   basicCost: 0,
        //   gst: 0,
        //   totalCost: 0,
        //   queryType: { value: "B2C", label: "B2C" },
        //   queryCreatedFrom: "",
        //   emailStatus: 0,
        //   leadStatus: 0,
        //   pkg: null,
        //   did: null,
        //   fromcityid: null,
        // })
      })
      .catch(error => console.error(error));

    // console.log(payload)
    // console.log(iti)

  }

  return (
    <>
      <div
        className={`fixed top-0 right-0 h-full bg-gray-200 shadow-lg transform transition-transform duration-500 ${isOpen ? "translate-x-0" : "translate-x-[1050px]"
          } mt-4 sm:mt-8 md:mt-12 w-full sm:w-[calc(100%-120px)] md:w-[800px] lg:w-[1000px] z-30`}
      >
        {/* "X" button positioned outside the form box */}
        <button
          onClick={() => onClose(true)}
          className="absolute top-[12px] left-[-22px] font-semibold text-white text-sm bg-red-700 square px-3  py-1.5 border border-1 border-transparent hover:border-red-700 hover:bg-white hover:text-red-700"
        >
          X
        </button>
        <div className="flex justify-between items-center p-4 pl-8 bg-white shadow-md">
          <h2 className="text-lg font-bold text-black">New Query</h2>
        </div>
        {/* Line below the title with shadow */}
        <div className="border-b border-gray-300 shadow-sm"></div>

        <form className="p-4 mb-4 h-[calc(100vh-160px)] overflow-y-auto">
          <div className="mb-6">
            <h3 className="bg-red-700 text-white p-2 rounded mb-6">
              Basic Informations
            </h3>
          </div>
          <div className="flex gap-4 mb-6 justify-between">
            <div className="flex items-center">
              <input
                type="radio"
                id="readymadePackage"
                name="packageOption"
                value={true}
                className="mr-2"
                checked={true}
              />
              <label htmlFor="readymadePackage" className="text-sm font-medium">
                Package
              </label>
            </div>
            <div className="w-60">
              <Select
                options={[
                  { value: "B2B", label: "B2B" },
                  { value: "B2C", label: "B2C" },

                ]}
                value={formData.queryType}
                onChange={(selected) => {
                  setFormData(prev => ({ ...prev, queryType: selected }));
                }}
                placeholder="Select"
              />
            </div>
          </div>
          <div className="mb-6">
            <h3 className="bg-red-700 text-white p-2 rounded">
              Customer Details
            </h3>
          </div>

          <div className="flex gap-2 mb-4">
            <div className="w-1/3">
              <label htmlFor="country" className="block text-sm font-medium mb-1">
                Customer Name
              </label>
              <Select
                options={customer}
                value={formData.customer}
                onChange={handleCustomerChange}
                placeholder="Select Customer"
              />
            </div>
            <div className="w-1/3">
              <label htmlFor="code" className="block text-sm font-medium">
                Email
              </label>
              <input
                type="text"
                id="code"
                className="mt-1 p-2 w-full border rounded"
                placeholder=" ******@.com"
                name="emailId"
                value={customerData.emailId}
                onChange={handleCustomerEmail}
              />
            </div>
            <div className="w-1/3">
              <label htmlFor="countryName" className="block text-sm font-medium">
                Phone no.
              </label>
              <input
                type="text"
                id="countryName"
                className="mt-1 p-2 w-full border rounded"
                placeholder=" +91..."
                name="contactNo"
                value={customerData.contactNo}
                onChange={handleCustomerEmail}
              />
            </div>
          </div>
          <div className="flex gap-2 mb-4">
            <div className="w-1/3">
              <label htmlFor="countryName" className="block text-sm font-medium">
                Lead Source
              </label>
              <Select
                className="mt-1"
                options={[
                  { value: "Website", label: "Website" },
                  { value: "LinkedIn", label: "LinkedIn" },
                  { value: "Facebook", label: "Facebook" },
                  { value: "Instagram", label: "Instagram" },
                ]}
                value={formData.leadSource}
                onChange={(selected) => setFormData(prev => ({ ...prev, leadSource: selected }))}
                placeholder="Select"
              />
            </div>
          </div>
          <div className="mb-6">
            <h3 className="bg-red-700 text-white p-2 rounded">Package Details</h3>
          </div>
          <div className="flex gap-2 mb-4">
            <div className="w-1/2">
              <label htmlFor="countryName" className="block text-sm font-medium mb-1">
                From
              </label>
              {/* <input
              type="text"
              id="countryName"
              className="mt-1 p-2 w-full border rounded"
              placeholder=" From where to start a journey..."
              name="pCode"
              value={formData.pCode}
              onChange={
                handleInputChange */}
              {/* }
            /> */}
              <Select
                options={destinationDetails}
                value={formData.fromcityid}
                onChange={(selected) => setFormData(prev => ({ ...prev, fromcityid: selected }))}
                placeholder="Select"
              />
            </div>
            <div className="w-1/2">
              <label
                htmlFor="destination"
                className="block text-sm font-medium mb-1"
              >
                Destination
              </label>
              <Select
                options={destinationDetails}
                value={formData.did}
                onChange={handleDestinationChange}
                placeholder="Select"
              />
            </div>
          </div>
          <div className="flex gap-2 mb-2">
            <div className="w-1/2">
              <label
                htmlFor="destination"
                className="block text-sm font-medium mb-1"
              >
                Package Name
              </label>
              <Select
                options={viewPackage}
                value={formData.pkg}
                onChange={handlePackageChange}
                placeholder="Select"
              />
            </div>
            <div className="flex gap-2 mb-2">
              <div className="w-1/3">
                <label htmlFor="code" className="block text-sm font-medium">
                  Number of Paxs
                </label>
                <input
                  type="text"
                  id="code"
                  className="mt-1 p-2 w-full border rounded"
                  placeholder="where to start"
                  name="code"
                  value={formData.totalTravellers}
                  onChange={(e) => setFormData(prev => ({ ...prev, totalTravellers: e.target.value }))}
                />
              </div>
              <div className="w-1/3">
                <label
                  htmlFor="countryName"
                  className="block text-sm font-medium"
                >
                  No of Days
                </label>
                <input
                  type="text"
                  id="countryName"
                  className="mt-1 p-2 w-full border rounded"
                  placeholder=" No of Days"
                  name="pCode"
                  value={formData.days}
                  onChange={(e) => {
                    setFormData(prev => ({
                      ...prev, days: e.target.value,
                      nights: e.target.value > 1 ? Number(e.target.value) - 1
                        : Number(e.target.value) == 1 ? 1 : 0
                    }));
                  }}
                />
              </div>
              <div className="w-1/3">
                <label
                  htmlFor="countryName"
                  className="block text-sm font-medium"
                >
                  No of Nights
                </label>
                <input
                  type="text"
                  id="countryName"
                  className="mt-1 p-2 w-full border rounded"
                  placeholder="No of Nights"
                  name="pCode"
                  value={formData.nights}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, days: Number(e.target.value) > 1 ? Number(e.target.value) + 1 : Number(e.target.value) == 1 ? 1 : 0, nights: e.target.value }));
                  }}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-between mb-6 gap-2">
            <div className="w-1/2">
              <label htmlFor="destinations" className="block text-sm font-medium">
                Travel Date From
              </label>
              <input
                type="date"
                id="noOfNights"
                name="travelDate"
                value={formData.travelDate}
                onChange={handleDateChange}
                className="mt-1 p-2 w-full border rounded"
                placeholder=""
              />
            </div>
            <div className="w-1/2">
              <label htmlFor="destinations" className="block text-sm font-medium">
                Travel Date To
              </label>
              <input
                type="date"
                id="noOfNights"
                name="toTravelDate"
                value={formData.toTravelDate}
                onChange={handleDateChange}
                className="mt-1 p-2 w-full border rounded"
                placeholder=""
              />
            </div>
          </div>
          <div className="mb-4">
            <h3 className="bg-red-700 text-white p-2 rounded">
              Itinerary
            </h3>
            <table className="min-w-full bg-white mb-4 border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border-r">Day</th>
                  <th className="py-2 px-4 border-r">Title</th>
                  <th className="py-2 px-4 border-r">City Name</th>
                  <th className="py-2 px-4">Meals</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(iti) && iti.slice(0, formData.days).map(item => (

                  <tr>
                    <td className="py-2 px-4 border">
                      {item.daynumber}
                    </td>

                    <td className="py-2 px-4 border">
                      {item.daytitle}
                    </td>

                    <td className="py-2 px-4 border">
                      {item.cityname}
                    </td>

                    <td className="py-2 px-4 border">
                      {item.meals}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mb-4">
            <h3 className="bg-red-700 text-white p-2 rounded">
              Hotel
            </h3>
            <table className="min-w-full bg-white mb-4 border">
              <thead>
                <tr className="bg-gray-100">
                  {viewHotel.map(item =>
                    <th className="py-2 px-4 border-r">{item.category}</th>
                  )}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {viewHotel.map(item =>
                    <td className="py-2 px-4 border-r ">
                      <div className="flex gap-4 p-2 font-normal">
                        <label className="block text-sm ">
                          Hotel Name
                        </label>
                        <p>{item.hotel?.hname}</p>
                      </div>
                      <div className="flex gap-4 p-2 font-normal">
                        <label className="block text-sm">
                          Hotel Rating
                        </label>
                        <p>{item.hotel?.star_ratings}</p>
                      </div>
                      <div className="flex gap-4 p-2 font-normal">
                        <label className="block text-sm">
                          Room Type
                        </label>
                        <p>{item.roomtypes?.bedSize}</p>
                      </div>
                    </td>
                  )}
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mb-6">
            <h3 className="bg-red-700 text-white p-2 rounded">Booking Price</h3>
          </div>

          <div className="flex gap-10 mb-4">
            <label>Basic Cost: {viewPrice.basiccost}</label>
            <label>GST: {viewPrice.gst}</label>
          </div>


          <div className="mb-6">
            <h3 className="bg-red-700 text-white p-2 rounded">Policy</h3>
          </div>

          {/* Add the checkboxes below the status field */}
          <div className="mb-4">
            <label className="block text-sm font-medium">Include Policies</label>
            <div className="flex flex-col">
              {/* {viewPolicy.map(item =>
                <label className="flex items-center mt-2">
                  {item.policytitle}: {item.policydescription}
                </label>
              )} */}
              {viewPolicy.map(item =>
                <label className="flex items-center mt-2" dangerouslySetInnerHTML={{ __html: `${item.policytitle}: ${item.policydescription}` }}>
                </label>
              )}
              {/* <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Include Terms and Conditions
            </label> */}
              {/* <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Include Booking policy
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Include Cancellation & Refund policy
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Include Date Change Policy
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Include Booking Person Details
            </label> */}
            </div>
          </div>
        </form >
        {/* Line with shadow above the buttons */}
        < div className="flex justify-between items-center p-3 bg-white shadow-lg rounded w-full fixed bottom-10" >
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
            >
              Reset
            </button>
          </div>
        </div >
      </div >
      {isModalOpen &&

        <div className="fixed inset-0 flex bg-black bg-opacity-50 w-full z-50 overflow-y-scroll  justify-center">
          <div className="bg-white rounded-lg shadow-lg w-2/3">
            <PdfFile data={queryData} isModalOpen={() => setIsModalOpen(false)} onClose={onClose} />

          </div>
        </div>
      }
    </>
  );
};

export default NewQuery;
