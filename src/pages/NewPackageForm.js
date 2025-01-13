import React, { useContext, useEffect, useState } from "react";
import Select, { components } from "react-select";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import CreatableSelect from "react-select/creatable";
import api from "../apiConfig/config";
import axios from "axios";
import PackageItinerary from "./PackageItinerary";
import { toast } from "react-toastify";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { isArray } from "chart.js/helpers";
import { UserContext } from "../contexts/userContext";

const NewPackageForm = ({ isOpen, onClose, editablePackageData }) => {
  // console.log(editablePackageData);
  const [nights, setNights] = useState(0);
  const [checkNights, setCheckNights] = useState(0);
  // const [editNights, setEditNights] = useState(0);
  const [isOverNight, setIsOverNight] = useState(false);
  const [days, setDays] = useState(0);
  const [page, setPage] = useState(1);
  const [selectedDestinations, setSelectedDestinations] = useState([]);
  const [selectedPackageType, setSelectedPackageType] = useState("domestic");
  const [isFixedDeparture, setIsFixedDeparture] = useState(false);
  const [editorData, setEditorData] = useState("");
  const [packageData, setPackageData] = useState();
  const [packageItinerayData, setPackageItinerayData] = useState({});
  const [packageItinerayDetails, setPackageItinerayDetails] = useState({});
  const [inclusions, setInclusions] = useState([]);
  const [selectedInclusions, setSelectedInclusions] = useState([]);
  const [exclusions, setExclusions] = useState([]);
  const [selectedExclusions, setSelectedExclusions] = useState([]);
  const [selectedStartCity, setSelectedStartCity] = useState();
  const [selectedEndCity, setSelectedEndCity] = useState();
  const [selectedSupplier, SetSelectedSupplier] = useState(null);
  const [selectedHotelCity, setSelectedHotelCity] = useState(null);
  const [destination, setDestinations] = useState([]);

  const [packageCategories, setPackageCategories] = useState([]);
  const [supplier, setSupplier] = useState([]);
  const [hotelData, setHotelData] = useState([]);
  const [hotelCompleteData, setHotelCompleteData] = useState([]);
  const [roomTypeCompleteData, setRoomTypeCompleteData] = useState([]);
  const [siteSeeingData, setSiteSeeingData] = useState([]);
  const [activityData, setActivityData] = useState([]);
  const [roomTypeData, setRoomTypeData] = useState([]);
  const [mealTypeData, setMealTypeData] = useState([]);
  const [packageSpecification, setPackageSpecification] = useState(
    "Daily Itinerary Based"
  );
  const [packageTheme, setPackageTheme] = useState([]);
  const [selectedDestinationDeparture, setSelectedDestinationDeparture] =
    useState([]);
  const [pkImage, setPkImage] = useState(null);

  const [selectedPackageTheme, setSelectedPackageTheme] = useState([]);

  const [addCityAndNight, setAddCityAndNight] = useState([]);
  const [showItiForm, setShowItiForm] = useState(false);
  const [showIti, setShowIti] = useState([]);

  const { user, ipAddress } = useContext(UserContext)

  const handleNightChange = (e) => {
    // if (packageData.nights > e.target.value + formItinaryData - 1) {
    if (formData.nights > e.target.value + formItinaryData - 1) {
      setNights(e.target.value)
      setCheckNights(checkNights + e.target.value)
      setIsOverNight(false)
    } else {
      setIsOverNight(false)
      setNights(e.target.value)
      setIsOverNight(true)
    }
  }


  const [formData, setFormData] = useState({
    pkName: "",
    fromCityId: null,
    toCityId: null,
    destinationCoveredId: "",
    description: "",
    pkCategory: "",
    pkSpecifications: "",
    days: 0,
    nights: 0,
    is_fixed_departure: true,
    fixed_departure_destinations: "",
    packageType: "",
    created_by: "",
    modified_by: "",
    ipaddress: "",
    status: 1,
    isdelete: 0,
    inclusionid: "",
    exclusionid: "",
    SupplierId: null,
    pkthem: "",
    image: null,
  });

  const [formItinaryData, setFormItinaryData] = useState([]);

  const [openItems, setOpenItems] = useState({});

  const toggleAccordion = (index) => {
    setOpenItems((prevOpenItems) => ({
      ...prevOpenItems,
      [index]: !prevOpenItems[index], // Toggle the clicked item
    }));
  };
  const [displayIti, setDisplayIti] = useState([]);
  const [displayItiDesti, setDisplayItiDesti] = useState([]);
  const [listTransport, setListTransport] = useState([]);
  const [policyList, setPolicyList] = useState([]);

  useEffect(() => {
    Promise.all([
      axios.get(`${api.baseUrl}/itinerarys/getallItineary`),
      axios.get(`${api.baseUrl}/transport/getAll`),
    ])
      .then((response) => {
        const formatIti = response[0].data.map((item) => ({
          ...item,
          value: item.id,
          label: item.daytitle
        }));
        setDisplayIti(formatIti);

        const formatTransport = response[1].data.content.map((item) => ({
          value: item.id,
          label: item.transportmode,
        }));
        setListTransport(formatTransport);
      })
      .catch((error) => console.error(error));
  }, []);

  const [editIti, setEditIti] = useState(false)
  // const handleEdit = (data) => {
  //   setEditIti(true)
  // }


  // const [allCountry, setAllCountry] = useState([])
  // const [allState, setAllState] = useState([])
  const [domesticList, setDomesticList] = useState([])
  const [internationalList, setInternationalList] = useState([])

  const [allDestinationList, setAllDestinationList] = useState([])


  useEffect(() => {
    axios.get(`${api.baseUrl}/destination/getallDestination`)
      .then(response => {
        const formatDestination = response.data.map((item) => ({
          ...item,
          type: "city",
          label: item.destinationName + ", (" + item.state.stateName + ") " + item.country.countryName,
          value: 0
        }))
        setAllDestinationList(formatDestination)
        // console.log(formatDestination)

        axios.get(`${api.baseUrl}/state/getAllState`)
          .then(res => {
            const formatState = res.data.map((item) => ({
              ...item,
              type: "state",
              label: item.stateName + ", " + item.country.countryName,
              value: 0
            }))
            let update = [...formatDestination, ...formatState]
            setDomesticList(update.map((item, index) => ({
              ...item,
              value: index + 1
            })))

            axios.get(`${api.baseUrl}/country/getallcountry`)
              .then(r => {
                const formatCountry = r.data.map((item) => ({
                  ...item,
                  type: "country",
                  label: item.countryName.toUpperCase(),
                  value: 0
                }))

                const allData = [...formatState, ...formatCountry]
                setInternationalList(allData.map((item, index) => ({
                  ...item,
                  value: index + 1
                })))

              }).catch(error => console.error(error))

          }).catch(error => console.error(error))

      }).catch(error => console.error(error));

    // axios.get(`${api.baseUrl}/vendor/getAll`)
    //   .then(res => {
    //     const formattedSuppliers = res.data.content.map((item) => ({
    //       value: item.id,
    //       label: item.vendorName,
    //     }));
    //     setSupplier(formattedSuppliers);
    //   })
    //   .catch(error => console.error("Vendor search error," + error))

  }, [])

  useEffect(() => {
    Promise.all([
      axios.get(`${api.baseUrl}/destination/getallDestination`), //index 0
      axios.get(`${api.baseUrl}/vendor/getAll`), //index  1
      axios.get(`${api.baseUrl}/packageTheme/getAll`), //index 2
      axios.get(`${api.baseUrl}/inclusion/getall`), //index 3
      axios.get(`${api.baseUrl}/exclusion/getall`), //index 4
      axios.get(`${api.baseUrl}/hotel/getAll`), //index 5
      axios.get(`${api.baseUrl}/roomtypes/getall`), //index 6
      axios.get(`${api.baseUrl}/mealspackage/getAll`), //index 7
      axios.get(`${api.baseUrl}/activities/getAllActivities`), //index 8
      axios.get(`${api.baseUrl}/sightseeing/getAllSightseeing`), //index 9
      axios.get(`${api.baseUrl}/policy/getallpolicy`), //index 10
      // axios.get(`${api.baseUrl}/country/getall`), //index 11
      // axios.get(`${api.baseUrl}/state/getall`), //index 12
    ]).then((response) => {
      const formattedOptions = response[0].data.map((item) => ({
        ...item,
        value: item.id, // or any unique identifier
        label: item.destinationName, // or any display label you want
      }));
      setDestinations(formattedOptions);

      const formattedSuppliers = response[1].data.content.map((item) => ({
        value: item.id,
        label: item.vendorName,
      }));
      setSupplier(formattedSuppliers);

      const formattedPackageThemes = response[2].data.content.map((item) => ({
        value: item.id,
        label: item.title,
      }));
      setPackageTheme(formattedPackageThemes);

      const formattedInclusions = response[3].data.content.map((item) => ({
        value: item.id,
        label: item.inclusionname,
      }));
      setInclusions(formattedInclusions);

      const formattedExclusions = response[4].data.content.map((item) => ({
        value: item.id,
        label: item.exclusionname,
      }));
      setExclusions(formattedExclusions);

      const formattedHotel = response[5].data.map((item) => ({
        ...item,
        value: item.id,
        label: item.hname,
      }));
      setHotelData(formattedHotel);
      setHotelCompleteData(formattedHotel);

      const formattedRoomType = response[6].data.map((item) => ({
        ...item,
        value: item.id,
        label: item.bedSize,
      }));
      setRoomTypeCompleteData(formattedRoomType);
      setRoomTypeData(formattedRoomType);

      const formattedMealType = response[7].data.content.map((item) => ({
        value: item.id,
        label: item.mealstypeCode,
      }));
      setMealTypeData(formattedMealType);

      const formattedActivity = response[8].data.map((item) => ({
        ...item,
        value: item.id,
        label: item.title,
      }));
      setActivityData(formattedActivity);

      const formattedSiteSeeing = response[9].data.map((item) => ({
        ...item,
        value: item.id,
        label: item.title,
      }));
      setSiteSeeingData(formattedSiteSeeing);

      const formattedPolicy = response[10].data.content.map((item) => ({
        ...item,
        // value: item.id,
        // label: item.policyName,
        // description: item.policyDescription,
        optionData: false
      }));
      setPolicyList(formattedPolicy);

      // setAllCountry(response[11].data)
      // setAllState(response[12].data)
      // const format
    })
      .catch(error => console.error(error));
  }, [isOpen]);

  const [itinerariesList, setItinerayList] = useState([
    { value: 1, label: "Ranchi" },
    { value: 2, label: "Goa" },
    { value: 3, label: "Verkala" },
    { value: 4, label: "Shimla" },
    { value: 5, label: "Goa" },
  ]);

  // Handle the checkbox change
  const handleCheckboxChange = (e) => {
    setIsFixedDeparture(e.target.checked);
  };

  const handleSiteSeeingChange = (selectedOption, index) => {
    const updateVal = formItinaryData.map((item, i) =>
      index === i ? { ...item, siteSeeing: selectedOption } : item
    );
    setFormItinaryData(updateVal);
  };

  const handleHotelChange = (selectedOption, index, i) => {
    console.log(selectedOption)
    const updatedHotels = [...formItinaryData[index].hotel];
    updatedHotels[i].roomType = null;
    const result = roomTypeCompleteData.filter(
      (item) => item.hotel?.id === selectedOption.value
    );
    const formatRoomType = result.map((item) => ({
      value: item.id,
      label: item.bedSize,
    }));
    updatedHotels[i].hotelName = selectedOption;
    updatedHotels[i].roomTypeData = formatRoomType;

    const updateVal = formItinaryData.map((prev, list) =>
      index === list ? { ...prev, hotel: updatedHotels } : prev
    );
    setFormItinaryData(updateVal);
  };

  const handleRoomTypeChange = (selectedOption, index, i) => {
    const updatedHotels = [...formItinaryData[index].hotel];
    updatedHotels[i].roomType = selectedOption;

    const updateVal = formItinaryData.map((prev, list) =>
      index === list ? { ...prev, hotel: updatedHotels } : prev
    );
    setFormItinaryData(updateVal);
  };

  const handleMealTypeChange = (selectedOption, index, i) => {
    const updatedHotels = [...formItinaryData[index].hotel];
    updatedHotels[i].mealType = selectedOption;

    const updateVal = formItinaryData.map((prev, list) =>
      index === list ? { ...prev, hotel: updatedHotels } : prev
    );
    setFormItinaryData(updateVal);
  };

  const handleActivityChange = (selectedOption, i) => {
    const updateVal = formItinaryData.map((item, inde) =>
      inde === i ? { ...item, activities: selectedOption } : item
    );
    setFormItinaryData(updateVal);
  };

  const handlePolicyChange = (event, index) => {
    let name = policyList.map((item) =>
      item.id === index.id ? { ...item, policyName: event.target.value } : item
    );
    setPolicyList(name);
  };

  const handlePolicyDes = (item, data) => {
    let desc = policyList.map((prev) =>
      prev.id === item.id ? { ...prev, policyDescription: data } : prev
    );
    setPolicyList(desc);
  };

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

  const handleEditItineraryDay = () => {

  }

  const handleChangePackageTheme = (selectedOption) => {
    setSelectedPackageTheme(selectedOption);
  };

  const handleDestinationDepartureChange = (selectedOption) => {
    setSelectedDestinationDeparture(selectedOption);
  };

  const handleCategoryChange = (category) => {
    if (packageCategories.includes(category)) {
      setPackageCategories(
        packageCategories.filter((item) => item !== category)
      );
    } else {
      setPackageCategories([...packageCategories, category]);
    }
  };

  const handleSpecificationChange = (specification) => {
    setPackageSpecification(specification);
  };
  // setAddItineraryDay(addItineraryDay + 1)
  const handleItinearayReset = () => {
    setDays(0);
    setAddCityAndNight([]);
    setShowIti([]);
    setFormItinaryData([]);
  };
  const handleItinearayChange = (selectedOption, i) => {
    // console.log(i)
    // let h = selectedOption.hotelOptionIds
    // let hView = []
    // for (let i = 0; i < h.length; i++) {
    //   hView = hotelData.filter(item => item.id === h[i])
    // }

    if (selectedOption?.__isNew__) {
      const updateVal = formItinaryData.map((item, inde) =>
        inde === i ? {
          ...item,
          daytitle: selectedOption,
        } : item);
      setFormItinaryData(updateVal);
    } else {
      let act = []
      for (let i = 0; i < selectedOption?.activitiesIds?.length; i++) {
        act = [...act, ...activityData.filter(item => item.id === selectedOption.activitiesIds[i])]
      }

      let sight = []
      for (let i = 0; i < selectedOption?.sightseeingIds?.length; i++) {
        sight = [...sight, ...siteSeeingData.filter(item => item.id === selectedOption.sightseeingIds[i])]
      }
      const updateVal = formItinaryData.map((item, inde) =>
        inde === i ? {
          ...item,
          daytitle: { ...selectedOption, __isNew__: false },
          program: selectedOption.program,
          breakfast: selectedOption.meals.includes("Breakfast"),
          lunch: selectedOption.meals.includes("Lunch"),
          dinner: selectedOption.meals.includes("Dinner"),
          activities: act,
          siteSeeing: sight
        } : item
      );
      // console.log(updateVal)
      setFormItinaryData(updateVal);
    }
  };

  const handleSingleItiMealChange = (event, i) => {
    const { name, value } = event.target;

    if (name === "breakfast") {
      const updateVal = formItinaryData.map((item, index) =>
        index === i
          ? { ...item, breakfast: item.breakfast ? false : "on" }
          : item
      );
      setFormItinaryData(updateVal);
    } else if ("lunch" === name) {
      const updateVal = formItinaryData.map((item, index) =>
        index === i ? { ...item, lunch: item.lunch ? false : "on" } : item
      );
      setFormItinaryData(updateVal);
    } else {
      const updateVal = formItinaryData.map((item, index) =>
        index === i ? { ...item, dinner: item.dinner ? false : "on" } : item
      );
      setFormItinaryData(updateVal);
    }
  };

  const handleTransportChagne = (event, index) => {
    const updateVal = formItinaryData.map((item, i) =>
      index === i ? { ...item, transport: event } : item
    );
    setFormItinaryData(updateVal);
  };


  const handleHotelSelect = (selectedOption, inde, hotelVal) => {
    const updatedHotels = [...formItinaryData[inde].hotel];
    updatedHotels[hotelVal] = selectedOption;

    setFormItinaryData((prevData, i) =>
      inde === i ? { ...prevData, hotel: updatedHotels } : prevData
    );
  };

  // const [selectedEditCity, setSelectedEditCity] = useState([])



  // const setEditNightsChange = (e) => {
  //   setEditNights(e.target.value)
  //   if (e.target.value > formItinaryData.length) {
  //     setCheckNights(true)
  //   } else {
  //     setCheckNights(false)
  //   }
  // }

  const [formItinaryList, setFormItinaryList] = useState({ selectedHotelCity: null, nights: 0 })

  const handleEdit = (index) => {
    const selectedRow = addCityAndNight[index];
    setFormItinaryList(selectedRow);
    setEditIti(true)
    console.log(addCityAndNight)
    // setEditIndex(index);
  };

  const handleDelete = (data) => {
    const less = formItinaryData.filter(item => item.index > data)
    const gret = formItinaryData.filter(item => item.index < data)
    const actual = gret.map(item => ({ ...item, index: item.index - 1 }))

    let newdata = addCityAndNight.filter(item => item.index !== data)
    setAddCityAndNight(newdata.map(item => item.index < data ? item : ({ ...item, index: item.index - 1 })))

    setFormItinaryData([...less, ...actual])
  }



  const handleAddItineraryDay = () => {
    let d = displayIti.filter(item => item?.destination?.id === formItinaryList.selectedHotelCity.id)
    setDisplayItiDesti(d)
    console.log(d)
    let l = addCityAndNight.length;
    if (!editIti) {
      if (Number(formItinaryList.nights) > 0 && formItinaryList.selectedHotelCity !== null) {
        const addIti = {
          index: l,
          selectedHotelCity: formItinaryList.selectedHotelCity,
          hotelCity: formItinaryList.selectedHotelCity.label,
          nights: formItinaryList.nights,
          hotelCityId: formItinaryList.selectedHotelCity.id,
          fromStartDay: l === 0 ? 1 : addCityAndNight[l - 1].to,
          to:
            l === 0
              ? Number(formItinaryList.nights) + 1
              : addCityAndNight[l - 1].to + Number(formItinaryList.nights),
        };

        if (days === 0) {
          setDays((prev) => prev + Number(formItinaryList.nights) + 1);
          const hotel = hotelCompleteData.filter((item) =>
            item.destination.id === formItinaryList.selectedHotelCity.id);
          const hotelFormat = hotel.map((item) => ({
            ...item,
            value: item.id,
            label: item.hname,
          }));
          for (let i = 0; i < Number(formItinaryList.nights) + 1; i++) {
            const categorys = packageCategories.map((item) => ({
              category: item,
              hotelName: null,
              hotelData: hotelFormat,
              roomType: null,
              roomTypeData: [],
              mealType: null,
            }));
            formItinaryData.push({
              index: l,
              daynumber: 0,
              cityname: formItinaryList.selectedHotelCity.label,
              displayItiDesti: displayItiDesti,
              daytitle: null,
              program: "",
              breakfast: false,
              lunch: false,
              dinner: false,
              createdby: "",
              modifiedby: "",
              ipaddress: "",
              status: 1,
              isdelete: 0,
              transport: null,
              packid: {
                id: null,
              },
              siteSeeing: [],
              hotel: categorys,
              activities: [],
            });
          }
        } else {
          setDays((prev) => prev + Number(formItinaryList.nights));
          const hotel = hotelCompleteData.filter((item) =>
            item.destination.id === formItinaryList.selectedHotelCity.id);
          const hotelFormat = hotel.map((item) => ({
            ...item,
            value: item.id,
            label: item.hname,
          }));

          for (let i = 0; i < Number(formItinaryList.nights); i++) {
            const categorys = packageCategories.map((item) => ({
              category: item,
              hotelName: null,
              hotelData: hotelFormat,
              roomType: null,
              roomTypeData: [],
              mealType: null,
            }));
            formItinaryData.push({
              index: l,
              daynumber: 0,
              cityname: formItinaryList.selectedHotelCity.label,
              displayItiDesti: displayItiDesti,
              daytitle: null,
              program: "",
              breakfast: false,
              lunch: false,
              dinner: false,
              createdby: "",
              modifiedby: "",
              ipaddress: "",
              status: 1,
              isdelete: 0,
              transport: null,
              packid: {
                id: null,
              },
              siteSeeing: [],
              hotel: categorys,
              activities: [],
            });
          }
        }
        const iti = itinerariesList.filter(
          (it) => it.label === formItinaryList.selectedHotelCity.label
        );
        if (l !== 0) {
          setAddCityAndNight([...addCityAndNight, addIti]);
        } else {
          addCityAndNight.push(addIti);
        }
        setSelectedHotelCity(null);
        setNights(0);
        iti.forEach((i) => {
          showIti.push(i);
        });
        setFormItinaryList({ selectedHotelCity: null, nights: 0 })
      } else {
        if (formItinaryList.selectedHotelCity === null && Number(formItinaryList.nights) === 0)
          alert("Select City and Enter correct days");
        else if (Number(formItinaryList.nights) === 0) alert("Select Valid Days...");
        else alert("Select City...");
      }
    } else {
      console.log("edit", l)
      if (Number(formItinaryList.nights) > 0 && formItinaryList.selectedHotelCity !== null) {

        let lessVal = formItinaryData.filter(item => item.index < l)
        let greatVal = formItinaryData.filter(item => item.index > l)
        let diff = formItinaryData.filter(item => item.index === l)

        let addOne = 0;
        if (formItinaryList.nights > diff.length) {
          console.log("add")

          const hotel = hotelCompleteData.filter((item) =>
            item.destination.id === formItinaryList.selectedHotelCity.id);
          const hotelFormat = hotel.map((item) => ({
            ...item,
            value: item.id,
            label: item.hname,
          }));


          if (l === 0) {
            addOne = 1;
          }

          for (let i = 0; i < formItinaryList.nights - diff.length; i++) {
            const categorys = packageCategories.map((item) => ({
              category: item,
              hotelName: null,
              hotelData: hotelFormat,
              roomType: null,
              roomTypeData: [],
              mealType: null,
            }));
            diff.push({
              index: l,
              daynumber: 0,
              cityname: formItinaryList.selectedHotelCity.label,
              displayItiDesti: displayItiDesti,
              daytitle: null,
              program: "",
              breakfast: false,
              lunch: false,
              dinner: false,
              createdby: "",
              modifiedby: "",
              ipaddress: "",
              status: 1,
              isdelete: 0,
              transport: null,
              packid: {
                id: null,
              },
              siteSeeing: [],
              hotel: categorys,
              activities: [],
            });
          }
        } else {
          if (l === 0) {
            addOne = 1;
          }
          diff = diff.filter((_, i) => i < formItinaryList.nights + addOne)
        }

        setFormItinaryData([...lessVal, ...diff, ...greatVal])

        setFormItinaryList({ selectedHotelCity: null, nights: 0 })
        setEditIti(false)
      } else {
        if (formItinaryList.selectedHotelCity === null && Number(formItinaryList.nights) === 0)
          alert("Select City and Enter correct days");
        else if (Number(formItinaryList.nights) === 0) alert("Select Valid Days...");
        else alert("Select City...");
      }
    }

  };

  const handleItinearayProgramData = (data, i) => {
    const updateVal = formItinaryData.map((item, id) =>
      i === id ? { ...item, program: data } : item
    );
    setFormItinaryData(updateVal);
  };

  const [packagePrice, setPackagePrice] = useState({
    markup: 0,
    basic_cost: 0,
    gst: 0,
    total: 0,
  });

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setPackagePrice((prev) => ({ ...prev, [name]: value }));

    setPackagePrice((prev) => ({
      ...prev,
      total: Number(prev.basic_cost) + Number(prev.gst) + Number(prev.markup),
    }));
  };

  const handlePackagePriceSubmit = async (e) => {
    e.preventDefault();
    let pricePackge = {
      markup: packagePrice.markup,
      basiccost: packagePrice.basic_cost,
      gst: packagePrice.gst,
      totalcost: packagePrice.total,
      createdby: user.name,
      modifiedby: user.name,
      ipaddress: ipAddress,
      status: 1,
      isdelete: 0,
      packid: packageData.id,
    };

    await axios
      .post(`${api.baseUrl}/packageprice/create`, pricePackge, {
        headers: {
          // Authorization: `Bearer ${token}`,
          "Access-Control-Allow-Origin": "*",
        },
      })
      .then((response) => {
        toast.success("Package Price Saved...", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setPage(1)
        setEditorData("")
        setSelectedInclusions(null)
        setSelectedExclusions(null)
        setSelectedPackageTheme([])
        setPackageCategories([])
        setSelectedPackageTheme([])
        setSelectedEndCity(null)
        setSelectedStartCity(null)
        setFormData({
          pkName: "",
          fromCityId: null,
          toCityId: null,
          destinationCoveredId: "",
          description: "",
          pkCategory: "",
          pkSpecifications: "",
          days: 0,
          nights: 0,
          is_fixed_departure: true,
          fixed_departure_destinations: "",
          packageType: "",
          created_by: "",
          modified_by: "",
          ipaddress: "",
          status: 1,
          isdelete: 0,
          inclusionid: "",
          exclusionid: "",
          SupplierId: null,
          pkthem: "",
          image: null
        })
        onClose()
      })
      .catch((error) => console.error(error));
  };

  const handleItinearaySubmit = async (e) => {
    e.preventDefault();

    for (let i = 0; i < formItinaryData.length; i++) {
      let val = [...formItinaryData[i].hotel];
      let updateVal = val.filter((item) => item.hotelName !== null);
      for (let j = 0; j < updateVal.length; j++) {
        if (
          formItinaryData[i].cityname === "" ||
          formItinaryData[i].daytitle === null ||
          formItinaryData[i].transport === null ||
          formItinaryData[i].hotel[j].mealType === null
        ) {
          toast.error("Please fill all the fields...", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          return;
        }
      }
    }

    // console.log(formItinaryData);

    for (let i = 0; i < formItinaryData.length; i++) {
      const val = [...formItinaryData[i].hotel];
      const updateVal = val.filter((item) => item.hotelName !== null);

      // console.log(val);
      // console.log(updateVal);

      let siteSee = formItinaryData[i].siteSeeing.map((item) => item.value);
      let itiActivity = formItinaryData[i].activities.map(item => item.value,
      );

      var meald = "";
      if (formItinaryData[i].breakfast) {
        meald = meald + "Breakfast";
      }
      if (formItinaryData[i].lunch) {
        meald = meald + (formItinaryData[i].breakfast ? ", Lunch" : "Lunch");
      }
      if (formItinaryData[i].dinner) {
        meald = meald + (formItinaryData[i].breakfast ? ", Dinner" : "Dinner");
      }
      const payload = {
        daynumber: i + 1,
        cityname: formItinaryData[i].cityname,
        daytitle: formItinaryData[i].daytitle.label,
        program: formItinaryData[i].program,
        meals: meald,
        createdby: user.name,
        modifiedby: user.name,
        ipaddress: ipAddress,
        status: 1,
        isdelete: 0,
        transport: {
          id: formItinaryData[i].transport.value,
        },
        packid: packageData.id,
      };
      // console.log(payload)

      let res = {}
      await axios
        .post(`${api.baseUrl}/packageitinerary/create`, payload, {
          headers: {
            // 'Authorization': `Bearer ${token}`,
            "Access-Control-Allow-Origin": "*",
          },
        })
        .then((response) => {
          setPackageItinerayData(response.data);
          res = response.data
        })
        .catch((error) => console.error(error));

      for (let j = 0; j < updateVal.length; j++) {
        // let hotelIds = updateVal.map((item) => item.hotelName.value)

        let upd = formItinaryData.map((item, l) =>
          i === l ? { ...item, hotel: updateVal } : item
        );

        // let mel =
        setFormItinaryData(upd);
        let payloadItineararyDetails = {
          ipaddress: ipAddress,
          status: 1,
          isdelete: 0,
          createdby: user.name,
          modifiedby: user.name,
          category: formItinaryData[i].hotel[j].category,
          packitid: {
            id: res.id
          },
          activitiesIds: itiActivity,
          sightseeingIds: siteSee,
          roomtypes: {
            id: formItinaryData[i].hotel[j].roomType.value,
          },
          mealspackageIds: [formItinaryData[i].hotel[j].mealType.value],
        };
        // console.log(payloadItineararyDetails);

        await axios.post(`${api.baseUrl}/packageitinerarydetails/create`, payloadItineararyDetails,
          {
            headers: {
              // 'Authorization': `Bearer ${token}`,
              "Access-Control-Allow-Origin": "*",
            },
          }
        )
          .then((response) => {
            setPackageItinerayDetails(response.data);
          })
          .catch((error) => console.error(error));
      }
    }
    toast.success("Package Itinera Saved...", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    setPage(3)
  };

  const handlePackageType = () => {
    setSelectedStartCity(null)
    setSelectedEndCity(null)
  }

  const [destinationOptions, setDestinationOptions] = useState([])
  const handlePageChange = async (e) => {
    e.preventDefault();

    const destinationCoveredStr = isArray(selectedDestinations) ? selectedDestinations
      .map((option) => option.id)
      .join(",") : selectedDestinations !== null ? selectedDestinations.id : "";
    const selectedPackagesStr = selectedPackageTheme
      .map((option) => option.label)
      .join(",");
    const selectedInclusionsStr = selectedInclusions
      .map((option) => option.value)
      .join(",");
    const selectedExclusionsStr = selectedExclusions
      .map((option) => option.value)
      .join(",");
    const selectedDestinationDepartureStr = selectedDestinationDeparture
      .map((option) => option.label)
      .join(", ");
    const selectedPackageThemeStr = selectedPackageTheme
      .map((option) => option.value)
      .join(",");
    const packageCategoriesStr = packageCategories
      .map((option) => option)
      .join(", ");

    const formDataPackageMaster = new FormData();

    if (
      formData.pkName === "" ||
      selectedStartCity === null ||
      selectedEndCity === null ||
      selectedPackagesStr === "" ||
      packageSpecification === "" ||
      formData.days === 0 ||
      formData.nights === 0 ||
      packageCategoriesStr === "" ||
      formData.SupplierId === null ||
      pkImage === null
    ) {
      toast.error("Please fill all the fields...", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    formDataPackageMaster.append("pkName", formData.pkName);
    formDataPackageMaster.append("fromCityId", selectedStartCity.id);

    if (selectedPackageType === "international") {
      if (selectedEndCity.type === 'state') {
        formDataPackageMaster.append("s_id", selectedEndCity.id);
      } else {
        formDataPackageMaster.append("c_id", selectedEndCity.id);
      }
    } else {
      if (selectedEndCity.type === 'state') {
        formDataPackageMaster.append("s_id", selectedEndCity.id);
      } else {
        formDataPackageMaster.append("toCityId", selectedEndCity.id);
      }
    }

    formDataPackageMaster.append("destinationCoveredId", destinationCoveredStr);
    formDataPackageMaster.append("description", editorData);
    formDataPackageMaster.append("pkCategory", selectedPackagesStr);
    formDataPackageMaster.append("pkSpecifications", packageSpecification);
    formDataPackageMaster.append("days", formData.days);
    formDataPackageMaster.append("nights", formData.nights);
    formDataPackageMaster.append("is_fixed_departure", isFixedDeparture);
    formDataPackageMaster.append(
      "fixed_departure_destinations",
      isFixedDeparture ? selectedDestinationDepartureStr : " "
    );
    formDataPackageMaster.append("packageType", packageCategoriesStr);
    formDataPackageMaster.append("created_by", user.name);
    formDataPackageMaster.append("modified_by", user.name);
    formDataPackageMaster.append("ipaddress", ipAddress);
    formDataPackageMaster.append("status", formData.status);
    formDataPackageMaster.append("isdelete", 0);
    formDataPackageMaster.append("inclusionid", selectedInclusionsStr);
    formDataPackageMaster.append("exclusionid", selectedExclusionsStr);
    formDataPackageMaster.append("SupplierId", formData.SupplierId);
    formDataPackageMaster.append("pkthem", selectedPackageThemeStr);
    formDataPackageMaster.append("image", pkImage);

    // for (var pair of formDataPackageMaster.entries()) {
    //   console.log(pair[0] + ' = ' + pair[1]);
    // }

    // if (!packageData) {
    await axios.post(`${api.baseUrl}/packages/create`, formDataPackageMaster, {
      headers: {
        // 'Authorization': `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then((response) => {
        setPackageData(response.data)
        setPage(2);
        toast.success("Package Created Successfully!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        if (selectedPackageType === "international") {
          if (selectedEndCity.type === 'country') {
            setDestinationOptions(allDestinationList.filter(item => item.country.id === selectedEndCity.id))
          } else {
            setDestinationOptions(allDestinationList.filter(item => item.state.id === selectedEndCity.id))
          }
        } else {
          if (selectedEndCity.type !== 'state') {
            setDestinationOptions(allDestinationList.filter(item => item.id === selectedEndCity.id))
          } else {
            setDestinationOptions(allDestinationList.filter(item => item.state.id === selectedEndCity.id))
          }
        }
      })
      .catch((error) => console.error(error));
  };

  const handleStartCityChange = (selectedStartCity) => {
    setSelectedStartCity(selectedStartCity);
  };

  const handleEndCityChange = (selectedEndCity) => {
    setSelectedEndCity(selectedEndCity);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleInputDayChange = (e) => {
    const { name, value } = e.target;

    if (name === "days") {
      let n = false
      if (value === "" || value == 0) {
        n = true
      }
      setFormData({
        ...formData,
        days: value,
        nights: n ? 0 : value - 1,
      });
    } else if (name === "nights") {
      setFormData({
        ...formData,
        nights: value,
        days: Number(value) + 1,
      });
    }
  };

  const handleChange = (selectedOptions) => {
    setSelectedDestinations(selectedOptions);
    // console.log(selectedOptions);
  };

  const handleInclusionChange = (selectedOptions) => {
    setSelectedInclusions(selectedOptions);
    // console.log(selectedInclusions);
    for (let i = 0; i < selectedInclusions.length; i++) {
      if (selectedInclusions[i]?.__isNew__) {
        console.log(selectedInclusions[i]);
      }
    }
  };

  const handleExclusionChange = (selectedOptions) => {
    setSelectedExclusions(selectedOptions);
    // console.log(selectedExclusions);
    for (let i = 0; i < selectedExclusions.length; i++) {
      if (selectedExclusions[i]?.__isNew__) {
        console.log(selectedExclusions[i]);
      }
    }
  };

  const handlePolicySubmit = (e) => {
    e.preventDefault();

    for (let i = 0; i < policyList.length; i++) {
      // for (let i = 0; i < 0; i++) {
      const policyPayload = {
        policytitle: policyList[i].policyName,
        policydescription: policyList[i].policyDescription,
        createdby: user.name,
        modifiedby: user.name,
        ipaddress: ipAddress,
        status: 1,
        isdelete: 0,
        policy: {
          id: policyList[i].id
        },
        packitid: {
          id: packageData.id
        },
      };

      axios.post(`${api.baseUrl}/policydetails/create`, policyPayload, {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      })
        .then((response) => {

        })
        .catch((error) => console.error(error));
    }
    toast.success("Policies Created...", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    setPage(4);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };
  const [inputSearch, setInputSearch] = useState({ coveredDid: "", startDid: "", endDid: "", fixed_departure: "", supplier: "", packageTheme: "" })

  return (
    <div
      className={`fixed top-8 right-0 h-full bg-gray-200 shadow-lg transform transition-transform duration-500 ${isOpen ? "translate-x-0" : `translate-x-[1050px]`
        } mt-4 sm:top-18 md:top-18 lg:w-[950px] sm:w-full md:w-[700px] z-10`}
    >
      <button
        onClick={onClose}
        className="absolute top-[12px] lg:left-[-22px] font-semibold w-8 text-white text-sm bg-red-700 square px-3 py-1.5 border border-1 border-transparent hover:border-red-700 hover:bg-white hover:text-red-700 sm:right-4 md:right-4 xs:right-4"
      >
        X
      </button>
      <div className="flex justify-between items-center p-4 bg-white shadow-md top-12">
        <h2 className="text-lg font-bold text-black">New Package</h2>
      </div>
      <div className="border-b border-gray-300 shadow-sm"></div>

      <form
        className="p-4 overflow-y-auto h-[calc(100vh-160px)]"
        onSubmit={handleSubmit}
      >
        {page === 1 && (
          <>
            <div className="mb-4">
              <h3 className="bg-red-700 text-white p-2 rounded mb-6">
                Basic Package Details
              </h3>
            </div>
            <div className="flex gap-4 mb-6">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="readymadePackage"
                  name="packageOption"
                  value={true}
                  className="mr-2"
                  checked={true}
                />
                <label
                  htmlFor="readymadePackage"
                  className="text-sm font-medium"
                >
                  Readymade Package
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="fixedDeparture"
                  name="fixedDeparture"
                  className="mr-2"
                  checked={isFixedDeparture}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="fixedDeparture" className="text-sm font-medium">
                  Is Fixed Departure Package
                </label>
              </div>
            </div>

            <div className="flex gap-4 mb-6">
              <label className="text-sm font-medium">Package Type:</label>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="domestic"
                  name="packageType"
                  value="domestic"
                  className="mr-2"
                  checked={selectedPackageType === "domestic"} // Check if domestic is selected
                  onChange={() => { setSelectedPackageType("domestic"); handlePackageType() }} // Set state when clicked
                />
                <label htmlFor="domestic" className="text-sm font-medium">
                  Domestic
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="radio"
                  id="international"
                  name="packageType"
                  value="international"
                  className="mr-2"
                  checked={selectedPackageType === "international"} // Check if international is selected
                  onChange={() => {
                    setSelectedPackageType("international");
                    handlePackageType()
                  }} // Set state when clicked
                />
                <label htmlFor="international" className="text-sm font-medium">
                  International
                </label>
              </div>
            </div>
            <div className="flex gap-2 w-full h-16 mb-6">
              <div className="w-1/3 h-full">
                <label
                  htmlFor="destinations"
                  className="block text-sm font-medium"
                >
                  Enter Package Title
                </label>
                <input
                  type="text"
                  id="packageName"
                  name="pkName"
                  value={formData.pkName}
                  onChange={handleInputChange}
                  className="mt-1 h-[38px] p-2 w-full border border-1 border-[#e5e7eb] rounded"
                  placeholder="Enter Package Title..."
                />
              </div>
              <div className="w-1/3 h-full">
                <label
                  htmlFor="destinations"
                  className="block text-sm font-medium"
                >
                  Starting From
                </label>
                <Select
                  className="mt-1 w-full border rounded z-40"
                  value={selectedStartCity}
                  onChange={handleStartCityChange}
                  options={selectedPackageType === "international" ? internationalList : domesticList}
                  onInputChange={(value) => setInputSearch((prev) => ({ ...prev, startDid: value }))}
                  openMenuOnClick={false}
                  openMenuOnFocus={false}
                  isClearable
                  menuIsOpen={inputSearch.startDid !== "" && inputSearch.startDid.length >= 2} // Opens menu only when typing

                // components={{ Option: CustomOption }}
                // closeMenuOnSelect={true}
                // hideSelectedOptions={true}
                // isClearable={true}
                />
              </div>
              <div className="w-1/3 h-full">
                <label
                  htmlFor="destinations"
                  className="block text-sm font-medium"
                >
                  End City
                </label>
                <Select
                  className="mt-1 w-full border rounded z-40"
                  value={selectedEndCity}
                  onChange={handleEndCityChange}
                  // onChange={(option) => setSelectedOption(option)} // Handle selection

                  options={selectedPackageType === "international" ? internationalList : domesticList}
                  onInputChange={(value) => setInputSearch((prev) => ({
                    ...prev, endDid: value
                  }))}
                  openMenuOnClick={false}
                  openMenuOnFocus={false}
                  menuIsOpen={inputSearch.endDid !== "" && inputSearch.endDid.length >= 2} // Opens menu only when typing                // components={{ Option: CustomOption }}
                  // closeMenuOnSelect={true}
                  // hideSelectedOptions={true}
                  isClearable={true}
                />
              </div>
            </div>

            {/* Destination Covered and Supplier */}
            <div className="flex justify-between mb-6 w-full gap-2">
              <div className="w-1/2">
                <label
                  htmlFor="destinations"
                  className="block text-sm font-medium"
                >
                  Destination Covered
                </label>
                <Select
                  className="mt-1 w-full border rounded z-30"
                  // value={selectedDestinations}
                  onChange={handleChange}
                  // options={destination}
                  isMulti
                  components={{ Option: CustomOption }}
                  closeMenuOnSelect={false}
                  hideSelectedOptions={false}
                  isClearable={true}

                  options={selectedPackageType === "international" ? internationalList : domesticList}
                  onInputChange={(value) => setInputSearch((prev) => ({
                    ...prev, coveredDid: value
                  }))}
                  openMenuOnClick={false}
                  openMenuOnFocus={false}
                  menuIsOpen={inputSearch.coveredDid !== "" && inputSearch.coveredDid.length >= 2} // Opens menu only when

                />
              </div>
              <div className="w-1/2">
                <label htmlFor="supplier" className="block text-sm font-medium">
                  Supplier
                </label>
                <Select
                  className="mt-1 w-full border rounded z-30"
                  value={selectedSupplier}
                  onChange={(selectedSupplier) => {
                    SetSelectedSupplier(selectedSupplier);
                    formData.SupplierId = selectedSupplier.value;
                  }}
                  options={supplier}
                // isClearable

                // onInputChange={(value) => setInputSearch((prev) => ({
                //   ...prev, supplier: value
                // }))}
                // openMenuOnClick={false}
                // openMenuOnFocus={false}
                // menuIsOpen={inputSearch.supplier !== "" && inputSearch.supplier.length >= 2} // Opens menu only when
                />
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium">
                  Package Categories
                </label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {["Budget", "Standard", "Deluxe", "Luxury", "Premium"].map(
                    (category) => (
                      <label key={category} className="flex items-center">
                        <input
                          type="checkbox"
                          className="mr-2"
                          checked={packageCategories.includes(category)}
                          onChange={() => handleCategoryChange(category)}
                        />
                        {category}
                      </label>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Package Category, Images, Package Categories, and Package Specification */}
            <div className="flex justify-between mb-6 w-full gap-2">
              {/* Package Category */}
              <div className="w-1/2">
                <label
                  htmlFor="packageCategory"
                  className="block text-sm font-medium"
                >
                  Package Theme
                </label>
                <Select
                  className="mt-1 w-full border rounded z-20"
                  options={packageTheme}
                  value={selectedPackageTheme}
                  onChange={handleChangePackageTheme}
                  isMulti
                  components={{ Option: CustomOption }}
                  closeMenuOnSelect={false}
                  hideSelectedOptions={false}
                  isClearable={true}


                // onInputChange={(value) => setInputSearch((prev) => ({
                //   ...prev, packageTheme: value
                // }))}
                // openMenuOnClick={false}
                // openMenuOnFocus={false}
                // menuIsOpen={inputSearch.packageTheme !== "" && inputSearch.packageTheme.length >= 2} // Opens menu only when

                // value={packageTheme}
                />
              </div>
              <div className="w-full mb-6">
                <label className="block text-sm font-medium">
                  Package Specification
                </label>
                <div className="flex gap-4 mt-1">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="packageSpecification"
                      className="mr-2"
                      value="Daily Itinerary Based"
                      checked={packageSpecification === "Daily Itinerary Based"}
                      onChange={() =>
                        handleSpecificationChange("Daily Itinerary Based")
                      }
                    />
                    Daily Itinerary Based
                  </label>
                  {/* 
                    <label className="flex items-center">
                    <input
                    type="radio"
                    name="packageSpecification"
                     className="mr-2"
                    value="Only Hotel"
                    checked={packageSpecification === "Only Hotel"}
                    onChange={() => handleSpecificationChange("Only Hotel")}
                    />
                  Only Hotel
                  </label> 
                  */}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="w-1/2 mb-6">
                <label
                  htmlFor="destinations"
                  className="block text-sm font-medium"
                >
                  No of Days
                </label>
                <input
                  type="number"
                  id="packageName"
                  name="days"
                  value={formData.days}
                  min={0}
                  // onChange={(e) => setNights(e.target.value)}
                  onChange={handleInputDayChange}
                  className="mt-1 h-[38px] p-2 w-full border border-1 border-[#e5e7eb] rounded"
                  placeholder="No. of night..."
                />
                {/* <input type="text" className="" placeholder="No. of night..." /> */}
              </div>
              <div className="w-1/2 mb-6">
                <label
                  htmlFor="destinations"
                  className="block text-sm font-medium"
                >
                  No of Nights
                </label>
                <input
                  type="number"
                  id="packageName"
                  name="nights"
                  value={formData.nights}
                  min={0}
                  onChange={handleInputDayChange}
                  className="mt-1 h-[38px] p-2 w-full border border-1 border-[#e5e7eb] rounded"
                  placeholder="No. of night..."
                />
                {/* <input type="text" className="" placeholder="No. of night..." /> */}
              </div>
            </div>
            <div className="flex gap-2">
              <div className="w-1/2 mb-6">
                <label htmlFor="status" className="block text-sm font-medium">
                  Status
                </label>
                <select
                  id="status"
                  className="mt-1 p-2 w-full border rounded"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value={true}>Active</option>
                  <option value={false}>Inactive</option>
                </select>
              </div>

              <div className="w-1/2 mb-6">
                <label htmlFor="image" className="block text-sm font-medium">
                  Image
                </label>
                <input
                  type="file"
                  className="w-full text-gray-700 mt-1 p-[4.5px] bg-white rounded border border-gray-200"
                  name="image"
                  onChange={(e) => setPkImage(e.target.files[0])}
                // value={pkImage}
                />
              </div>
              {isFixedDeparture && (
                <div className="w-1/2">
                  <label
                    htmlFor="destinations"
                    className="block text-sm font-medium"
                  >
                    Destination Departure
                  </label>
                  <Select
                    className="mt-1 w-full border rounded z-30"
                    value={selectedDestinationDeparture}
                    onChange={handleDestinationDepartureChange}
                    onInputChange={(value) => setInputSearch((prev) => ({
                      ...prev, fixed_departure: value
                    }))}
                    options={destination}
                    isMulti
                    components={{ Option: CustomOption }}
                    closeMenuOnSelect={false}
                    hideSelectedOptions={false}
                    isClearable={true}
                    menuIsOpen={inputSearch.fixed_departure !== "" && inputSearch.fixed_departure.length >= 2} // Opens menu only when
                  />
                </div>
              )}
            </div>
            <div className="mb-6">
              <label
                htmlFor="description"
                className="block text-sm font-medium"
              >
                Program
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
                  setEditorData(data);
                }}
              />
            </div>
            <div className="mb-6">
              <h3 className="bg-red-700 text-white p-2 rounded">
                Inclusions/Exclusions
              </h3>
            </div>
            <div className="mb-4">
              <label
                htmlFor="destinations"
                className="block text-sm font-medium"
              >
                Whats included
              </label>
              {/* <Select
            className="mt-1 w-full border rounded"
            value={selectedInclusions}
            onChange={handleInclusionChange}
            options={inclusions}
            isMulti
            components={{ Option: CustomOption }}
            closeMenuOnSelect={false}
            hideSelectedOptions={false}
            isClearable={true}
          /> */}
              <CreatableSelect
                isMulti
                value={selectedInclusions}
                onChange={handleInclusionChange}
                options={inclusions}
                closeMenuOnSelect={false}
                hideSelectedOptions={false}
                components={{ Option: CustomOption }}
                isClearable={true}
                placeholder="Type or select options..."
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="destinations"
                className="block text-sm font-medium"
              >
                Whats Excluded
              </label>
              {/* <Select
            className="mt-1 w-full border rounded"
            value={selectedExclusions}
            onChange={handleExclusionChange}
            options={exclusions}
            isMulti
            components={{ Option: CustomOption }}
            closeMenuOnSelect={false}
            hideSelectedOptions={false}
            isClearable={true}
          /> */}
              <CreatableSelect
                isMulti
                className="mt-1 w-full border rounded"
                value={selectedExclusions}
                onChange={handleExclusionChange}
                options={exclusions}
                placeholder="Type or select options..."
                closeMenuOnSelect={false}
                components={{ Option: CustomOption }}
                hideSelectedOptions={false}
                isClearable={true}
              />
            </div>
          </>
        )}
        {page === 2 && (
          <>
            <div className="mb-4">
              <h3 className="bg-red-700 text-white p-2 rounded">Itinerary</h3>
            </div>
            <div className="flex mb-4 gap-2 justify-between">
              <table className="w-full bg-white border-2 border-collapse border-black">
                {addCityAndNight.length > 0 && <thead className="gap-4 ">
                  {/* <th>Itinerary City ID</th> */}
                  <th className=" border-2 border-black">Itinerary City</th>
                  <th className=" border-2 border-black">Nights</th>
                  <th className=" border-2 border-black">From</th>
                  <th className=" border-2 border-black">To</th>
                  <th className=" border-2 border-black">Action</th>
                </thead>}
                {addCityAndNight.length > 0 &&
                  addCityAndNight.map((item, i) => (
                    <tbody className="text-center  border-collapse border-1 border-black">
                      {/* <td>{i.hotelCityId}</td> */}
                      <td className=" border-2 border-black">{item.hotelCity}</td>
                      <td className=" border-2 border-black">{item.nights}</td>
                      <td className=" border-2 border-black">
                        Day {item.fromStartDay}
                      </td>
                      <td className=" border-2 border-black">Day {item.to}</td>
                      <td className=" border-2 border-black">
                        <div className="flex gap-2 justify-center">
                          <button className="text-blue-500 hover:text-blue-700" onClick={() => handleEdit(item.index)}>
                            <FaEdit />
                          </button>
                          <button className="text-red-500 hover:text-red-700" onClick={() => handleDelete(item.index)}>
                            <FaTrashAlt />
                          </button>
                        </div>
                      </td>
                    </tbody>
                  ))}
              </table>
            </div>
            {/* <div className="flex mb-4 gap-2 justify-evenly w-full">
              <div className="w-1/2">
                <label
                  className="block text-sm font-medium"
                >
                  Add Hotel City
                </label>
                <Select
                  className="mt-1 w-full border rounded "
                  value={selectedEditCity}
                  onChange={setSelectedEditCity}
                  // options={destination}
                  options={destinationOptions}
                />
              </div>
              <div className="w-1/3">
                <label
                  // htmlFor="destinations"
                  className="block text-sm font-medium"
                >
                  No of Nights
                </label>
                <input
                  type="number"
                  id="packageName"
                  name="noOFDays"
                  value={editNights}
                  min={0}
                  onChange={(e) => setEditNightsChange(e)}
                  className="mt-1 h-[38px] p-2 w-full border border-1 border-[#e5e7eb] rounded"
                  placeholder="No. of night..."
                />
              </div>
              <div className="w-1/4 flex items-end border border-1 min-h-full">
                <button
                  className={`bg-red-600 py-1 rounded-sm px-2 mb-1 text-white 
     border-[1px] 
    ${checkNights ? 'bg-gray-400 text-gray-700 cursor-not-allowed hover:bg-gray-400 hover:text-gray-700' : 'hover:bg-white hover:text-red-600 hover:border-red-600'}`}
                  onClick={handleEditItineraryDay}
                  disabled={checkNights}
                >
                  Edit
                </button>

              </div>
            </div> */}


            <div className="flex mb-4 gap-2 justify-evenly w-full">
              <div className="w-1/2">
                <label
                  htmlFor="destinations"
                  className="block text-sm font-medium"
                >
                  Add Hotel City
                </label>
                <Select
                  className="mt-1 w-full border rounded "
                  value={formItinaryList.selectedHotelCity}
                  onChange={(e) => setFormItinaryList((prev) => ({
                    ...prev,
                    selectedHotelCity: e
                  }))}
                  options={destinationOptions}
                />
                {/* <input type="text" className="w-full p-2 " placeholder="Enter Hotel Stay..." /> */}
              </div>
              <div className="w-1/3">
                <label
                  htmlFor="destinations"
                  className="block text-sm font-medium"
                >
                  No of Nights
                </label>
                <input
                  type="number"
                  id="packageName"
                  value={formItinaryList.nights}
                  min={0}
                  // onChange = {handleNightChange}
                  onChange={(e) => setFormItinaryList((prev) => ({
                    ...prev,
                    nights: Number(e.target.value)
                  }))}
                  className="mt-1 h-[38px] p-2 w-full border border-1 border-[#e5e7eb] rounded"
                  placeholder="No. of night..."
                />
              </div>
              <div className="w-1/4 flex items-end border border-1 min-h-full">
                <button
                  className={`bg-red-600 py-1 rounded-sm px-2 mb-1 text-white 
     border-[1px] 
    ${Number(packageData?.nights) + formItinaryData.length < formItinaryList.nights ? 'bg-gray-400 text-gray-700 cursor-not-allowed hover:bg-gray-400 hover:text-gray-700' : 'hover:bg-white hover:text-red-600 hover:border-red-600'}`}
                  // ${Number(nights) + formItinaryData.length - 1 > packageData.nights ? 'bg-gray-400 text-gray-700 cursor-not-allowed hover:bg-gray-400 hover:text-gray-700' : 'hover:bg-white hover:text-red-600 hover:border-red-600'}`}
                  onClick={handleAddItineraryDay}
                  // disabled={Number(nights) + formItinaryData.length - 1 > packageData.nights}
                  disabled={Number(packageData?.nights) + formItinaryData.length < formItinaryList.nights}
                >
                  {editIti ? 'Edit' : 'Add'}
                </button>

              </div>
            </div>
            {/* {Number(nights) + formItinaryData.length - 1 > packageData.nights && */}
            {Number(packageData?.nights) + formItinaryData.length < formItinaryList.nights &&
              <div className="flex justify-center">
                <p className="text-red-600">You can't add more than {packageData?.nights} nights</p>
              </div>
            }
            <div className="mb-6 gap-2">
              <label
                htmlFor="destinations"
                className="block text-sm font-medium"
              >
                Itineraries
              </label>

              {Array(formItinaryData) &&
                formItinaryData.map((singleItinerary, index) => (
                  <div className="flex flex-col items-center truncate w-full mt-2">
                    {/* <label className="h-full bg-gray-700 p-1 border-b-2 text-white px-2 rounded-sm">
                  Day: {index + 1} </label>
                <Select
                  className="w-full border rounded"
                  value={selectedItineraries}
                  onChange={(selectedOption) => handleItineraryChange(selectedOption, index)}
                  options={destinations}
                /> */}

                    <div
                      className="flex w-full justify-between bg-red-700 text-white p-2 rounded mb-2 cursor-pointer"
                      onClick={() => toggleAccordion(index)}
                    >
                      <h3 className="">
                        Day {index + 1} - {singleItinerary.cityname}
                      </h3>
                      <button>{openItems[index] ? "-" : "+"} </button>
                    </div>
                    <div
                      className={`accordion-content overflow-x-hidden w-full transition-[max-height] duration-1500 ease-in-out ${openItems[index] ? "max-h-fit" : "max-h-0"
                        }`}
                    >
                      {/* <div className="w-full"> */}

                      <div className="shadow-md p-4 bg-white rounded-lg w-full">
                        <div className="mb-4">
                          <label
                            htmlFor={`transportationDetails-${index}`}
                            className="block text-sm font-medium bg-gray-600 text-white p-2 rounded rounded-b-none"
                          >
                            Basic Itineray Details
                          </label>
                          <div className="border rounded rounded-t-none p-4 bg-gray-200">
                            <div className="mb-4 p-2 border-2">
                              <label
                                htmlFor={`title-${index}`}
                                className="block text-sm font-medium"
                              >
                                Title
                              </label>
                              {/* <input
                              type="text"
                              id={`title-${index}`}
                              className="mt-1 p-2 w-full border rounded bg-white"
                              name="title"
                              placeholder="Enter Title" */}
                              {/* // value={formData.days[index].title}
                            // onChange={(e) => handleInputChange(e, index)} */}
                              {/* /> */}
                              <CreatableSelect
                                options={Array.isArray(singleItinerary.displayItiDesti) ? singleItinerary.displayItiDesti : []}
                                onChange={(e) =>
                                  handleItinearayChange(e, index)
                                }
                                value={singleItinerary.daytitle}
                                placeholder="Select or Create Itinerary"
                              />
                            </div>

                            <div className="mb-4 p-2">
                              <label
                                htmlFor="description"
                                className="block text-sm font-medium"
                              >
                                Program
                              </label>
                              <CKEditor
                                className=""
                                editor={ClassicEditor}
                                // data={editorData}
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
                                data={singleItinerary.program}
                                onChange={(event, editor) => {
                                  const data = editor.getData();
                                  handleItinearayProgramData(data, index);
                                }}
                              />
                            </div>

                            <div className="mb-4 p-2 flex justify-between gap-4 bg-white ">
                              <h3 className="block text-sm font-medium mb-2">
                                Meals
                              </h3>
                              <div className="flex justify-between gap-2 mb-4 w-full">
                                <div className="w-1/3 flex items-center">
                                  <label className="flex items-center">
                                    <input
                                      type="checkbox"
                                      name="breakfast"
                                      checked={singleItinerary.breakfast}
                                      onChange={(e) =>
                                        handleSingleItiMealChange(e, index)
                                      }
                                      className="mr-2"
                                    />
                                    Breakfast
                                  </label>
                                </div>
                                <div className="w-1/3 flex items-center">
                                  <label className="flex items-center">
                                    <input
                                      type="checkbox"
                                      name="lunch"
                                      checked={singleItinerary.lunch}
                                      onChange={(e) =>
                                        handleSingleItiMealChange(e, index)
                                      }
                                      className="mr-2"
                                    />
                                    Lunch
                                  </label>
                                </div>
                                <div className="w-1/3 flex items-center">
                                  <label className="flex items-center">
                                    <input
                                      type="checkbox"
                                      name="dinner"
                                      checked={singleItinerary.dinner}
                                      onChange={(e) =>
                                        handleSingleItiMealChange(e, index)
                                      }
                                      className="mr-2"
                                    />
                                    Dinner
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div key={index} className="">
                          <div className="mb-4">
                            <h3 className="bg-gray-600 text-white p-2 rounded rounded-b-none">
                              Select Hotel
                            </h3>
                            <table className="min-w-full bg-white mb-4 border rounded rounded-t-none">
                              <thead>
                                <tr className="bg-gray-100">
                                  {singleItinerary.hotel.map((item) => (
                                    <th className="py-2 px-4 border-r">
                                      {item.category}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody className="bg-gray-50 rounded-lg">
                                <tr>
                                  {singleItinerary.hotel.map((item, i) => (
                                    <td className="py-2 px-4 border-r">
                                      <div className="mb-2">
                                        <label className="block text-sm font-medium">
                                          Hotel Name
                                        </label>
                                        {/* <input
                                      type="text"
                                      placeholder="Type"
                                      className="mt-1 border w-full h-[36px] rounded p-2 border-gray-300"
                                    /> */}

                                        <Select
                                          options={item.hotelData}
                                          placeholder="Select hotel"
                                          onChange={(e) =>
                                            handleHotelChange(e, index, i)
                                          }
                                          value={item.hotelName}
                                        />
                                      </div>
                                      <div className="mb-2">
                                        <label className="block text-sm font-medium">
                                          Room Type
                                        </label>
                                        <Select
                                          options={item.roomTypeData}
                                          placeholder="Room Type"
                                          className="mt-1"
                                          onChange={(e) =>
                                            handleRoomTypeChange(e, index, i)
                                          }
                                          value={item.roomType}
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-sm font-medium">
                                          Meal Type
                                        </label>
                                        <Select
                                          options={mealTypeData}
                                          placeholder="Meals"
                                          className="mt-1"
                                          onChange={(e) =>
                                            handleMealTypeChange(e, index, i)
                                          }
                                          value={item.mealType}
                                        />
                                      </div>
                                    </td>
                                  ))}
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className="mb-4">
                            <label
                              htmlFor={`activities-${index}`}
                              className="block text-sm font-medium bg-gray-600 text-white p-2 rounded rounded-b-none"
                            >
                              Select Activities
                            </label>
                            <div className="border rounded rounded-t-none p-4 bg-gray-200">
                              <label
                                className="block text-sm font-medium mb-1"
                                htmlFor={`activities-${index}`}
                              >
                                Activities
                              </label>
                              <Select
                                options={activityData}
                                onChange={(e) => handleActivityChange(e, index)}
                                value={singleItinerary.activities}
                                isMulti
                                components={{ Option: CustomOption }}
                                closeMenuOnSelect={false}
                                hideSelectedOptions={false}
                                isClearable={true}
                              />
                            </div>
                          </div>
                          <div className="mb-4">
                            <label
                              htmlFor={`activities-${index}`}
                              className="block text-sm font-medium bg-gray-600 text-white p-2 rounded rounded-b-none"
                            >
                              Sightseeing
                            </label>
                            <div className="border rounded rounded-t-none p-4 bg-gray-200">
                              <label
                                className="block text-sm font-medium mb-1"
                                htmlFor={`activities-${index}`}
                              >
                                sightView
                              </label>
                              <div className="relativ">
                                <Select
                                  options={siteSeeingData}
                                  onChange={(e) =>
                                    handleSiteSeeingChange(e, index)
                                  }
                                  value={singleItinerary.siteSeeing}
                                  isMulti
                                  components={{ Option: CustomOption }}
                                  closeMenuOnSelect={false}
                                  hideSelectedOptions={false}
                                  isClearable={true}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="mb-4">
                            <label
                              htmlFor={`transportationDetails-${index}`}
                              className="block text-sm font-medium bg-gray-600 text-white p-2 rounded rounded-b-none"
                            >
                              Transportation Types
                            </label>
                            <div className="border rounded rounded-t-none p-4 bg-gray-200">
                              <label
                                className="block text-sm font-medium mb-1"
                                htmlFor={`transportation-${index}`}
                              >
                                Transportation
                              </label>
                              <Select
                                options={listTransport}
                                onChange={(e) =>
                                  handleTransportChagne(e, index)
                                }
                                value={singleItinerary.transport}
                              />
                              {/* <input
                              type="text"
                              id={`transportationDetails-${index}`}
                              className="mt-1 p-2 w-full border rounded "
                              name="transportationDetails"
                              placeholder="Enter a Transportation..."
                            /> */}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  // </div>
                ))}
              {/* {days !== 0 &&
              <div className="flex justify-center items-center mt-4">
                <button className="bg-blue-200 p-2 border rounded-sm border-b-2"
                  onClick={() => setShowItiForm(true)}>Create Desired Itinerary</button>
              </div>} */}
            </div>
            {showItiForm && (
              // <div className="bg-white border-2 rounded-md">
              <div
                className="submenu-menu"
                style={{ right: showItiForm ? "0" : "-100%" }}
              >
                <PackageItinerary
                  isOpen={showItiForm}
                  onClose={() => setShowItiForm(false)}
                />
              </div>
              // </div>
            )}
          </>
        )}
        {page === 3 && (
          <>
            <div className="mb-4 w-full">
              <h3 className="bg-red-700 text-white p-2 rounded">
                Package Policy
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {policyList.map((item, index) => (
                <div className="bg-white p-4 rounded">
                  <input
                    type="text"
                    id="policyName"
                    name="policyName"
                    value={item.policyName}
                    onChange={(e) => handlePolicyChange(e, item)}
                    className="mt-1 h-[38px] p-2 w-full boreder-2 border-gray-500 bg-gray-50 rounded"
                    placeholder="Enter Package Title..."
                  />
                  <input
                    type="checkbox"
                    value={item.optionData}
                  />
                  <CKEditor
                    className=""
                    name="policyDescription"
                    editor={ClassicEditor}
                    // data={editorData}
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
                    data={item.policyDescription}
                    onChange={(event, editor) => {
                      const data = editor.getData();
                      handlePolicyDes(item, data);
                    }}
                  />
                </div>
              ))}
            </div>
          </>
        )}
        {page === 4 && (
          <>
            {/* <div className="flex justify-between mb-4 w-full gap-2">
              <div className="w-1/2">
                <label
                  htmlFor="destinations"
                  className="block text-sm font-medium"
                >
                  No of Days
                </label>
                <input
                  type="number"
                  id="noOfDays"
                  name="noOfDays"
                  value={formData.noOfDays}
                  onChange={handleInputChange}
                  className="mt-1 p-2 w-full border rounded"
                  placeholder="No of Days"
                />
              </div>
              <div className="w-1/2">
                <label
                  htmlFor="destinations"
                  className="block text-sm font-medium"
                >
                  No of Nights
                </label>
                <input
                  type="number"
                  id="noOfNights"
                  name="noOfNights"
                  value={formData.noOfNights}
                  onChange={handleInputChange}
                  className="mt-1 p-2 w-full border rounded"
                  placeholder="No of Nights"
                />
              </div>
            </div> */}
            <div className="mb-4">
              <h3 className="bg-red-700 text-white p-2 rounded">
                Package Price
              </h3>
            </div>
            <div className="flex justify-between gap-2 mb-4">
              <div className="w-1/3">
                <label
                  htmlFor="destinations"
                  className="block text-sm font-medium"
                >
                  Mark Up
                </label>
                <input
                  type="number"
                  id="noOfNights"
                  name="markup"
                  min={0}
                  value={packagePrice.markup}
                  onChange={handlePriceChange}
                  className="mt-1 p-2 w-full border rounded"
                  placeholder="Mark Up"
                />
              </div>
              <div className="w-1/3">
                <label
                  htmlFor="destinations"
                  className="block text-sm font-medium"
                >
                  Basic Cost
                </label>
                <input
                  type="number"
                  id="noOfNights"
                  name="basic_cost"
                  min={0}
                  value={packagePrice.basic_cost}
                  onChange={handlePriceChange}
                  // value={formData.noOfNights}
                  // onChange={handleInputChange}
                  className="mt-1 p-2 w-full border rounded"
                  placeholder="Basic Cost"
                />
              </div>
              <div className="w-1/3">
                <label
                  htmlFor="destinations"
                  className="block text-sm font-medium"
                >
                  GST
                </label>
                <input
                  type="number"
                  min={0}
                  id="noOfNights"
                  name="gst"
                  value={packagePrice.gst}
                  onChange={handlePriceChange}
                  // value={formData.noOfNights}
                  // onChange={handleInputChange}
                  className="mt-1 p-2 w-full border rounded"
                  placeholder="GST"
                />
              </div>
            </div>
            <div className="flex justify-between mb-4 w-full gap-2">
              <div className="truncate flex gap-4  items-center">
                <label
                  htmlFor="destinations"
                  className="block text-lg  font-bold"
                >
                  Total Cost:
                </label>
                <span
                  type="number"
                  id="noOfDays"
                  name="noOfDays"
                  // value={packagePrice.total}
                  className="mt-1 p-2 w-full border rounded"
                  placeholder="Total Cost"
                >
                  {packagePrice.total}
                </span>
              </div>
            </div>
          </>
        )}
        <div className="flex items-center p-3 bg-white shadow-lg rounded w-full fixed bottom-12 left-0 right-0">
          {page === 1 && (
            <>
              <button
                type="submit"
                className="bg-gray-700 text-white px-4 py-2 rounded shadow mr-1"
                disabled
              >
                Back
              </button>
              <button
                type="button"
                className="bg-red-700 text-white px-4 py-2 rounded shadow"
                onClick={handlePageChange}
              >
                Save & Continue
              </button>
            </>
          )}
          {page === 2 && (
            <>
              <button
                type="submit"
                className="bg-red-700 text-white px-4 py-2 rounded shadow mr-1"
                onClick={() => {
                  setPage(1); setFormItinaryData([]);
                  setAddCityAndNight([])
                  setFormItinaryData([])
                }}
              >
                Back
              </button>
              <button
                type="button"
                className="bg-red-700 text-white px-4 py-2 mr-1 rounded shadow"
                onClick={handleItinearaySubmit}
              >
                Save & Continue
              </button>
              <button
                type="button"
                className="bg-red-700 text-white px-4 py-2 rounded shadow"
                onClick={handleItinearayReset}
              >
                Reset
              </button>
            </>
          )}
          {page === 3 && (
            <>
              <button
                type="submit"
                className="bg-red-700 text-white px-4 py-2 rounded shadow mr-1"
                onClick={() => setPage(2)}
              >
                Back
              </button>
              <button
                type="submit"
                className="bg-red-700 text-white px-4 py-2 rounded shadow mr-1"
                onClick={handlePolicySubmit}
              >
                Save & Continue
              </button>
              <button
                type="button"
                className="bg-red-700 text-white px-4 py-2 rounded shadow"
              >
                Reset
              </button>
            </>
          )}
          {page === 4 && (
            <>
              <button
                type="submit"
                className="bg-red-700 text-white px-4 py-2 rounded shadow mr-1"
                onClick={() => setPage(3)}
              >
                Back
              </button>
              <button
                type="submit"
                className="bg-red-700 text-white px-4 py-2 rounded shadow mr-1"
                onClick={handlePackagePriceSubmit}
              >
                Submit
              </button>
              <button
                type="button"
                className="bg-red-700 text-white px-4 py-2 rounded shadow"
              >
                Reset
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default NewPackageForm;
