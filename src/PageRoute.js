import React from 'react'
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

const PageRoute = () => {

  return (
    <div className='flex flex-col h-[100vh] overflow-hidden'>
      <Navbar />
      <div className="main-content h-full flex flex-row w-full">
        <Sidebar />
        <div className='h-full w-full overflow-y-auto'>
          <Routes>
            <Route path='' element={<Quickstart />} />
            <Route path="/dashboard" element={<Dashboard />} />
            {/* <Route path="/packages" element={<Packages />} /> 
            <Route path="/packageDashboard" element={<PackageDashboard />} />
            <Route path={'/package-list/:id'} element={<CustomerProfile />} />
            <Route path="/master-list" element={<MasterList />} />
            <Route path="/master-list/hotel" element={<HotelMaster />} />
            <Route path="/master-list/hotel" element={<HotelMaster />} />
            <Route path='/master-list/hotel/:id' element={<HotelMasterAddRoom />} />
            <Route path="/package-view" element={<CustomerProfile />} />
            <Route path="/booking-dashboard" element={<Bookings />} />
            <Route path="/all-members" element={<AllMembers />} />
            <Route path="/profile-page" element={<ProfilePage />} /> */}
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
            <Route path='/' />
            {/* Add other routes as needed */}
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default PageRoute