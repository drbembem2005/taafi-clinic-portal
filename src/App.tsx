
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
import { seedDoctorsData } from '@/services/doctorService';

// Add Google Font via CSS
const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for 1 second
    setTimeout(() => {
      setLoading(false);
    }, 1000);

    // Seed doctors data if needed
    seedDoctorsData();
  }, []);

  return (
    <div className="App">
      <div className="font-cairo">
        <Routes>
          <Route path="/" element={<Layout><Index /></Layout>} />
          <Route path="/specialties" element={<Layout><Specialties /></Layout>} />
          <Route path="/doctors" element={<Layout><Doctors /></Layout>} />
          <Route path="/booking" element={<Layout><Booking /></Layout>} />
          <Route path="/about" element={<Layout><About /></Layout>} />
          <Route path="/contact" element={<Layout><Contact /></Layout>} />
          <Route path="/blog" element={<Layout><Blog /></Layout>} />
          <Route path="/blog/:slug" element={<Layout><BlogPost /></Layout>} />
          <Route path="*" element={<Layout><NotFound /></Layout>} />
        </Routes>
        <Toaster />
      </div>
    </div>
  );
};

export default App;
