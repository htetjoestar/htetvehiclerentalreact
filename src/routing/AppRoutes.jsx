import React from 'react';
import { Routes, Route, Router, BrowserRouter } from 'react-router-dom';
import Home from '../pages/Home';
import Admin from '../pages/Admin';
import NewEmployee from '../pages/PortalAdmin/NewEmployee'
import ManageEmployees from '../pages/PortalAdmin/ManageEmployees'
import EmployeeDetail from '../pages/PortalAdmin/EmployeeDetail';
import NewVehicle from '../pages/VehicleExecutive/NewVehicle';
import ManageVehicle from '../pages/VehicleExecutive/ManageVehicles';
import EditVehicleDetails from '../pages/VehicleExecutive/EditVehicleDetails';
import NewMaintenance from '../pages/VehicleExecutive/NewMaintenance';
import EmployeeEditor from '../pages/VehicleExecutive/EmployeeEditor';
import NewLocation from '../pages/VehicleExecutive/NewLocation';
import CustomerRegistration from '../pages/Customer/CustomerRegistration';
import CustomerEditor from '../pages/Customer/CustomerEditor';
import LoginPage from '../pages/Customer/LoginPage';
import ReservationLayout from '../pages/Components/ReservationLayout';
import DateScreen from '../pages/Customer/NewReservation/DateScreen';
import VehicleSelect from '../pages/Customer/NewReservation/VehicleSelect';
import AdditionalFeatures from '../pages/Customer/NewReservation/AdditionalFeatures';
import ManageMaintenance from '../pages/VehicleExecutive/ManageMaintenance';
import EditMaintenanceDetails from '../pages/VehicleExecutive/EditMaintenanceDetails';
import ManageReservations from '../pages/VehicleExecutive/ManageReservations';
import ReviewReservation from '../pages/VehicleExecutive/ReviewReservation';
import RequireAdminAuth from '../pages/Components/RequireAdminAuth';
import AdminLoginPage from '../pages/VehicleExecutive/AdminLoginPage';
import RequireCustomerAuth from '../pages/Components/RequireCustomerAuth';
import CustomerLayout from '../pages/Components/CustomerLayout';
import CustomerManageReservations from '../pages/Customer/NewReservation/CustomerManageReservations';
import CustReviewReservation from '../pages/Customer/NewReservation/CustReviewReservation';
import VerifyEmail from '../pages/Customer/VerificationPage';
import PortalAdminRequireAuth from '../pages/Components/PortalAdminRequireAuth';
import PortalAdminLayout from '../pages/Components/PortalAdminLayout';
import AdminHome from '../pages/PortalAdmin/AdminHome';
import PortalAdminLoginPage from '../pages/PortalAdmin/PortalAdminLogin';
import Dashboard from '../pages/PortalAdmin/Dashboard';
import ManageCustomers from '../pages/PortalAdmin/ManageCustomers';
import InspectCustomer from '../pages/PortalAdmin/InspectCustomer';
import ManageInvoices from '../pages/Customer/NewReservation/ManageInvoices';
import CustomerReviewInvoice from '../pages/Customer/CustomerReviewInvoice';
import ManagePaymentMethods from '../pages/Customer/ManagePaymentMethods';
import ReservationPayment from '../pages/Customer/NewReservation/ReservationPayment';
import InvoicePayment from '../pages/Customer/InvoicePayment';
import QuickReserve from '../pages/Customer/NewReservation/Quickreserve';
import PortalEditor from '../pages/PortalAdmin/PortalEditor';
import PastReservations from '../pages/Customer/NewReservation/PastReservations';
import RequestPasswordPage from '../pages/Customer/RequestPasswordChange';
import PasswordResetPage from '../pages/Customer/PasswordResetPage';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<CustomerRegistration />} />
        <Route path="/customer-login" element={<LoginPage />} />
        <Route path="admin-login" element={<AdminLoginPage />} />
        <Route path="portal-admin-login" element={<PortalAdminLoginPage />} />
        <Route path="/request-password" element={<RequestPasswordPage />} />
         <Route path="/verify" element={<VerifyEmail />} /> 
         <Route path="/reset-password" element={<PasswordResetPage />} />
        
        {/* Admin-protected routes */}
        <Route path="/admin" element={<RequireAdminAuth><Admin /></RequireAdminAuth>} />
        
        <Route path="/manageemployee" element={<RequireAdminAuth><ManageEmployees /></RequireAdminAuth>} />
        <Route path="/newlocation" element={<RequireAdminAuth><NewLocation /></RequireAdminAuth>} />
        <Route path="/employee/:id" element={<RequireAdminAuth><EmployeeDetail /></RequireAdminAuth>} />
        <Route path="/newvehicle" element={<RequireAdminAuth><NewVehicle /></RequireAdminAuth>} />
        <Route path="/managevehicle" element={<RequireAdminAuth><ManageVehicle /></RequireAdminAuth>} />
        <Route path="/managemaintenance" element={<RequireAdminAuth><ManageMaintenance /></RequireAdminAuth>} />
        <Route path="/managereservations" element={<RequireAdminAuth><ManageReservations /></RequireAdminAuth>} />
        <Route path="/vehicle/:id" element={<RequireAdminAuth><EditVehicleDetails /></RequireAdminAuth>} />
        <Route path="/maintenance/:id" element={<RequireAdminAuth><EditMaintenanceDetails /></RequireAdminAuth>} />
        <Route path="/emp_reservation/:id" element={<RequireAdminAuth><ReviewReservation /></RequireAdminAuth>} />
        <Route path="/newmaintenance/:id" element={<RequireAdminAuth><NewMaintenance /></RequireAdminAuth>} />
        <Route path="/employeeaccountsettings/:id" element={<RequireAdminAuth><EmployeeEditor /></RequireAdminAuth>} />

        {/* Customer route */}
        

        {/* Reservation process (nested routes) */}
        <Route element={<RequireCustomerAuth><CustomerLayout /></RequireCustomerAuth>}>
          <Route path="/reservation" element={<ReservationLayout />}>
          <Route index element={<DateScreen />} />
          <Route path="select-vehicle" element={<VehicleSelect />} />
          <Route path="additional-features" element={<AdditionalFeatures />} />
          <Route path="payment" element={<ReservationPayment />} />
          <Route path="quick-reserve" element={<QuickReserve />} />
          </Route>
          <Route path="/customeraccountsettings/:id" element={<CustomerEditor />} />
          <Route path="/customer-reservations" element={<CustomerManageReservations />} />
          <Route path="/customer-past-reservations" element={<PastReservations />} />
          <Route path="/customeraccountsettings/:id" element={<CustomerEditor />} />
          <Route path="/customer-review-reservation/:id" element={<CustReviewReservation />} />
          <Route path="/customer-review-invoice/:id" element={<CustomerReviewInvoice />} />
          <Route path="/manage-invoices" element={<ManageInvoices />} />
          <Route path="/manage-payment" element={<ManagePaymentMethods />} />
          <Route path="/invoice-payment/:id" element={<InvoicePayment />} />
          </Route>
        <Route element={<PortalAdminRequireAuth><PortalAdminLayout /></PortalAdminRequireAuth>}>
          <Route path="/dashboard" element={<Dashboard />}></Route>
          <Route path="/managecustomers" element={<ManageCustomers />}></Route>
          <Route path="/inspect-customer/:id" element={<InspectCustomer />} />
          <Route path="/inspect-employee/:id" element={<EmployeeDetail />} />
          <Route path="/adminemployee" element={<NewEmployee />} />
          <Route path="/manage-employee" element={<ManageEmployees />}></Route>
          <Route path="/portalaccountsettings/:id" element={<PortalEditor />} />
        </Route>
        {/* Fallback */}
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;