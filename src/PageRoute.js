import React, { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
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
import CustomerProfilePopup from './pages/CustomerProfilePopup'


// import Packages from './component/Packages'
// import CountryMaster from './pages/CountryMaster'
import PackageDashboard from './pages/PackageDashboard'
import CustomerProfile from './pages/CustomerProfile'
// import HotelMaster from './pages/HotelMaster'
import Bookings from './pages/Bookings'
import PdfFile from './pages/PdfFile'
import axios from 'axios'
import api from './apiConfig/config'
// import HotelMasterAddRoom from './pages/HotelMasterAddRoom'
import AllMembers from './pages/AllMembers'
import HotelView from './pages/HotelView'
import CustomersList from './pages/CustomersList'
import ViewCompany from './pages/ViewCompany'
import ViewVendorReport from './pages/ViewVendorReport'

const PageRoute = () => {

  return (
    <div className='flex flex-col h-[100vh] overflow-hidden'>
      <Navbar />
      <div className="main-content h-full flex flex-row w-full">
        <Sidebar />
        <div className='h-full w-full overflow-y-auto mb-10'>
          <Routes>
            <Route path='/quickstart' element={<Quickstart />} />
            <Route path='/pdf' element={<PdfFile />} />
            <Route path='/' element={<Quickstart />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/packages" element={<Navigate to="/home/packageDashboard" replace />} />
            <Route path="/packageDashboard" element={<PackageDashboard isListView={true} />} />
            <Route path={'/package-list/:id'} element={<CustomerProfile />} />
            <Route path="/masters" element={<MasterList />} />
            <Route path="/company" element={<ViewCompany />} />
            <Route path="/queryDashboard" element={<Bookings />} />
            <Route path="/myteams" element={<AllMembers />} />
            <Route path="/profile-page" element={<ProfilePage />} />
            <Route path="/app-settings" element={<SettingsPage />} />
            <Route path={`/company-profile`} element={<CompanyProfilePage />} />
            <Route path={`/customerBoards`} element={<Navigate to="/home/customer" replace />} />
            <Route path={`/userBoards`} element={<Navigate to="/home/myteams" replace />} />
            <Route path={`/reports`} element={<ViewVendorReport />} />
            <Route
              path="/hotel-view/:hotelId"
              element={<HotelView />}
            />
            <Route
              path={'/organization-details/:id'}
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
            <Route
              path="/customer-profile-popup/:userId"
              element={<CustomerProfilePopup />}
            />
            <Route
              path="/customer"
              element={<CustomersList />}
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