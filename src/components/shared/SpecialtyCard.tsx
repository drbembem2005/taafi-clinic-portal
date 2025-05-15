
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Specialty } from '@/data/specialties';
import { Link } from 'react-router-dom';
import { Heart, Baby, Brain, User, Stethoscope, Microscope } from 'lucide-react';

interface SpecialtyCardProps {
  specialty: Specialty;
}

const SpecialtyCard = ({ specialty }: SpecialtyCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  
  // Get a background color based on the specialty id
  const getBgColor = () => {
    const colors = [
      'bg-blue-50', 'bg-green-50', 'bg-purple-50', 
      'bg-pink-50', 'bg-yellow-50', 'bg-indigo-50'
    ];
    return colors[specialty.id % colors.length];
  };
  
  // Get a text color based on the specialty id
  const getTextColor = () => {
    const colors = [
      'text-blue-600', 'text-green-600', 'text-purple-600', 
      'text-pink-600', 'text-yellow-600', 'text-indigo-600'
    ];
    return colors[specialty.id % colors.length];
  };
  
  // Get a border color based on the specialty id
  const getBorderColor = () => {
    const colors = [
      'border-blue-200', 'border-green-200', 'border-purple-200', 
      'border-pink-200', 'border-yellow-200', 'border-indigo-200'
    ];
    return colors[specialty.id % colors.length];
  };

  // Choose the appropriate icon based on specialty.icon value
  const renderIcon = () => {
    const iconClass = `h-8 w-8 ${getTextColor()}`;
    
    switch(specialty.icon) {
      case 'heart':
        return <Heart className={iconClass} />;
      case 'baby':
        return <Baby className={iconClass} />;
      case 'brain':
        return <Brain className={iconClass} />;
      case 'female':
      case 'male':
        return <User className={iconClass} />;
      case 'microscope':
        return <Microscope className={iconClass} />;
      default:
        return <Stethoscope className={iconClass} />;
    }
  };

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <motion.div
      className="specialty-card rounded-xl shadow-md overflow-hidden h-64 relative"
      whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}
      onClick={toggleDetails}
    >
      <div className={`h-full flex flex-col ${getBgColor()}`}>
        <div className="p-6 flex-grow">
          <div className="text-center">
            <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center bg-white ${getBorderColor()} border shadow-sm`}>
              {renderIcon()}
            </div>
            
            <h3 className={`text-xl font-bold ${getTextColor()} mb-3`}>{specialty.name}</h3>
            <p className="text-gray-600 text-sm line-clamp-2">{specialty.description}</p>
          </div>
        </div>
        
        <div className={`p-3 bg-gradient-to-t from-white/90 to-transparent absolute bottom-0 left-0 right-0 flex justify-center`}>
          <Link 
            to={`/doctors`}
            state={{ specialty: specialty.name }}
            className={`px-4 py-2 rounded-full text-sm font-medium ${getTextColor()} border ${getBorderColor()} bg-white/50 hover:bg-white transition-colors`}
            onClick={(e) => e.stopPropagation()}
          >
            عرض الأطباء
          </Link>
        </div>
        
        {/* Details overlay - now toggled by click instead of hover */}
        <motion.div 
          className="specialty-details absolute inset-0 bg-gradient-to-t from-white/95 via-white/95 to-white/90 p-6 flex flex-col justify-between"
          initial={{ opacity: 0 }}
          animate={{ opacity: showDetails ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{ pointerEvents: showDetails ? 'auto' : 'none' }}
        >
          <div>
            <div className={`w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center bg-white ${getBorderColor()} border shadow-sm`}>
              {renderIcon()}
            </div>
            <h3 className={`text-xl font-bold text-center ${getTextColor()} mb-3`}>{specialty.name}</h3>
            <p className="text-gray-700 text-sm mb-4 text-center line-clamp-4">{specialty.details}</p>
          </div>
          
          <div className="flex justify-center">
            <Link 
              to={`/doctors`}
              state={{ specialty: specialty.name }}
              className={`px-5 py-2 rounded-full text-sm font-medium bg-brand text-white hover:bg-brand-dark transition-colors shadow-sm`}
              onClick={(e) => e.stopPropagation()}
            >
              عرض الأطباء
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SpecialtyCard;
