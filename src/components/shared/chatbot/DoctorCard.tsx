
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { User, Calendar, Star, Award, Clock, Stethoscope } from 'lucide-react';

interface DoctorCardProps {
  doctor: any;
  onBook: (doctorId: number, doctorName: string) => void;
}

const DoctorCard = ({ doctor, onBook }: DoctorCardProps) => {
  const handleBookClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('🎯 ChatBot DoctorCard: Book button clicked', {
      doctorId: doctor.id,
      doctorName: doctor.name,
      onBookExists: typeof onBook === 'function'
    });
    
    if (onBook && typeof onBook === 'function') {
      try {
        onBook(doctor.id, doctor.name);
        console.log('✅ ChatBot DoctorCard: onBook called successfully');
      } catch (error) {
        console.error('❌ ChatBot DoctorCard: Error calling onBook:', error);
      }
    } else {
      console.error('❌ ChatBot DoctorCard: onBook function not available');
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="w-full"
    >
      <Card className="p-4 bg-gradient-to-br from-white via-blue-50/30 to-emerald-50/30 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden group">
        {/* Header with doctor info */}
        <div className="flex items-start gap-3 mb-3">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="relative flex-shrink-0"
          >
            <Avatar className="h-16 w-16 border-2 border-white shadow-md">
              {doctor.image ? (
                <img src={doctor.image} alt={doctor.name} className="object-cover w-full h-full" />
              ) : (
                <div className="bg-gradient-to-br from-blue-500 to-emerald-600 h-full w-full flex items-center justify-center">
                  <User size={20} className="text-white" />
                </div>
              )}
            </Avatar>
            
            {/* Online status indicator */}
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </div>
          </motion.div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-bold text-base text-gray-900 truncate">{doctor.name}</h4>
              <Award size={16} className="text-yellow-500 flex-shrink-0" />
            </div>
            
            <div className="flex items-center gap-1 mb-2">
              <Stethoscope size={14} className="text-blue-500 flex-shrink-0" />
              <p className="text-sm text-gray-600 line-clamp-1">
                {doctor.specialty || 'طبيب متخصص'}
              </p>
            </div>
            
            {doctor.bio && (
              <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                {doctor.bio}
              </p>
            )}
          </div>
        </div>
        
        {/* Fees and rating section */}
        <div className="flex items-center justify-between mb-3 p-2 bg-white/60 rounded-lg">
          <div className="flex items-center gap-4">
            {doctor.fees?.examination && (
              <div className="flex items-center gap-1">
                <Clock size={14} className="text-emerald-600" />
                <div>
                  <p className="text-xs text-gray-500">كشف</p>
                  <p className="text-sm font-bold text-emerald-600">{doctor.fees.examination} ج</p>
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-1">
              <Star size={14} className="text-yellow-500" />
              <div>
                <p className="text-xs text-gray-500">تقييم</p>
                <p className="text-sm font-bold text-gray-700">4.8</p>
              </div>
            </div>
          </div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              onClick={handleBookClick}
              className="bg-gradient-to-r from-blue-500 to-emerald-600 hover:from-blue-600 hover:to-emerald-700 text-white px-6 py-2 h-10 rounded-lg shadow-md font-medium transition-all duration-200 flex items-center gap-2"
              type="button"
            >
              <Calendar size={16} />
              احجز الآن
            </Button>
          </motion.div>
        </div>
        
        {/* Quick info badges */}
        <div className="flex flex-wrap gap-2">
          <div className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
            <Clock size={12} />
            متاح اليوم
          </div>
          <div className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
            <Star size={12} />
            خبرة 10+ سنوات
          </div>
        </div>
        
        {/* Hover effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none"></div>
      </Card>
    </motion.div>
  );
};

export default DoctorCard;
