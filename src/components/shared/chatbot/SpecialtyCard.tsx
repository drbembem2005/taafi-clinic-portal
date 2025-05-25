
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Stethoscope, ChevronLeft, Sparkles } from 'lucide-react';

interface SpecialtyCardProps {
  specialty: any;
  onSelect: (id: number, name: string) => void;
}

const SpecialtyCard = ({ specialty, onSelect }: SpecialtyCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card 
        className="p-4 hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-gray-100 hover:border-blue-300 bg-gradient-to-br from-white to-blue-50/30 backdrop-blur-sm relative overflow-hidden group"
        onClick={() => onSelect(specialty.id, specialty.name)}
      >
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-blue-100/50 to-transparent rounded-full transform translate-x-6 -translate-y-6 group-hover:scale-110 transition-transform duration-300"></div>
        
        <div className="flex items-center gap-4 relative">
          <motion.div 
            className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg"
            whileHover={{ rotate: 5 }}
          >
            <Stethoscope size={20} className="text-white" />
          </motion.div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-bold text-sm text-gray-900">{specialty.name}</h4>
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles size={14} className="text-yellow-500" />
              </motion.div>
            </div>
            <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">{specialty.description}</p>
          </div>
          
          <motion.div
            className="text-blue-500 group-hover:text-blue-600"
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronLeft size={18} />
          </motion.div>
        </div>
        
        {/* Hover effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
      </Card>
    </motion.div>
  );
};

export default SpecialtyCard;
