import React, { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import ProfilePage from './pages/ProfilePage'
// import CompanyHierarchy from './pages/CompanyHierarchy'
import SettingsPage from './pages/SettingsPage'
import CompanyProfilePage from './pages/CompanyProfilePage'
import OrganizationDetailsPage from './pages/OrganizationDetailsPage'
import Quickstart from './component/Quickstart'
import Dashboard from './component/Dashboard'
import Navbar from './component/navbar'
import Sidebar from './component/sidebar'
import ViewDepartments from './pages/ViewDepartment'
import ViewDesignations from './pages/ViewDesignation'
import MasterList from './pages/masterlis'


// import Packages from './components/Packages'
// import CountryMaster from './pages/CountryMaster'
import PackageDashboard from './pages/PackageDashboard'
// import CustomerProfile from './pages/CustomerProfile'
// import HotelMaster from './pages/HotelMaster'
import Bookings from './pages/Bookings'
import PdfFile from './pages/PdfFile'
import axios from 'axios'
import api from './apiConfig/config'
// import HotelMasterAddRoom from './pages/HotelMasterAddRoom'
// import AllMembers from './pages/AllMembers'

const PageRoute = () => {


  const [user, setUser] = useState({});

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
    const key = await crypto.subtle.importKey("jwk", keyData,
      { name: "AES-GCM" },
      true,
      ["encrypt", "decrypt"]
    );
    const iv = new Uint8Array(atob(ivBase64)
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
  const [modulePermission, setModulePermission] = useState([])
  useEffect(() => {
    getDecryptedToken()
      .then((token) => {
        return axios.get(`${api.baseUrl}/username`, {
          headers: {
            "Authorization": `Bearer ${token}`,
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


    axios.get(`${api.baseUrl}/permissions/getall`)
      .then(response => setModulePermission(response.data))
      .catch(error => console.error(error))
  }, []);



  return (
    <div className='flex flex-col h-[100vh] overflow-hidden'>
      <Navbar />
      <div className="main-content h-full flex flex-row w-full">
        <Sidebar />
        <div className='h-full w-full overflow-y-auto'>
          <Routes>
            <Route path='/quickstart' element={<Quickstart />} />
            <Route path='/pdf' element={<PdfFile />} />
            <Route path='/' element={<Quickstart />} />
            <Route path="/dashboard" element={<Dashboard />} />
            {/* <Route path="/packages" element={<Packages />} /> */}
            <Route path="/packageDashboard" element={<PackageDashboard />} />
            {/* <Route path={'/package-list/:id'} element={<CustomerProfile />} /> */}
            <Route path="/masters" element={<MasterList />} />
            {/* <Route path="/master-list/hotel" element={<HotelMaster />} />
            <Route path="/master-list/hotel" element={<HotelMaster />} /> */}
            {/* <Route path='/master-list/hotel/:id' element={<HotelMasterAddRoom />} /> */}
            {/* <Route path="/package-view" element={<CustomerProfile />} /> */}
            <Route path="/bookingsDashboard" element={<Bookings />} />
            {/* <Route path="/all-members" element={<AllMembers />} /> */}
            <Route path="/profile-page" element={<ProfilePage />} />
            {/* <Route path="/department-dashboard" element={<CompanyHierarchy />} /> */}
            <Route path="/profile-page" element={<ProfilePage />} />
            <Route path="/app-settings" element={<SettingsPage />} />
            <Route path="/company-profile" element={<CompanyProfilePage />} />
            <Route
              path="/organization-details"
              element={<OrganizationDetailsPage />}
            />
            <Route
              path="/view-departments"
              element={<ViewDepartments />}
            />
            <Route
              path="/view-designations"
              element={<ViewDesignations />}
            />
            {/* <Route path='/' /> */}
            {/* Add other routes as needed */}
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default PageRoute