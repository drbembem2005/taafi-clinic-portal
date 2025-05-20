
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getSpecialties, Specialty } from '@/services/specialtyService';
import { 
  Stethoscope, Heart, Brain, Baby, User, 
  Microscope, Sparkles, Syringe, Ear, Bone, Activity,
  Search, Loader2
} from 'lucide-react';
import { Input } from '@/components/ui/input';

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
  const [filteredSpecialties, setFilteredSpecialties] = useState<Specialty[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    const loadSpecialties = async () => {
      try {
        const data = await getSpecialties();
        setSpecialties(data);
        setFilteredSpecialties(data);
      } catch (error) {
        console.error('Failed to load specialties:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadSpecialties();
  }, []);
  
  // Filter specialties based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredSpecialties(specialties);
    } else {
      const filtered = specialties.filter(specialty => 
        specialty.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSpecialties(filtered);
    }
  }, [searchQuery, specialties]);
  
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
  
  // Create visually distinct color schemes for different specialties
  const getSpecialtyColorScheme = (specialtyId: number) => {
    const colorSchemes = [
      { bg: 'bg-blue-500', lightBg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200', hover: 'hover:bg-blue-50' },
      { bg: 'bg-purple-500', lightBg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200', hover: 'hover:bg-purple-50' },
      { bg: 'bg-pink-500', lightBg: 'bg-pink-100', text: 'text-pink-800', border: 'border-pink-200', hover: 'hover:bg-pink-50' },
      { bg: 'bg-green-500', lightBg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200', hover: 'hover:bg-green-50' },
      { bg: 'bg-yellow-500', lightBg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200', hover: 'hover:bg-yellow-50' },
      { bg: 'bg-red-500', lightBg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200', hover: 'hover:bg-red-50' },
      { bg: 'bg-indigo-500', lightBg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-200', hover: 'hover:bg-indigo-50' },
      { bg: 'bg-teal-500', lightBg: 'bg-teal-100', text: 'text-teal-800', border: 'border-teal-200', hover: 'hover:bg-teal-50' },
      { bg: 'bg-orange-500', lightBg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-200', hover: 'hover:bg-orange-50' },
    ];
    
    return colorSchemes[specialtyId % colorSchemes.length];
  };

  // Handle specialty selection with auto-navigation
  const handleSpecialtySelect = (specialty: Specialty) => {
    onSelectSpecialty(specialty);
    
    // Auto navigate to next step immediately after selecting specialty
    setTimeout(() => {
      const nextButton = document.querySelector('button[aria-label="التالي"]') || 
                         document.querySelector('button:contains("التالي")') ||
                         document.querySelector('button.next-step-button');
      
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
      <div className={`${className} p-6 rounded-xl flex flex-col items-center justify-center h-64`}>
        <Loader2 className="h-10 w-10 text-brand animate-spin mb-4" />
        <p className="text-gray-500">جاري تحميل التخصصات...</p>
      </div>
    );
  }
  
  return (
    <div className={`${className}`}>
      <div className="relative mb-6">
        <Input
          type="text"
          placeholder="ابحث عن التخصص..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pr-10 py-6 text-base rounded-xl"
        />
        <Search className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 h-5 w-5" />
      </div>
      
      {filteredSpecialties.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <AnimatePresence>
            {filteredSpecialties.map((specialty) => {
              const colorScheme = getSpecialtyColorScheme(specialty.id);
              const isSelected = selectedSpecialtyId === specialty.id;
              
              return (
                <motion.div
                  key={specialty.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  whileHover={{ 
                    scale: 1.03,
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                    y: -5
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSpecialtySelect(specialty)}
                  className={`
                    relative cursor-pointer rounded-xl overflow-hidden
                    ${isSelected ? 'ring-2 ring-brand shadow-lg' : 'shadow-sm hover:shadow-md'}
                    transition-all duration-300
                  `}
                >
                  <div className={`
                    h-full flex items-center p-4 border
                    ${isSelected 
                      ? 'bg-brand text-white border-brand' 
                      : `bg-white ${colorScheme.hover} ${colorScheme.border}`
                    }
                  `}>
                    <div className={`
                      w-14 h-14 rounded-full flex items-center justify-center mr-4
                      ${isSelected 
                        ? 'bg-white/20' 
                        : colorScheme.lightBg
                      }
                    `}>
                      <div className={isSelected ? 'text-white' : colorScheme.text}>
                        {getSpecialtyIcon(specialty)}
                      </div>
                    </div>
                    <div className="flex-grow">
                      <h3 className={`font-bold text-lg mb-1 ${
                        isSelected ? 'text-white' : 'text-gray-800'
                      }`}>{specialty.name}</h3>
                      <p className={`text-sm ${
                        isSelected ? 'text-white/80' : 'text-gray-500'
                      }`}>
                        اختر لعرض الأطباء
                      </p>
                    </div>
                    
                    {isSelected && (
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-3 right-3 w-6 h-6 bg-white rounded-full flex items-center justify-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <Stethoscope className="w-12 h-12 mx-auto text-gray-400 mb-3" />
          <p className="text-gray-500 mb-2">لا توجد تخصصات مطابقة</p>
          <button 
            onClick={() => setSearchQuery('')}
            className="text-sm text-brand hover:underline"
          >
            عرض كل التخصصات
          </button>
        </div>
      )}
    </div>
  );
};

export default SpecialtySelection;
