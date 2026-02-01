import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index.jsx";
import CodingSheet from "./pages/CodingSheet.jsx";
import Communication from "./pages/Communication.jsx";
import NotFound from "./pages/NotFound.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import EmailVerify from "./pages/EmailVerify.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import Contact from "./pages/Contact.jsx";
import Pricing from "./pages/Pricing.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx";
import TermsAndConditions from "./pages/TermsAndConditions.jsx";
import CancellationAndRefundPolicy from "./pages/CancellationAndRefundPolicy.jsx";
import MockTestDashboard from "./pages/test/MockTestDashboard.jsx";
import StartTest from "./pages/test/StartTest.jsx";
import Test from "./pages/test/Test.jsx";
import Result from "./pages/test/Result.jsx";
import AptitudeStudyMaterial from "./pages/AptitudeStudyMaterial.jsx";
import AptitudeMockTestDashboard from "./pages/AptitudeMockTestDashboard.jsx";
import AptitudeStartTest from "./pages/AptitudeStartTest.jsx";
import AptitudeTest from "./pages/AptitudeTest.jsx";
import AptitudeResult from "./pages/AptitudeResult.jsx";
import StudyMaterial from "./pages/StudyMaterial.jsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/email-verify" element={<EmailVerify />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/" element={<Index />} />
            <Route path="/coding-sheet" element={<CodingSheet />} />
            <Route path="/communication" element={<Communication />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
            <Route path="/cancellation-and-refund-policy" element={<CancellationAndRefundPolicy />} />

            {/* Core Subject Routes - Protected */}
            <Route path="/study-material" element={<ProtectedRoute><StudyMaterial /></ProtectedRoute>} />

            {/* Mock Test Routes - Protected */}
            <Route path="/mock-test" element={<ProtectedRoute><MockTestDashboard /></ProtectedRoute>} />
            <Route path="/mock-test/:testId/start" element={<ProtectedRoute><StartTest /></ProtectedRoute>} />
            <Route path="/mock-test/:testId/attempt" element={<ProtectedRoute><Test /></ProtectedRoute>} />
            <Route path="/mock-test/:testId/result" element={<ProtectedRoute><Result /></ProtectedRoute>} />

            {/* Aptitude Routes - Protected */}
            <Route path="/aptitude-study-material" element={<ProtectedRoute><AptitudeStudyMaterial /></ProtectedRoute>} />
            <Route path="/aptitude-mock-test" element={<ProtectedRoute><AptitudeMockTestDashboard /></ProtectedRoute>} />
            <Route path="/aptitude-mock-test/:testId/start" element={<ProtectedRoute><AptitudeStartTest /></ProtectedRoute>} />
            <Route path="/aptitude-mock-test/:testId/attempt" element={<ProtectedRoute><AptitudeTest /></ProtectedRoute>} />
            <Route path="/aptitude-mock-test/:testId/result" element={<ProtectedRoute><AptitudeResult /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
