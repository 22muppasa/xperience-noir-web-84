import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from '@/pages/Home';
import About from '@/pages/About';
import Consulting from '@/pages/Consulting';
import Contact from '@/pages/Contact';
import Programs from '@/pages/Programs';
import Volunteer from '@/pages/Volunteer';
import Donate from '@/pages/Donate';
import CustomerDashboard from '@/pages/customer/CustomerDashboard';
import CustomerProfile from '@/pages/customer/CustomerProfile';
import CustomerKids from '@/pages/customer/CustomerKids';
import CustomerKidsWork from '@/pages/customer/CustomerKidsWork';
import CustomerProgramDetails from '@/pages/customer/CustomerProgramDetails';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import Children from '@/pages/admin/Children';
import Customers from '@/pages/admin/Customers';
import AdminPrograms from '@/pages/admin/Programs';
import Enrollments from '@/pages/admin/Enrollments';
import KidsWork from '@/pages/admin/KidsWork';
import AdminMessages from '@/pages/admin/AdminMessages';
import ContactForms from '@/pages/admin/ContactForms';
import Volunteers from '@/pages/admin/Volunteers';
import SocialPosts from '@/pages/admin/SocialPosts';
import Settings from '@/pages/admin/Settings';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import CustomerProtectedRoute from '@/components/auth/CustomerProtectedRoute';
import SocialFeed from '@/pages/SocialFeed';
import Portfolio from '@/pages/admin/Portfolio';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/consulting" element={<Consulting />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/volunteer" element={<Volunteer />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/social-feed" element={<SocialFeed />} />

          {/* Customer Routes */}
          <Route path="/customer/*" element={
            <CustomerProtectedRoute>
              <Routes>
                <Route index element={<CustomerDashboard />} />
                <Route path="profile" element={<CustomerProfile />} />
                <Route path="kids" element={<CustomerKids />} />
                <Route path="kids/:kidId/work" element={<CustomerKidsWork />} />
        		    <Route path="programs/:programId" element={<CustomerProgramDetails />} />
              </Routes>
            </CustomerProtectedRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin/*" element={
            <ProtectedRoute requiredRole="admin">
              <Routes>
                <Route index element={<AdminDashboard />} />
                <Route path="children" element={<Children />} />
                <Route path="customers" element={<Customers />} />
                <Route path="programs" element={<AdminPrograms />} />
                <Route path="enrollments" element={<Enrollments />} />
                <Route path="kids-work" element={<KidsWork />} />
                <Route path="messages" element={<AdminMessages />} />
                <Route path="contact-forms" element={<ContactForms />} />
                <Route path="volunteers" element={<Volunteers />} />
                <Route path="social-posts" element={<SocialPosts />} />
                <Route path="portfolio" element={<Portfolio />} />
                <Route path="settings" element={<Settings />} />
              </Routes>
            </ProtectedRoute>
          } />

          {/* Not Found Route - Catch-all for undefined routes */}
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
