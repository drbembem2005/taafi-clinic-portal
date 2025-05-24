
import { Card } from '@/components/ui/card';
import { Stethoscope, ChevronLeft } from 'lucide-react';

interface SpecialtyCardProps {
  specialty: any;
  onSelect: (id: number, name: string) => void;
}

const SpecialtyCard = ({ specialty, onSelect }: SpecialtyCardProps) => {
  return (
    <Card 
      className="p-3 hover:shadow-md transition-all cursor-pointer border border-gray-100 hover:border-brand/30 hover:bg-brand/5"
      onClick={() => onSelect(specialty.id, specialty.name)}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center flex-shrink-0">
          <Stethoscope size={18} className="text-brand" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm text-gray-900 mb-1">{specialty.name}</h4>
          <p className="text-xs text-gray-600 line-clamp-2">{specialty.description}</p>
        </div>
        
        <ChevronLeft size={16} className="text-gray-400" />
      </div>
    </Card>
  );
};

export default SpecialtyCard;
