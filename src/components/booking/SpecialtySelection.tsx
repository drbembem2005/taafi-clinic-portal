
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
    if (!specialty.icon) return <Stethoscope className="w-5 h-5" />;
    
    switch(specialty.icon) {
      case 'heart':
        return <Heart className="w-5 h-5" />;
      case 'brain':
        return <Brain className="w-5 h-5" />;
      case 'baby':
        return <Baby className="w-5 h-5" />;
      case 'male':
      case 'female':
        return <User className="w-5 h-5" />;
      case 'microscope':
        return <Microscope className="w-5 h-5" />;
      default:
        return <Stethoscope className="w-5 h-5" />;
    }
  };
  
  if (loading) {
    return (
      <div className={`${className} p-4 border rounded-lg`}>
        <h2 className="text-lg font-bold mb-4">التخصصات</h2>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-10 bg-gray-100 animate-pulse rounded-md"></div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className={`${className} p-4 border rounded-lg bg-gray-50`}>
      <h2 className="text-lg font-bold mb-4">التخصصات</h2>
      
      {specialties.length > 0 ? (
        <div className="space-y-2">
          {specialties.map((specialty) => (
            <motion.button
              key={specialty.id}
              className={`flex items-center w-full px-3 py-2.5 rounded-md ${
                selectedSpecialtyId === specialty.id 
                  ? 'bg-brand text-white' 
                  : 'bg-white hover:bg-gray-100 text-gray-800'
              } transition-colors shadow-sm`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectSpecialty(specialty)}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                selectedSpecialtyId === specialty.id ? 'bg-white/20' : 'bg-gray-100'
              }`}>
                {getSpecialtyIcon(specialty)}
              </div>
              <span className="font-medium">{specialty.name}</span>
            </motion.button>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-gray-500">
          لا توجد تخصصات متاحة حاليًا
        </div>
      )}
    </div>
  );
};

export default SpecialtySelection;
