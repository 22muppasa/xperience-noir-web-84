
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import About from '@/pages/About';
import Consulting from '@/pages/Consulting';
import Contact from '@/pages/Contact';
import Programs from '@/pages/Programs';
import AdminDashboard from '@/pages/AdminDashboard';
import Children from '@/pages/admin/Children';
import Customers from '@/pages/admin/Customers';
import AdminPrograms from '@/pages/admin/Programs';
import Enrollments from '@/pages/admin/Enrollments';
import KidsWork from '@/pages/admin/KidsWork';
import ContactForms from '@/pages/admin/ContactForms';
import Volunteers from '@/pages/admin/Volunteers';
import SocialPosts from '@/pages/admin/SocialPosts';
import Settings from '@/pages/admin/Settings';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Portfolio from '@/pages/admin/Portfolio';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<About />} />
          <Route path="/about" element={<About />} />
          <Route path="/consulting" element={<Consulting />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/programs" element={<Programs />} />
          
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
