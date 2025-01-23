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
import TableComponent from "../pages/TableComponent";
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

  const [dashboardData, setDashboardData] = useState({
    activeBookings: 0,
    totalBookings: 0,
    activeQuery: 0,
    totalQuery: 0,
    LinkedIn: 0,
    Facebook: 0,
    Website: 0,
    totalLeads: 0,
    activeCustomers: 0,
    totalCustomers: 0,
  });
  const [graphsData, setGraphsData] = useState({
    topFivePackages: {},
    topTenDestinations: {},
    leadSources: {},
  });


  const { user } = useContext(UserContext);

  const topPackagesOptions = {
    indexAxis: "y",
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
    { header: "", accessor: "" },
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

  const col = [
    { header: "TeamMember", accessor: "teamMember" },
    { header: "Domestic", accessor: "domestic" },
    { header: "International", accessor: "international" }
  ]

  const userResport = {
    "Ritik": {
      "domestic": {
        "Goa": 21,
        "Sikkim": 19,
        "Himachal Pradesh": 15,
        "Kerala": 15,
        "Andaman": 14
      },
      "international": {
        "UAE": 1,
        "Maldives": 1,
        "Thailand": 1,
        "Switzerland": 1,
        "Singapore": 1
      }
    },
    "Ujwal": {
      "domestic": {
        "Andaman": 23,
        "Kerala": 17,
        "Goa": 17,
        "Himachal Pradesh": 15,
        "Andaman": 5
      },
      "international": {
        "Malaysia": 1,
        "Vietnam": 1,
        "Bahrain": 1,
        "Jamaica": 1,
        "Qatar": 1
      }
    },
    "Narender": {
      "domestic": {
        "Himachal": 16,
        "Sikkim": 17,
        "Uttrakhand": 7
      },
      "international": {
        "Macao": 1,
        "Qatar": 1,
        "Maldives": 1,
        "Thailand": 1,
        "Switzerland": 1
      }
    },
    "Alex": {
      "domestic": {
        "Kashmir": 34,
        "Rajasthan": 12,
        "Goa": 10,
        "Andaman": 8,
        "Himachal Pradesh": 2,
        "Kerala": 5
      },
      "international": {
        "UAE": 1,
        "Maldives": 1,
        "Thailand": 1,
        "Switzerland": 1,
        "Singapore": 1
      }
    },
    "Rajat": {
      "domestic": {
        "Himachal": 16,
        "Sikkim": 17,
        "Uttrakhand": 7,
        "Andaman": 5
      },
      "international": {
        "Malaysia": 1,
        "Vietnam": 1,
        "Bahrain": 1,
        "Jamaica": 1,
        "Qatar": 1
      }
    },
    "Nilesh": {
      "domestic": {
        "Kashmir": 34,
        "Rajasthan": 12,
        "Himachal Pradesh": 15,
        "Goa": 10,
        "Andaman": 8,
        "Kerala": 5
      },
      "international": {
        "Qatar": 1,
        "Maldives": 1,
        "Thailand": 1,
        "Switzerland": 1,
        "Vietnam": 1
      }
    },
    "Vishal": {
      "domestic": {
        "Goa": 21,
        "Sikkim": 19,
        "Himachal Pradesh": 15,
        "Kerala": 15,
        "Andaman": 14
      },
      "international": {
        "Macao": 1,
        "Qatar": 1,
        "Maldives": 1,
        "Thailand": 1,
        "Switzerland": 1
      }
    },
    "Shubham": {
      "domestic": {
        "Andaman": 23,
        "Kerala": 17,
        "Goa": 17,
        "Himachal Pradesh": 15,
        "Andaman": 5
      },
      "international": {
        "Rajasthan": 12,
        "Malaysia": 1,
        "Vietnam": 1,
        "Macao": 1,
        "Qatar": 1,
        "Qatar": 1
      }
    },
    "Aditi": {
      "domestic": {
        "Himachal": 16,
        "Sikkim": 17,
        "Uttrakhand": 7
      },
      "international": {
        "Malaysia": 1,
        "Vietnam": 1,
        "Bahrain": 1,
        "Jamaica": 1,
        "Qatar": 1
      }
    },
    "Karan": {
      "domestic": {
        "Kashmir": 34,
        "Rajasthan": 12,
        "Goa": 10,
        "Andaman": 8,
        "Kerala": 5
      },
      "international": {
        "Qatar": 1,
        "Maldives": 1,
        "Thailand": 1,
        "Switzerland": 1,
        "Vietnam": 1
      }
    }
  }

  useEffect(() => {
    Promise.all([
      axios.get(`${api.baseUrl}/dashboard?userId=${user.userId}`),
      axios.get(`${api.baseUrl}/dashboard/stats?userId=${user.userId}`),
    ]).then((res) => {
      console.log(res);
      setDashboardData(res[0].data);
      setGraphsData(res[1].data);
    })
  }, [])

  // Extract labels and data for each chart
  function extractChartData(obj) {
    if (!obj || typeof obj !== "object") {
      console.error("Invalid object passed to extractChartData:", obj);
      return { labels: [], values: [] };
    }
    const labels = Object.keys(obj);
    const values = Object.values(obj);
    return { labels, values };
  }

  const defaultChartData = { labels: [], datasets: [] };


  const topFivePackagesData = graphsData?.topFivePackages ? extractChartData(graphsData.topFivePackages) : defaultChartData;
  const topTenDestinationsData = graphsData?.topTenDestinations ? extractChartData(graphsData.topTenDestinations) : defaultChartData;
  const leadSourcesData = graphsData?.leadSources ? extractChartData(graphsData.leadSources) : defaultChartData;


  const generateChartData = (data) => {
    console.log("Input Data for generateChartData:", data);
    return {
      labels: data.labels,
      datasets: [
        {
          label: "Data",
          data: data.values,
          backgroundColor: [
            "#5F67F8", "#F8DF5F", "#FA9851", "#FF6384", "#36A2EB",
            "#FFCE56", "#FF9F40", "#4BC0C0", "#9966FF",
          ],
          borderColor: "#000000",
          borderWidth: 1,
        },
      ],
    };
  };


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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div
              className="bg-pink-100 border-l-4 border-pink-500 p-4 rounded-md"
              title={`Active: ${dashboardData?.activeBookings || 0}, Total: ${dashboardData?.totalBookings || 0}`}
            >
              <p className="text-gray-600 font-bold">Total Bookings</p>
              <p className="text-lg">
                {dashboardData?.activeBookings || 0} / {dashboardData?.totalBookings || 0}
              </p>
            </div>
            <div
              className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded-md"
              title={`Active: ${dashboardData?.activeQuery || 0}, Total: ${dashboardData?.totalQuery || 0}`}
            >
              <p className="text-gray-600 font-bold">Total Queries</p>
              <p className="text-lg">
                {dashboardData?.activeQuery || 0} / {dashboardData?.totalQuery || 0}
              </p>
            </div>
            <div
              className="bg-pink-100 border-l-4 border-pink-500 p-4 rounded-md"
              title={`LinkedIn: ${dashboardData?.LinkedIn || 0}, Facebook: ${dashboardData?.Facebook || 0}, Website: ${dashboardData?.Website || 0}`}
            >
              <p className="text-gray-600 font-bold">Total Leads</p>
              <p className="text-lg">
                {(dashboardData?.LinkedIn || 0) + (dashboardData?.Facebook || 0) + (dashboardData?.Website || 0)} /{" "}
                {dashboardData?.totalLeads || 0}
              </p>
            </div>
            <div
              className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded-md"
              title={`Active Users: ${dashboardData?.activeCustomers || 0}, Total Users: ${dashboardData?.totalCustomers || 0}`}
            >
              <p className="text-gray-600 font-bold">Total Customers</p>
              <p className="text-lg">
                {dashboardData?.activeCustomers || 0} / {dashboardData?.totalCustomers || 0}
              </p>
            </div>
          </div>
          {/* Graph Entries */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="grid-cols-4 bg-white p-4 rounded-lg shadow-md w-full">
              <h3 className="font-bold text-xl text-center">
                Top 10 Destinations
              </h3>
              <Bar data={
                topTenDestinationsData.labels.length > 0
                  ? generateChartData(topTenDestinationsData)
                  : defaultChartData
              } />
            </div>

            <div className="grid-cols-4 bg-white p-4 rounded-lg shadow-md w-full">
              <h3 className="font-bold text-xl text-center">Top 5 Packages</h3>
              <Bar data={
                topFivePackagesData.labels.length > 0
                  ? generateChartData(topFivePackagesData)
                  : defaultChartData
              } options={topPackagesOptions} />
            </div>

            <div className="grid-cols-4 bg-white p-4 rounded-lg shadow-md w-full">
              <h3 className="font-bold text-xl text-center">Weekly Sales</h3>
              <Line data={weeklySalesData} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-8 w-full mt-8">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="font-bold text-xl text-center">Leads Source</h3>
              <Bar data={
                leadSourcesData.labels.length > 0
                  ? generateChartData(leadSourcesData)
                  : defaultChartData
              } />
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
          {/* <div className="table-container mt-8 mb-20 overflow-x-auto">
            <h3
            className="text-white font-bold text-2xl mb-4 text-center py-2"
            style={{ backgroundColor: "#6c757d" }}
            >
            Tour Master Sheet
            </h3>
            </div> */}
          <div className="table-container mt-8 mb-20 overflow-x-auto bg-white p-4">
            <table className="min-w-full bg-white">
              <thead className='bg-gray-200'>
                <th className="py-2 px-4 border">Team Member</th>
                <th className="py-2 px-4 border">Domestic</th>
                <th className="py-2 px-4 border">International</th>
              </thead>
              <tbody>
                {Object.entries(userResport).map(([row, rowIndex]) => (
                  <tr key={rowIndex} className="border-collapse text-center">
                    <td>{rowIndex.domestic}</td>
                    {Object.entries(rowIndex.domestic).map(([column, colIndex]) => (
                      // <td key={colIndex} className="py-2 px-4 border">
                      //   {typeof column.render === 'function'
                      //     ? column.render({ value: row[column.accessor], row })
                      //     : row[column.accessor]}
                      // </td>
                      <td>{column} 12</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

