
import Index from '@/pages/Index';
import About from '@/pages/About';
import Booking from '@/pages/Booking';
import Contact from '@/pages/Contact';
import Doctors from '@/pages/Doctors';
import NotFound from '@/pages/NotFound';
import Specialties from '@/pages/Specialties';
import Blog from '@/pages/Blog';
import BlogPost from '@/pages/BlogPost';
import { Toaster } from '@/components/ui/toaster';
import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminLogin from '@/pages/admin/AdminLogin';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminSpecialties from '@/pages/admin/AdminSpecialties';
import AdminDoctors from '@/pages/admin/AdminDoctors';
import AdminSchedules from '@/pages/admin/AdminSchedules';
import AdminBlog from '@/pages/admin/AdminBlog';
import AdminBlogEdit from '@/pages/admin/AdminBlogEdit';
import AdminRoute from '@/components/admin/AdminRoute';
import ScrollToTop from '@/components/utils/ScrollToTop';

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for 1 second then set loading to false
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="spinner w-16 h-16 border-4 border-brand rounded-full border-t-transparent animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-medium text-gray-700">جاري تحميل التطبيق...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <div className="font-cairo">
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Layout><Index /></Layout>} />
          <Route path="/specialties" element={<Layout><Specialties /></Layout>} />
          <Route path="/doctors" element={<Layout><Doctors /></Layout>} />
          <Route path="/booking" element={<Layout><Booking /></Layout>} />
          <Route path="/about" element={<Layout><About /></Layout>} />
          <Route path="/contact" element={<Layout><Contact /></Layout>} />
          <Route path="/blog" element={<Layout><Blog /></Layout>} />
          <Route path="/blog/:slug" element={<Layout><BlogPost /></Layout>} />
          
          {/* Admin Routes - Hidden from normal navigation */}
          <Route path="/management-portal" element={<AdminLogin />} />
          <Route path="/management-portal/*" element={
            <AdminRoute>
              <AdminLayout>
                <Routes>
                  <Route path="/" element={<AdminDashboard />} />
                  <Route path="/specialties" element={<AdminSpecialties />} />
                  <Route path="/doctors" element={<AdminDoctors />} />
                  <Route path="/schedules" element={<AdminSchedules />} />
                  <Route path="/blog" element={<AdminBlog />} />
                  <Route path="/blog/create" element={<AdminBlogEdit />} />
                  <Route path="/blog/edit/:id" element={<AdminBlogEdit />} />
                </Routes>
              </AdminLayout>
            </AdminRoute>
          } />
          
          {/* Catch-all route */}
          <Route path="*" element={<Layout><NotFound /></Layout>} />
        </Routes>
        <Toaster />
      </div>
    </div>
  );
};

export default App;
