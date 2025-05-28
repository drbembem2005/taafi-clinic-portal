
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { User, Calendar, Star, Award } from 'lucide-react';

interface DoctorCardProps {
  doctor: any;
  onBook: (doctorId: number, doctorName: string) => void;
}

const DoctorCard = ({ doctor, onBook }: DoctorCardProps) => {
  const handleBookClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('🎯 DoctorCard: Book button clicked', {
      doctorId: doctor.id,
      doctorName: doctor.name,
      onBookExists: typeof onBook === 'function'
    });
    
    if (onBook && typeof onBook === 'function') {
      try {
        onBook(doctor.id, doctor.name);
        console.log('✅ DoctorCard: onBook called successfully');
      } catch (error) {
        console.error('❌ DoctorCard: Error calling onBook:', error);
      }
    } else {
      console.error('❌ DoctorCard: onBook function not available');
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -3 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card className="p-4 hover:shadow-xl transition-all duration-300 border-2 border-gray-100 hover:border-emerald-300 bg-gradient-to-br from-white to-emerald-50/30 backdrop-blur-sm relative overflow-hidden group cursor-pointer">
        {/* Background Pattern */}
        <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-emerald-100/50 to-transparent rounded-full transform -translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform duration-300"></div>
        
        <div className="flex items-center gap-4 relative">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="relative"
          >
            <Avatar className="h-14 w-14 border-3 border-white shadow-lg">
              {doctor.image ? (
                <img src={doctor.image} alt={doctor.name} className="object-cover" />
              ) : (
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 h-full w-full rounded-full flex items-center justify-center">
                  <User size={24} className="text-white" />
                </div>
              )}
            </Avatar>
            
            {/* Status indicator */}
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </div>
          </motion.div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-bold text-sm text-gray-900">{doctor.name}</h4>
              <Award size={14} className="text-yellow-500" />
            </div>
            
            <p className="text-xs text-gray-600 mb-1 flex items-center gap-1 line-clamp-2">
              <Star size={12} className="text-emerald-500 flex-shrink-0" />
              {doctor.bio || doctor.specialty || 'طبيب متخصص'}
            </p>
            
            {doctor.fees?.examination && (
              <motion.p 
                className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded-full inline-block"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
              >
                كشف: {doctor.fees.examination} جنيه
              </motion.p>
            )}
          </div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              size="sm"
              onClick={handleBookClick}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-4 py-2 h-9 rounded-xl shadow-lg font-medium transition-all duration-200"
              type="button"
            >
              <Calendar size={14} className="ml-1" />
              احجز
            </Button>
          </motion.div>
        </div>
        
        {/* Hover effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
      </Card>
    </motion.div>
  );
};

export default DoctorCard;
