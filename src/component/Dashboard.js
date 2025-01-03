import React, { useContext, useEffect, useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  PointElement,
  ArcElement,
} from "chart.js";
import BodyHeader from "./BodyHeader";
import axios from "axios";
import api from "../apiConfig/config";
import { UserContext } from "../contexts/userContext";
// import Table from '../pages/TableComponent';

// Register necessary Chart.js components
ChartJS.register(
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  PointElement,
  ArcElement
);

const Dashboard = () => {
  // Sample data for the charts

  const [dashboardData, setDashboardData] = useState(null);
  const { user } = useContext(UserContext);

  const topDestinationsData = {
    labels: [
      "Bali",
      "Maldives",
      "Paris",
      "New York",
      "Tokyo",
      "London",
      "Sydney",
      "Rome",
      "Barcelona",
      "Dubai",
    ],
    datasets: [
      {
        label: "Top 10 Destinations",
        data: [50, 40, 30, 20, 10, 25, 35, 15, 20, 5],
        backgroundColor: [
          "#5F67F8",
          "#F8DF5F",
          "#FA9851",
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#FF9F40",
          "#4BC0C0",
          "#9966FF",
          "#FF6384",
        ],
      },
    ],
  };

  const topPackagesData = {
    labels: ["Package 1", "Package 2", "Package 3", "Package 4", "Package 5"],
    datasets: [
      {
        label: "Top 5 Packages",
        data: [80, 70, 60, 90, 85],
        borderColor: "#F8DF5F",
        backgroundColor: [
          "#5F67F8",
          "#FA9851",
          "#36A2EB",
          "#FFCE56",
          "#FF9F40",
        ],
        fill: true,
      },
    ],
  };

  const topPackagesOptions = {
    indexAxis: "y", // Horizontal bar chart
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Top 5 Packages",
      },
    },
  };

  const weeklySalesData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"],
    datasets: [
      {
        label: "Weekly Sales",
        data: [300, 400, 350, 450, 500], // Replace with actual data
        borderColor: "#FA9851",
        backgroundColor: "rgba(250, 152, 81, 0.3)",
        fill: true,
      },
    ],
  };

  const leadsSourceData = {
    labels: ["Facebook", "Email", "Referral", "Instagram", "Telephone"],
    datasets: [
      {
        label: "Leads Source",
        data: [30, 70, 45, 80, 50],
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#FF9F40",
          "#4BC0C0",
        ],
      },
    ],
  };

  // State to manage dropdown visibility
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("All Time");

  // Toggle dropdown visibility
  const togglePeriodDropdown = () => setShowPeriodDropdown(!showPeriodDropdown);

  // Handle selecting a period
  const handlePeriodSelect = (period) => {
    setSelectedPeriod(period);
    togglePeriodDropdown(); // Close dropdown after selection
  };

  const columns = [
    { header: "QUERY", accessor: "query" },
    { header: "DATE", accessor: "date" },
    { header: "FLIGHT PICK UP TIME", accessor: "flightPickUpTime" },
    { header: "RETURN TIME", accessor: "returnTime" },
    { header: "TOUR", accessor: "tour" },
    { header: "GUEST", accessor: "guest" },
    { header: "PAX", accessor: "pax" },
    { header: "HOTEL TYPE", accessor: "hotelType" },
    { header: "DRIVER GUIDE", accessor: "driverGuide" },
  ];

  const data = [
    {
      query: "#MTS000039",
      date: "14-07-2024",
      flightPickUpTime: "IG-9231",
      returnTime: "14:00Hrs.",
      tour: "Dubai Airport to Hotel Radisson Blue",
      guest: "Alex",
      pax: "A-2",
      hotelType: "PVT",
      driverGuide: "Radisson"
    },
  ];

  // dashboard/active/count

  //   {
  //     "totalQueryBook": 0,
  //     "activeQueryBook": 0,
  //     "totalUser": 1,
  //     "activeUser": 1,
  //     "totalCustomer": 0,
  //     "activeCustomer": 0,
  //     "totalBookings": 0,
  //     "activeBookings": 0
  // }

  useEffect(() => {
    axios.get(`${api.baseUrl}/dashboard?userId=${user.userId}`)
      .then((response) => {
        setDashboardData(response.data);
      }).catch((e) => {
        console.log(e);
      });
  }, [])

  // console.log(dashboardData);

  return (
    <div className="w-full mt-0">
      <BodyHeader />
      <div className="bg-gray-200 m-0 py-4 h-full">
        <div className="dashboard ml-4 mr-4">
          {/* Period Dropdown */}
          <div className="dashboard-periods relative mb-8" style={{ zIndex: "1" }}>
            <button
              onClick={togglePeriodDropdown}
              className="px-4 py-2 bg-blue-500 text-white rounded-md">
              {selectedPeriod}
            </button>

            {/* Period Dropdown Content */}
            {showPeriodDropdown && (
              <div className="absolute mt-2 bg-white shadow-lg rounded-lg w-48 ">
                <div className="p-2">
                  <button
                    onClick={() => handlePeriodSelect("All Time")}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    All Time
                  </button>
                  <button
                    onClick={() => handlePeriodSelect("New York")}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    New York
                  </button>
                  <button
                    onClick={() => handlePeriodSelect("Paris")}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Paris
                  </button>
                  <button
                    onClick={() => handlePeriodSelect("Tokyo")}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Tokyo
                  </button>
                  <button
                    onClick={() => handlePeriodSelect("London")}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    London
                  </button>
                  <button
                    onClick={() => handlePeriodSelect("Sydney")}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Sydney
                  </button>
                </div>
              </div>
            )}
          </div>
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-pink-100 border-l-4 border-pink-500 p-4 rounded-md">
              <p className="text-gray-600 font-bold">Total Queries</p>
              <p className="text-lg">{dashboardData && dashboardData.activeQuery.toString()} {"/"} {dashboardData && dashboardData.totalQuery.toString()}</p>
            </div>
            <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded-md">
              <p className="text-gray-600 font-bold">Total Bookings</p>
              <p className="text-lg">{dashboardData && dashboardData.activeBookings.toString()} {"/"} {dashboardData && dashboardData.totalBookings.toString()}</p>
            </div>
            <div className="bg-pink-100 border-l-4 border-pink-500 p-4 rounded-md">
              <p className="text-gray-600 font-bold">Total Leads</p>
              <p className="text-lg">{dashboardData && dashboardData.totalLeads.toString()} {"/"} {dashboardData && dashboardData.totalLeads.toString()}</p>
            </div>
            <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded-md">
              <p className="text-gray-600 font-bold">Total Customers</p>
              <p className="text-lg">{dashboardData && dashboardData.activeCustomers.toString()} {"/"} {dashboardData && dashboardData.totalCustomers.toString()}</p>
            </div>
          </div>
          {/* Graph Entries */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="grid-cols-4 bg-white p-4 rounded-lg shadow-md w-full">
              <h3 className="font-bold text-xl text-center">
                Top 10 Destinations
              </h3>
              <Bar data={topDestinationsData} />
            </div>

            <div className="grid-cols-4 bg-white p-4 rounded-lg shadow-md w-full">
              <h3 className="font-bold text-xl text-center">Top 5 Packages</h3>
              <Bar data={topPackagesData} options={topPackagesOptions} />
            </div>

            <div className="grid-cols-4 bg-white p-4 rounded-lg shadow-md w-full">
              <h3 className="font-bold text-xl text-center">Weekly Sales</h3>
              <Line data={weeklySalesData} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-8 w-full mt-8">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="font-bold text-xl text-center">Leads Source</h3>
              <Bar data={leadsSourceData} />
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md" >
              <h2 className="text-lg font-bold mb-4">Scheduled Payments</h2>
              <div className="space-y-4">
                {/* Scheduled Payment Entries */}
                <div className="flex justify-between bg-red-500 p-2 rounded-md">
                  <div className="flex flex-col">
                    <span>Nitin</span>
                    <button className="bg-green-500 text-white px-2 py-1 rounded-md mt-1">
                      Active
                    </button>
                  </div>
                  <span>15-07-2024</span>
                  <span>24,870.83 INR</span>
                  <span>#MTS000051</span>
                </div>

                <div className="flex justify-between bg-red-500 p-2 rounded-md">
                  <div className="flex flex-col">
                    <span>Priya</span>
                    <button className="bg-green-500 text-white px-2 py-1 rounded-md mt-1">
                      Active
                    </button>
                  </div>
                  <span>16-07-2024</span>
                  <span>15,000.00 INR</span>
                  <span>#MTS000052</span>
                </div>

                <div className="flex justify-between bg-red-500 p-2 rounded-md">
                  <div className="flex flex-col">
                    <span>Rahul</span>
                    <button className="bg-green-500 text-white px-2 py-1 rounded-md mt-1">
                      Active
                    </button>
                  </div>
                  <span>17-07-2024</span>
                  <span>10,500.50 INR</span>
                  <span>#MTS000053</span>
                </div>

                <div className="flex justify-between bg-red-500 p-2 rounded-md">
                  <div className="flex flex-col">
                    <span>Amit</span>
                    <button className="bg-green-500 text-white px-2 py-1 rounded-md mt-1">
                      Active
                    </button>
                  </div>
                  <span>18-07-2024</span>
                  <span>5,000.00 INR</span>
                  <span>#MTS000054</span>
                </div>
              </div>
            </div>
          </div>
          <div className="table-container mt-8 mb-20 overflow-x-auto">
            <h3
              className="text-white font-bold text-2xl mb-4 text-center py-2"
              style={{ backgroundColor: "#6c757d" }}
            >
              Tour Master Sheet
            </h3>
            {/* <div className='w-full overflow-auto'>
              <Table
                columns={columns}
                data={data}
              />
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
