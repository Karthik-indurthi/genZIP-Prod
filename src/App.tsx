import React from 'react';
import { BrowserRouter as Router, Routes, Route,useLocation  } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.js';
import ProtectedRoute from './components/ProtectedRoute.js';
import ProtectedEmployeeRoute from './components/ProtectedEmployeeRoute.js';
import './styles/index.css';

// Layout Components
import Navbar from './components/Navbar/Navbar.js';
import Footer from './../src/Footer.js'; // You'll need to create this

// Public Pages
import Home from './pages/Home/Home.js';
import Login from './pages/Login/Login.js';
import SignUp from './pages/SignUp/SignUp.js';
import AdminSignup from './pages/AdminSignup/AdminSignup.js';
import LocationUpload from './pages/LocationUpload.js';
import AdminPaymentHistory from './pages/AdminDashboard/AdminPaymentHistory.js';
import AdminEnquiries from './pages/AdminDashboard/AdminEnquiries.js';



// Admin Pages
import AdminLayout from './pages/AdminDashboard/AdminLayout.js';
import DashboardHome from './pages/AdminDashboard/DashboardHome.js';
import AdminInterviewUpdates from './pages/AdminDashboard/AdminInterviewUpdates.js';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard.js';
import AdminHRManagement from './pages/AdminDashboard/AdminHRManagement.js';
import AdminProfilePopup from './pages/AdminDashboard/AdminProfilePopup.js';
import AdminSystemSettings from './pages/AdminDashboard/AdminSystemSettings.js';


// HR Pages
import HRLayout from './pages/HRDashboard/HRLayout.js';
import HRAddJob from './pages/HRDashboard/HRAddJob.js';
import HRAddInterviewer from './pages/HRDashboard/HRAddInterviewer.js';
import HRCandidates from './pages/HRDashboard/HRCandidates.js';
import HRScheduleInterview from './pages/HRDashboard/HRScheduleInterview.js';
import PaymentOptionsPage from './pages/HRDashboard/PaymentOptionsPage.js';
import HRFirstTimeResetPopup from './pages/HRDashboard/HRFirstTimeResetPopup.js';
import HRProfile from './pages/HRDashboard/HRProfile.js';

// Payment Pages
import Payment from './pages/Payment/Payment.js';
import SubscriptionPage from './pages/Payment/SubscriptionPage.js';
import PayPerInterview from './pages/Payment/PayPerInterview.js';
import PaymentSuccess from './pages/PaymentSuccess/PaymentSuccess.js';

// Employee Pages
import EmployeeSignup from './pages/Employee/EmployeeSignup.js';
import EmployeeLogin from './pages/Employee/EmployeeLogin.js';
import EmployeeForgotPassword from './pages/Employee/EmployeeForgotPassword.js';
import EmployeeLayout from './pages/Employee/EmployeeLayout.js';
import EmployeeDashboard from './pages/Employee/EmployeeDashboard.js';
import EmployeeScheduled from './pages/Employee/EmployeeScheduled.js';
import EmployeeInProgress from './pages/Employee/EmployeeInProgress.js';
import EmployeeCompleted from './pages/Employee/EmployeeCompleted.js';
import EmployeePayments from './pages/Employee/EmployeePayments.js';
import EmployeeTransferred from './pages/Employee/EmployeeTransferred.js';
import EmployeeProfile from './pages/Employee/EmployeeProfile.js';
import PrivacyPolicyModal from './pages/Home/PrivacyPolicyModal.js';




const App = () => (
  <AuthProvider>
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        
        <main className="flex-grow">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/admin-signup" element={<AdminSignup />} />
              <Route path="/location-upload/:interviewId" element={<LocationUpload />} />
              <Route path="/Candidate/Location-upload/:interviewId" element={<LocationUpload />} />
              <Route path="PrivacyPolicyModal" element={<PrivacyPolicyModal isOpen={false} onClose={function (): void {
                throw new Error('Function not implemented.');
              } } />} />

              {/* HR Dashboard */}
              <Route path="/hr" element={<ProtectedRoute><HRLayout /></ProtectedRoute>}>
                <Route path="add-job" element={<HRAddJob />} />
                <Route path="interviewers" element={<HRAddInterviewer />} />
                <Route path="candidates" element={<HRCandidates />} />
                <Route path="schedule" element={<HRScheduleInterview />} />
                <Route path="profile" element={<HRProfile />} />
                <Route path="HRFirstTimeResetPopup" element={<HRFirstTimeResetPopup userEmail={''} onComplete={() => {}} />} />
                <Route path="payment-options" element={<PaymentOptionsPage interviewId="" hrEmail="" />} />
              </Route>

              {/* Admin Dashboard */}
              <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
                <Route index element={<DashboardHome />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="interview-updates" element={<AdminInterviewUpdates />} />
                <Route path="/admin/payments" element={<AdminPaymentHistory />} />
                <Route path="/admin/enquiries" element={<AdminEnquiries />} />
                <Route path="/admin/settings" element={<AdminSystemSettings />} />
                
                
                <Route path="hr-management" element={<AdminHRManagement />} />

                {/*<Route path="profile" element={<AdminProfilePopup />} />*/}
              </Route>

              {/* Payment Routes */}
              <Route path="/payment" element={<Payment />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/subscription" element={<SubscriptionPage />} />
              <Route path="/payperinterview" element={<PayPerInterview />} />

              


              {/* Employee Routes */}
              <Route path="/employee-signup" element={<EmployeeSignup />} />
              <Route path="/employee-login" element={<EmployeeLogin />} />
              <Route path="/employee-forgot-password" element={<EmployeeForgotPassword />} />
              <Route path="/employee" element={<ProtectedEmployeeRoute><EmployeeLayout /></ProtectedEmployeeRoute>}>
                <Route index element={<EmployeeDashboard />} />
                <Route path="scheduled" element={<EmployeeScheduled />} />
                <Route path="in-progress" element={<EmployeeInProgress />} />
                <Route path="completed" element={<EmployeeCompleted />} />
                <Route path="transferred" element={<EmployeeTransferred />} />
                <Route path="payments" element={<EmployeePayments />} />
                <Route path="profile" element={<EmployeeProfile />} />
                

                
              </Route>
            </Routes>
          </div>
        </main>

        <Footer />
      </div>
    </Router>
  </AuthProvider>
);

export default App;