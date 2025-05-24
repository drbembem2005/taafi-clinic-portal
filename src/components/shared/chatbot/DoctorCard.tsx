
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { User, Calendar } from 'lucide-react';

interface DoctorCardProps {
  doctor: any;
  onBook: (doctorId: number, doctorName: string) => void;
}

const DoctorCard = ({ doctor, onBook }: DoctorCardProps) => {
  return (
    <Card className="p-3 hover:shadow-md transition-shadow border border-gray-100">
      <div className="flex items-center gap-3">
        <Avatar className="h-12 w-12 border border-gray-200">
          {doctor.image ? (
            <img src={doctor.image} alt={doctor.name} className="object-cover" />
          ) : (
            <div className="bg-brand/10 h-full w-full rounded-full flex items-center justify-center">
              <User size={20} className="text-brand" />
            </div>
          )}
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm text-gray-900">{doctor.name}</h4>
          <p className="text-xs text-gray-600">{doctor.specialty || 'طبيب متخصص'}</p>
          {doctor.fees?.examination && (
            <p className="text-xs text-brand font-medium mt-1">
              كشف: {doctor.fees.examination} جنيه
            </p>
          )}
        </div>
        
        <Button 
          size="sm"
          onClick={() => onBook(doctor.id, doctor.name)}
          className="bg-brand hover:bg-brand-dark text-white px-3 py-1 h-8"
        >
          <Calendar size={14} className="ml-1" />
          احجز
        </Button>
      </div>
    </Card>
  );
};

export default DoctorCard;
