
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import About from "./pages/About";
import Programs from "./pages/Programs";
import Portfolio from "./pages/Portfolio";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import Login from "./pages/Login";
import CustomerDashboard from "./pages/CustomerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import GetInvolved from "./pages/GetInvolved";
import Impact from "./pages/Impact";
import SocialHub from "./pages/SocialHub";
import Consulting from "./pages/Consulting";

// Customer Pages
import CustomerProfile from "./pages/customer/Profile";
import CustomerChildren from "./pages/customer/Children";
import CustomerMessages from "./pages/customer/Messages";
import CustomerKidsWork from "./pages/customer/KidsWork";

// Admin Pages
import AdminCustomers from "./pages/admin/Customers";
import AdminChildren from "./pages/admin/Children";
import AdminPrograms from "./pages/admin/Programs";
import AdminMessages from "./pages/admin/Messages";
import AdminKidsWork from "./pages/admin/KidsWork";
import AdminContactForms from "./pages/admin/ContactForms";
import AdminVolunteers from "./pages/admin/Volunteers";
import AdminSocialPosts from "./pages/admin/SocialPosts";
import AdminPortfolio from "./pages/admin/Portfolio";
import AdminSettings from "./pages/admin/Settings";

import ProtectedRoute from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/get-involved" element={<GetInvolved />} />
            <Route path="/impact" element={<Impact />} />
            <Route path="/social" element={<SocialHub />} />
            <Route path="/consulting" element={<Consulting />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/login" element={<Login />} />
            
            {/* Customer Dashboard Routes */}
            <Route path="/customer" element={
              <ProtectedRoute>
                <CustomerDashboard />
              </ProtectedRoute>
            } />
            <Route path="/customer/profile" element={
              <ProtectedRoute>
                <CustomerProfile />
              </ProtectedRoute>
            } />
            <Route path="/customer/children" element={
              <ProtectedRoute>
                <CustomerChildren />
              </ProtectedRoute>
            } />
            <Route path="/customer/messages" element={
              <ProtectedRoute>
                <CustomerMessages />
              </ProtectedRoute>
            } />
            <Route path="/customer/kids-work" element={
              <ProtectedRoute>
                <CustomerKidsWork />
              </ProtectedRoute>
            } />

            {/* Admin Dashboard Routes */}
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/customers" element={
              <ProtectedRoute>
                <AdminCustomers />
              </ProtectedRoute>
            } />
            <Route path="/admin/children" element={
              <ProtectedRoute>
                <AdminChildren />
              </ProtectedRoute>
            } />
            <Route path="/admin/programs" element={
              <ProtectedRoute>
                <AdminPrograms />
              </ProtectedRoute>
            } />
            <Route path="/admin/messages" element={
              <ProtectedRoute>
                <AdminMessages />
              </ProtectedRoute>
            } />
            <Route path="/admin/kids-work" element={
              <ProtectedRoute>
                <AdminKidsWork />
              </ProtectedRoute>
            } />
            <Route path="/admin/contact-forms" element={
              <ProtectedRoute>
                <AdminContactForms />
              </ProtectedRoute>
            } />
            <Route path="/admin/volunteers" element={
              <ProtectedRoute>
                <AdminVolunteers />
              </ProtectedRoute>
            } />
            <Route path="/admin/social-posts" element={
              <ProtectedRoute>
                <AdminSocialPosts />
              </ProtectedRoute>
            } />
            <Route path="/admin/portfolio" element={
              <ProtectedRoute>
                <AdminPortfolio />
              </ProtectedRoute>
            } />
            <Route path="/admin/settings" element={
              <ProtectedRoute>
                <AdminSettings />
              </ProtectedRoute>
            } />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
