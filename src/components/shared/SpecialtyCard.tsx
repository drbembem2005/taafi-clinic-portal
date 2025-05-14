
import { motion } from 'framer-motion';
import { Specialty } from '@/data/specialties';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

interface SpecialtyCardProps {
  specialty: Specialty;
}

const SpecialtyCard = ({ specialty }: SpecialtyCardProps) => {
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

  return (
    <motion.div
      className={`specialty-card rounded-xl shadow-lg overflow-hidden relative h-64 border ${getBorderColor()}`}
      whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}
    >
      <div className={`p-6 h-full flex flex-col ${getBgColor()}`}>
        <div className="text-center mb-4 relative">
          <div className={`w-18 h-18 rounded-full flex items-center justify-center mx-auto mb-4 border-2 ${getBorderColor()} p-4`}>
            {specialty.icon === 'heart' ? (
              <Heart className={`h-10 w-10 ${getTextColor()}`} />
            ) : specialty.icon === 'baby' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-10 w-10 ${getTextColor()}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            ) : specialty.icon === 'brain' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-10 w-10 ${getTextColor()}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            ) : specialty.icon === 'female' || specialty.icon === 'male' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-10 w-10 ${getTextColor()}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-10 w-10 ${getTextColor()}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            )}
          </div>
          <h3 className={`text-xl font-bold ${getTextColor()} mb-2`}>{specialty.name}</h3>
          <p className="text-gray-600 text-sm">{specialty.description}</p>
        </div>

        <motion.div 
          className="specialty-details absolute inset-0 bg-white/95 text-center flex flex-col justify-center p-6"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className={`text-xl font-bold mb-2 ${getTextColor()}`}>{specialty.name}</div>
          <p className="text-gray-700 mb-4 text-sm">{specialty.details}</p>
          <Link 
            to={`/doctors`} 
            state={{ specialty: specialty.name }}
            className={`mt-3 inline-block bg-brand text-white px-4 py-2 rounded-md font-medium hover:bg-brand-dark transition-colors`}
          >
            عرض الأطباء
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SpecialtyCard;
