import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import About from "./pages/About";
import Programs from "./pages/Programs";
import Impact from "./pages/Impact";
import GetInvolved from "./pages/GetInvolved";
import Blog from "./pages/Blog";
import SocialHub from "./pages/SocialHub";
import Consulting from "./pages/Consulting";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

// Customer Dashboard Pages
import CustomerDashboard from "./pages/CustomerDashboard";
import CustomerPrograms from "./pages/customer/Programs";
import CustomerChildren from "./pages/customer/Children";
import CustomerKidsWork from "./pages/customer/KidsWork";
import CustomerMessages from "./pages/customer/Messages";
import CustomerProfile from "./pages/customer/Profile";

// Admin Dashboard Pages
import AdminDashboard from "./pages/AdminDashboard";
import AdminCustomers from "./pages/admin/Customers";
import AdminChildren from "./pages/admin/Children";
import AdminPrograms from "./pages/admin/Programs";
import AdminEnrollments from "./pages/admin/Enrollments";
import AdminVolunteers from "./pages/admin/Volunteers";
import AdminKidsWork from "./pages/admin/KidsWork";
import AdminMessages from "./pages/admin/Messages";
import AdminSocialPosts from "./pages/admin/SocialPosts";
import AdminContactForms from "./pages/admin/ContactForms";
import AdminPortfolio from "./pages/admin/Portfolio";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/programs" element={<Programs />} />
              <Route path="/impact" element={<Impact />} />
              <Route path="/get-involved" element={<GetInvolved />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/social" element={<SocialHub />} />
              <Route path="/social-hub" element={<Navigate to="/social" replace />} />
              <Route path="/consulting" element={<Consulting />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/auth" element={<Auth />} />

              {/* Dashboard Redirect - for backward compatibility */}
              <Route path="/dashboard" element={<Navigate to="/customer" replace />} />

              {/* Customer Protected Routes */}
              <Route path="/customer" element={<ProtectedRoute requiredRole="customer"><CustomerDashboard /></ProtectedRoute>} />
              <Route path="/customer/programs" element={<ProtectedRoute requiredRole="customer"><CustomerPrograms /></ProtectedRoute>} />
              <Route path="/customer/children" element={<ProtectedRoute requiredRole="customer"><CustomerChildren /></ProtectedRoute>} />
              <Route path="/customer/kids-work" element={<ProtectedRoute requiredRole="customer"><CustomerKidsWork /></ProtectedRoute>} />
              <Route path="/customer/messages" element={<ProtectedRoute requiredRole="customer"><CustomerMessages /></ProtectedRoute>} />
              <Route path="/customer/profile" element={<ProtectedRoute requiredRole="customer"><CustomerProfile /></ProtectedRoute>} />

              {/* Admin Protected Routes */}
              <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/customers" element={<ProtectedRoute requiredRole="admin"><AdminCustomers /></ProtectedRoute>} />
              <Route path="/admin/children" element={<ProtectedRoute requiredRole="admin"><AdminChildren /></ProtectedRoute>} />
              <Route path="/admin/programs" element={<ProtectedRoute requiredRole="admin"><AdminPrograms /></ProtectedRoute>} />
              <Route path="/admin/enrollments" element={<ProtectedRoute requiredRole="admin"><AdminEnrollments /></ProtectedRoute>} />
              <Route path="/admin/volunteers" element={<ProtectedRoute requiredRole="admin"><AdminVolunteers /></ProtectedRoute>} />
              <Route path="/admin/kids-work" element={<ProtectedRoute requiredRole="admin"><AdminKidsWork /></ProtectedRoute>} />
              <Route path="/admin/messages" element={<ProtectedRoute requiredRole="admin"><AdminMessages /></ProtectedRoute>} />
              <Route path="/admin/social-posts" element={<ProtectedRoute requiredRole="admin"><AdminSocialPosts /></ProtectedRoute>} />
              <Route path="/admin/contact-forms" element={<ProtectedRoute requiredRole="admin"><AdminContactForms /></ProtectedRoute>} />
              <Route path="/admin/portfolio" element={<ProtectedRoute requiredRole="admin"><AdminPortfolio /></ProtectedRoute>} />

              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
