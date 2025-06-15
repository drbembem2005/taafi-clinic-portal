import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'الرئيسية', path: '/' },
    { name: 'عن العيادة', path: '/about' },
    { name: 'التخصصات', path: '/specialties' },
    { name: 'الأطباء', path: '/doctors' },
    { name: 'مساعد تعافي الذكية', path: '/health-tools' },
    { name: 'الحجز', path: '/booking' },
    { name: 'المدونة', path: '/blog' },
    { name: 'اتصل بنا', path: '/contact' },
  ];

  const getNavClass = ({ isActive }: { isActive: boolean }) => {
    return `px-3 py-2 rounded-md text-lg ${
      isActive
        ? 'text-brand-dark font-bold border-b-2 border-brand'
        : 'text-gray-700 hover:text-brand hover:bg-blue-50'
    }`;
  };

  const handleBookingClick = () => {
    if (typeof window !== 'undefined' && (window as any).umami) {
      (window as any).umami.track('Click: Book Now', { component: 'Header' });
    }
  };
  
  const handleMobileBookingClick = () => {
    handleBookingClick();
    setIsOpen(false);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <NavLink to="/" className="flex items-center">
              <img
                src="/lovable-uploads/93b2823f-8ba0-45e0-83bd-fd27bb5535d9.png"
                alt="تعافي التخصصية"
                className="h-12 w-auto"
              />
              <span className="text-xl font-bold text-brand-dark mr-2">عيادات تعافي التخصصية</span>
            </NavLink>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                )}
              </svg>
            </Button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 space-x-reverse">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={getNavClass}
                end
              >
                {item.name}
              </NavLink>
            ))}
            <Link to="/booking" onClick={handleBookingClick}>
              <Button variant="default" className="bg-brand hover:bg-brand-dark text-white px-5 py-2 rounded-md mr-4">
                احجز الآن
              </Button>
            </Link>
          </nav>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden mt-4"
          >
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={getNavClass}
                  end
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </NavLink>
              ))}
              <Link to="/booking" onClick={handleMobileBookingClick}>
                <Button variant="default" className="bg-brand hover:bg-brand-dark text-white w-full py-2 mt-4">
                  احجز الآن
                </Button>
              </Link>
            </div>
          </motion.nav>
        )}
      </div>
      
      {/* Slogan Banner */}
      <div className="bg-brand text-white py-2 text-center">
        <p className="text-lg font-bold">اختر الرعاية المثلى.. واختر تعافي! 💙✨</p>
      </div>
    </header>
  );
};

export default Header;
