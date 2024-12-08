import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import api from "../apiConfig/config";
import Select from "react-select";
import { toast } from "react-toastify";
import PdfFile from "./PdfFile";
import jsPDF from "jspdf";
import html2canvas from 'html2canvas';

const NewQuery = ({ isOpen, onClose }) => {
  const [customer, setCustomer] = useState([]);
  const [destination, setDestination] = useState("");
  const [status, setStatus] = useState(true);
  const [user, setUser] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [queryData, setQueryData] = useState();


  const [b2b, setB2b] = useState({ value: "B2C", label: "B2C" });

  const pdfRef = useRef();

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

  // Function to retrieve and decrypt the token
  async function getDecryptedToken() {
    const keyData = JSON.parse(localStorage.getItem("encryptionKey"));
    const ivBase64 = localStorage.getItem("iv");
    const encryptedTokenBase64 = localStorage.getItem("encryptedToken");

    if (!keyData || !ivBase64 || !encryptedTokenBase64) {
      throw new Error("No token found");
    }

    // Convert back from base64
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

  // Example usage to make an authenticated request
  useEffect(() => {
    getDecryptedToken()
      .then((token) => {
        return axios.get(`${api.baseUrl}/username`, {
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


    // axios.get(`${api.baseUrl}/customer/getall`)
    // .then(response => (response.data))
  }, []);

  // const generatePDF = async () => {
  //   const element = pdfRef.current; // The HTML content to convert into a PDF

  //   const modalContent = document.getElementById("modal-content");

  //   // if (modalContent) {
  //   const canvas = await html2canvas(modalContent, {
  //     scale: 2, // Improves quality
  //   });

  //   const imgData = canvas.toDataURL("image/png");
  //   const pdf = new jsPDF("p", "mm", "a4");

  //   // Adjust image dimensions for A4 size
  //   const imgWidth = 190; // A4 width in mm (with margins)
  //   const imgHeight = (canvas.height * imgWidth) / canvas.width;

  //   pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
  //   pdf.save("data-summary.pdf");
  // }

  // html2canvas(element).then((canvas) => {
  //   const imgData = canvas.toDataURL('image/png');
  //   const pdf = new jsPDF();
  //   const imgWidth = 190;
  //   const pageHeight = 295;
  //   const imgHeight = (canvas.height * imgWidth) / canvas.width;
  //   let heightLeft = imgHeight;
  //   let position = 0;

  //   // pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
  //   heightLeft -= pageHeight;

  //   while (heightLeft >= 0) {
  //     position = heightLeft - imgHeight;
  //     pdf.addPage();
  //     pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
  //     heightLeft -= pageHeight;
  // }

  //   pdf.save('generated.pdf');

  // });
  // const doc = new jsPDF();
  // doc.text(`Data Summary`, 10, 10);
  // Object.entries(formData).forEach(([key, value], index) => {
  //   doc.text(`${key}: ${value}`, 10, 20 + index * 10);
  // });
  // doc.save("data-summary.pdf");
  // };



  const [formData, setFormData] = useState({
    customer,
    // Name: "",
    // customerEmail: "",
    // customerPhone: "",
    // pCode,
    ipAddress: "",
    status,

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
    leadSource: "",
    foodPreferences: "",
    basicCost: 0,
    gst: 0,
    totalCost: 0,
    queryType: "",
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

  const handleDateChange = (e) => {
    // const { name, value } = e.target
    // if (name === "travelDate") {
    //   let datef = new Date(value)
    //   let newDate = new Date()
    //   newDate.setDate(datef.getDate() + formData.days)
    //   setFormData(prev => ({ ...prev, travelDate: value, toTravelDate: newDate.toDateString() }))
    // } else {
    //   let datef = new Date(value)
    //   let dateChange = datef.getDate()
    //   let newDate = new Date()
    //   newDate.setDate(datef.getDate() - formData.days)
    //   setFormData(prev => ({ ...prev, travelDate: newDate.toDateString(), toTravelDate: value }))
    // }
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (event) => {
    setFormData({
      ...formData,
      image: event.target.files[0],
    });
  };

  const [iti, setIti] = useState([])
  const [packages, setPackages] = useState([])
  const [newQuery, setNewQuery] = useState(
    {
      "requirementType": "",
      "travelDate": "",
      "nights": 0,
      "days": 0,
      "totalTravellers": 1,
      "adults": 1,
      "kids": 0,
      "infants": 0,
      "salutation": "",
      "fname": "",
      "lname": "",
      "emailId": "",
      "contactNo": "",
      "leadSource": "",
      "foodPreferences": "",
      "basicCost": 0,
      "gst": 0,
      "totalCost": 0,
      "queryType": "",
      "queryCreatedFrom": "",
      "emailStatus": 0,
      "leadStatus": 0,
      "pkg": {
        "id": 0
      },
      "did": {
        "id": 0
      },
      "fromcityid": {
        "id": 0
      },
      "userId": {
        "id": 0
      }
    }
  )

  const [hotelList, setHotelList] = useState([])
  useEffect(() => {
    axios.get(`${api.baseUrl}/hotel/getAll`)
      .then((response) => {
        setHotelList(response.data)
      })
      .catch((error) => console.error(error))
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
  const handlePackageChange = (selected) => {
    console.log(selected)
    setViewPolicy([])
    setViewPrice({ markup: 0, basiccost: 0, gst: 0, totalcost: 0, packid: 0 })
    setFormData(prev => ({ ...prev, days: selected.days, nights: selected.nights }))


    let itiList = itinerarys.filter(item => item.packid === selected.value)
    let pkd = pkgItiDet.filter(item => item.packitid.packid === selected.value)

    let catHote = pkd.map(item => ({
      category: item.category,
      roomtypes: item.roomtypes,
      mealsType: item.mealspackageIds
    }))
    console.log(pkgItiDet)
    // console.log(catHote)

    let vH = catHote.filter(item => item.roomtypes !== null)

    let viewdat = vH.map(item => ({ category: item.category, hotel: item.roomtypes?.hotel, roomtypes: item.roomtypes }))
    let viewcat = vH.map(item => item.category)
    var newH = new Set(viewcat)
    let catList = [...newH]
    // console.log(viewdat)
    // let data = catList.map(item => item === )
    setViewHotel(viewdat)
    // console.log([...newH])

    setIti(itiList)

    let price = packagePrice.filter(item => item.id === selected.value)
    if (price.length > 0) {
      setViewPrice({ markup: price[0].markup, basiccost: price[0].basiccost, gst: price[0].gst, totalcost: price[0].totalcost, packid: price[0].packid })
    }
    let policyDet = policyDetails.filter(item => item.packitid.packitid === selected.value)
    setViewPolicy(policyDet)
    setFormData(prev => ({ ...prev, pkg: selected }))
  }

  const [viewPackage, setViewPackage] = useState([])
  const handleDestinationChange = (selected) => {
    setViewPackage([])
    setFormData(prev => ({ ...prev, did: selected }))
    let listPack = packages.filter(item => item.toCityId === selected.id)
    console.log(listPack)
    setViewPackage(listPack)
  }

  const [policyDetails, setPolicyDetails] = useState([])
  useEffect(() => {
    axios.get(`${api.baseUrl}/policydetails/getall`)
      .then((response) => {
        setPolicyDetails(response.data)
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    axios.get(`${api.baseUrl}/packages/getAll`)
      .then((response) => {
        const formated = response.data.content.map((item) => ({
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
  useEffect(() => {
    axios.get(`${api.baseUrl}/packageitinerarydetails/getAll`)
      .then((response) => {
        setPkgItiDet(response.data)
      })
      .catch((error) => console.error(error))
  }, [])

  const [mealPlan, setMealPlan] = useState([])
  useEffect(() => {
    axios.get(`${api.baseUrl}/mealspackage/getall`)
      .then((response) => {
        const format = response.data.map(item => ({

        }))
        setMealPlan(response.data)
      })
      .catch((error) => console.error(error))
  }, [])


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
      .catch((error) => console.error(error))
  }, [])

  useEffect(() => {
    axios.get(`${api.baseUrl}/ipAddress`)
      .then((response) => {
        setFormData({
          ...formData,
          ipAddress: response.data,
        });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

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

  useEffect(() => {
    axios.get(`${api.baseUrl}/destination/getall`)
      .then((response) => {
        const format = response.data.map(item => ({
          ...item,
          value: item.id,
          label: item.destinationName
        }))
        setDestination(format)
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      proposalId: "ABC123",
      requirementType: "Holiday Package",
      travelDate: formData.travelDate,
      nights: formData.nights,
      days: formData.days,
      totalTravellers: formData.totalTravellers,
      adults: formData.totalTravellers,
      kids: 0,
      infants: 0,
      salutation: formData.customer.salutation,
      fname: formData.customer.fname || 'Raj',
      lname: formData.customer.lname,
      emailId: formData.customer.emailId || 2,
      contactNo: formData.customer.contactNo,
      leadSource: formData.leadSource,
      foodPreferences: "Veg",
      basicCost: formData.basicCost,
      gst: formData.gst,
      totalCost: formData.totalCost,
      queryType: formData.queryType,
      queryCreatedFrom: "Facebook",
      emailStatus: 0,
      leadStatus: 0,
      pkg: {
        // id: formData.pkg.id
        id: 1
      },
      did: {
        id: formData.did
        // id: 1
      },
      fromcityid: {
        id: formData.fromcityid
        // id: 1
      },
      userId: {
        id: user.id || 1
        // id: 1
      }
    }

    // await axios.post(`${api.baseUrl}/query/create`, payload, {
    //   headers: {
    //     // 'Authorization': `Bearer ${token}`,
    //     'Access-Control-Allow-Origin': '*'
    //   }
    // })
    //   .then((response) => {
    //     setQueryData(response.data)
    //     toast.success("Query saved Successfully.", {
    //       position: "top-center",
    //       autoClose: 5000,
    //       hideProgressBar: false,
    //       closeOnClick: true,
    //       pauseOnHover: true,
    //       draggable: true,
    //       progress: undefined,
    //     });
    //   })
    //   .catch(error => console.error(error));

    //   console.log(payload)

    setIsModalOpen(true)
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
                value={b2b}
                onChange={(selected) => {
                  setFormData(prev => ({ ...prev, queryType: selected.label }));
                  setB2b(selected)
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
                onChange={(selected) => setFormData(prev => ({ ...prev, customer: selected }))}
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
                name="code"
                value={formData.customer.emailId}
                onChange={handleInputChange}
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
                name="pCode"
                value={formData.customer.contactNo}
                onChange={
                  handleInputChange
                  // (e) => setCode(e.target.value)
                }
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
                onChange={(selected) => setFormData(prev => ({ ...prev, leadSource: selected.value }))}
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
                options={destination}
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
                options={destination}
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
                  onChange={(e) => setFormData(prev => ({ ...prev, days: e.target.value }))}
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
                  onChange={(e) => setFormData(prev => ({ ...prev, nights: e.target.value }))}
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
                    <td className="py-2 px-4 border-r">
                      <label className="block text-sm font-medium">
                        Hotel Name
                      </label>
                      <p>{item.hotel?.hname}</p>
                      <label className="block text-sm font-medium">
                        Hotel Rating
                      </label>
                      <p>{item.hotel?.star_ratings}</p>
                      <label className="block text-sm font-medium">
                        Room Type
                      </label>
                      <p>{item.roomtypes?.bed_size}</p>
                      <label className="block text-sm font-medium">
                        Room Type
                      </label>
                      {/* <Select
                    /> */}
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
              {viewPolicy.map(item =>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />{item.policytitle}
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
            <PdfFile data={queryData} isModalOpen={() => setIsModalOpen(false)} />

          </div>
        </div>
      }
    </>
  );
};

export default NewQuery;
