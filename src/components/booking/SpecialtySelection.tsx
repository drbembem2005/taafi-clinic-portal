
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getSpecialties, Specialty } from '@/services/specialtyService';
import { Stethoscope, Heart, Brain, Baby, User, Microscope } from 'lucide-react';

interface SpecialtySelectionProps {
  selectedSpecialtyId: number | null;
  onSelectSpecialty: (specialty: Specialty) => void;
  className?: string;
}

const SpecialtySelection = ({ 
  selectedSpecialtyId, 
  onSelectSpecialty,
  className = ''
}: SpecialtySelectionProps) => {
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadSpecialties = async () => {
      try {
        const data = await getSpecialties();
        setSpecialties(data);
      } catch (error) {
        console.error('Failed to load specialties:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadSpecialties();
  }, []);
  
  // Get the icon based on specialty name or icon property
  const getSpecialtyIcon = (specialty: Specialty) => {
    if (!specialty.icon) return <Stethoscope className="w-6 h-6" />;
    
    switch(specialty.icon) {
      case 'heart':
        return <Heart className="w-6 h-6" />;
      case 'brain':
        return <Brain className="w-6 h-6" />;
      case 'baby':
        return <Baby className="w-6 h-6" />;
      case 'male':
      case 'female':
        return <User className="w-6 h-6" />;
      case 'microscope':
        return <Microscope className="w-6 h-6" />;
      default:
        return <Stethoscope className="w-6 h-6" />;
    }
  };
  
  if (loading) {
    return (
      <div className={`${className} p-5 border rounded-lg bg-white shadow-sm`}>
        <h2 className="text-lg font-bold mb-6">التخصصات</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-20 bg-gray-100 animate-pulse rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className={`${className} p-5 border rounded-lg bg-white shadow-sm`}>
      <h2 className="text-lg font-bold mb-6">التخصصات</h2>
      
      {specialties.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {specialties.map((specialty) => (
            <motion.button
              key={specialty.id}
              className={`flex items-center p-4 rounded-lg transition-all ${
                selectedSpecialtyId === specialty.id 
                  ? 'bg-gradient-to-r from-brand to-brand-light text-white shadow-md' 
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-800 border border-gray-200'
              }`}
              whileHover={{ scale: 1.02, boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectSpecialty(specialty)}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-3 ${
                selectedSpecialtyId === specialty.id ? 'bg-white/20' : 'bg-brand/10'
              }`}>
                {getSpecialtyIcon(specialty)}
              </div>
              <div className="text-right">
                <h3 className="font-medium text-lg">{specialty.name}</h3>
                <p className={`text-xs ${selectedSpecialtyId === specialty.id ? 'text-white/80' : 'text-gray-500'}`}>
                  {specialty.description.length > 50 
                    ? specialty.description.substring(0, 50) + '...'
                    : specialty.description}
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <Stethoscope className="w-12 h-12 mx-auto text-gray-400 mb-2" />
          <p>لا توجد تخصصات متاحة حاليًا</p>
        </div>
      )}
    </div>
  );
};

export default SpecialtySelection;
