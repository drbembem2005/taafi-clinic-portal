
import { motion } from 'framer-motion';
import { Specialty } from '@/data/specialties';
import { Link } from 'react-router-dom';

interface SpecialtyCardProps {
  specialty: Specialty;
}

const SpecialtyCard = ({ specialty }: SpecialtyCardProps) => {
  return (
    <motion.div
      className="specialty-card bg-white rounded-lg shadow-md overflow-hidden relative h-64"
      whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}
    >
      <div className="p-6 h-full flex flex-col">
        <div className="text-center mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
            {/* Simple placeholder icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mt-3">{specialty.name}</h3>
          <p className="text-gray-600 mt-2">{specialty.description}</p>
        </div>

        <div className="specialty-details absolute inset-0 bg-brand/95 text-white p-6 flex flex-col justify-center items-center text-center">
          <h3 className="text-xl font-bold mb-4">{specialty.name}</h3>
          <p>{specialty.details}</p>
          <Link 
            to={`/doctors`} 
            state={{ specialty: specialty.name }}
            className="mt-4 inline-block bg-white text-brand px-4 py-2 rounded-md font-medium hover:bg-gray-100 transition-colors"
          >
            عرض الأطباء
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default SpecialtyCard;
