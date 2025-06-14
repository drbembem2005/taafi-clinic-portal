
import { Home, User, ListChecks, Calendar, BookOpen, Phone, Video } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const MobileNavigation = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 py-2">
      <div className="flex justify-around items-center">
        <Link 
          to="/" 
          className={`flex flex-col items-center p-2 rounded-md ${isActive('/') ? 'text-brand' : 'text-gray-500'}`}
        >
          <Home size={20} />
          <span className="text-xs mt-1">الرئيسية</span>
        </Link>
        
        <Link 
          to="/specialties" 
          className={`flex flex-col items-center p-2 rounded-md ${isActive('/specialties') ? 'text-brand' : 'text-gray-500'}`}
        >
          <ListChecks size={20} />
          <span className="text-xs mt-1">التخصصات</span>
        </Link>
        
        <Link 
          to="/doctors" 
          className={`flex flex-col items-center p-2 rounded-md ${isActive('/doctors') ? 'text-brand' : 'text-gray-500'}`}
        >
          <User size={20} />
          <span className="text-xs mt-1">الأطباء</span>
        </Link>
        
        <Link 
          to="/telemedicine" 
          className={`flex flex-col items-center p-2 rounded-md ${isActive('/telemedicine') ? 'text-brand' : 'text-gray-500'}`}
        >
          <Video size={20} />
          <span className="text-xs mt-1">الكشف الأونلاين</span>
        </Link>
        
        <Link 
          to="/booking" 
          className={`flex flex-col items-center p-2 rounded-md ${isActive('/booking') ? 'text-brand' : 'text-gray-500'}`}
        >
          <Calendar size={20} />
          <span className="text-xs mt-1">الحجز</span>
        </Link>
        
        <Link 
          to="/contact" 
          className={`flex flex-col items-center p-2 rounded-md ${isActive('/contact') ? 'text-brand' : 'text-gray-500'}`}
        >
          <Phone size={20} />
          <span className="text-xs mt-1">اتصل بنا</span>
        </Link>
      </div>
    </div>
  );
};

export default MobileNavigation;
