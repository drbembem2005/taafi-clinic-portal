
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getSpecialties, Specialty } from '@/services/specialtyService';
import { 
  Stethoscope, Heart, Brain, Baby, User, 
  Microscope, Sparkles, Syringe, Ear, Bone, Activity 
} from 'lucide-react';

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
    if (!specialty.icon) return <Stethoscope className="w-8 h-8" />;
    
    switch(specialty.icon) {
      case 'heart':
        return <Heart className="w-8 h-8" />;
      case 'brain':
        return <Brain className="w-8 h-8" />;
      case 'baby':
        return <Baby className="w-8 h-8" />;
      case 'male':
      case 'female':
        return <User className="w-8 h-8" />;
      case 'microscope':
        return <Microscope className="w-8 h-8" />;
      case 'sparkles':
        return <Sparkles className="w-8 h-8" />;
      case 'syringe':
        return <Syringe className="w-8 h-8" />;
      case 'ear':
        return <Ear className="w-8 h-8" />;
      case 'bone':
        return <Bone className="w-8 h-8" />;
      case 'stomach':
      case 'heartbeat':
        return <Activity className="w-8 h-8" />;
      default:
        return <Stethoscope className="w-8 h-8" />;
    }
  };
  
  // Function to get background gradient based on specialty
  const getSpecialtyBackground = (specialtyId: number) => {
    // Create visually distinct gradients for different specialties
    const gradients = [
      'from-blue-500 to-blue-400',
      'from-purple-500 to-purple-400',
      'from-pink-500 to-pink-400',
      'from-green-500 to-green-400',
      'from-yellow-500 to-yellow-400',
      'from-red-500 to-red-400',
      'from-indigo-500 to-indigo-400',
      'from-teal-500 to-teal-400',
      'from-orange-500 to-orange-400',
      'from-sky-500 to-sky-400',
      'from-rose-500 to-rose-400',
      'from-emerald-500 to-emerald-400',
      'from-cyan-500 to-cyan-400',
      'from-fuchsia-500 to-fuchsia-400'
    ];
    
    return gradients[specialtyId % gradients.length];
  };

  // Handle specialty selection with auto-navigation - now improved to be more reliable
  const handleSpecialtySelect = (specialty: Specialty) => {
    onSelectSpecialty(specialty);
    
    // Auto navigate to next step immediately after selecting specialty
    setTimeout(() => {
      const nextButton = document.querySelector('button[aria-label="التالي"]') || 
                         document.querySelector('button[aria-label="التالي"]') ||
                         document.querySelector('button:contains("التالي")') ||
                         document.querySelector('button.next-step-button'); // Backup class
      
      if (nextButton) {
        // Using click() to follow the natural flow of the application
        (nextButton as HTMLButtonElement).click();
      } else {
        console.log("Navigation button not found - please check selector");
      }
    }, 300);
  };
  
  if (loading) {
    return (
      <div className={`${className} p-5 border rounded-xl bg-white shadow-sm`}>
        <h2 className="text-xl font-bold mb-6">التخصصات</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-28 bg-gray-100 animate-pulse rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className={`${className} p-5 border rounded-xl bg-white shadow-sm`}>
      <h2 className="text-xl font-bold mb-6">التخصصات</h2>
      
      {specialties.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
          {specialties.map((specialty) => (
            <motion.div
              key={specialty.id}
              className={`cursor-pointer rounded-xl transition-all overflow-hidden ${
                selectedSpecialtyId === specialty.id 
                  ? 'ring-2 ring-brand shadow-lg scale-[1.03]' 
                  : 'hover:shadow-md'
              }`}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSpecialtySelect(specialty)}
            >
              <div className={`h-full flex flex-col ${
                selectedSpecialtyId === specialty.id 
                  ? 'bg-gradient-to-br from-brand to-brand-light text-white' 
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-800 border border-gray-100'
              }`}>
                <div className={`w-full flex items-center justify-center p-3 ${
                  selectedSpecialtyId === specialty.id ? 'bg-white/10' : ''
                }`}>
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                    selectedSpecialtyId === specialty.id 
                      ? 'bg-white/20' 
                      : `bg-gradient-to-br ${getSpecialtyBackground(specialty.id)} bg-opacity-20`
                  }`}>
                    <div className={selectedSpecialtyId === specialty.id ? 'text-white' : 'text-gray-700'}>
                      {getSpecialtyIcon(specialty)}
                    </div>
                  </div>
                </div>
                <div className="text-center p-3 flex-1 flex flex-col justify-center">
                  <h3 className={`font-medium text-base ${
                    selectedSpecialtyId === specialty.id ? 'text-white' : 'text-gray-800'
                  }`}>{specialty.name}</h3>
                </div>
                {selectedSpecialtyId === specialty.id && (
                  <div className="bg-white/20 p-2 text-center">
                    <span className="text-xs">تم الاختيار</span>
                  </div>
                )}
              </div>
            </motion.div>
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
