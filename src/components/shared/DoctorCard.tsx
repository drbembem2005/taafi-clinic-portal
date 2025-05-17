
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Calendar, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Doctor } from '@/services/doctorService';

interface DoctorCardProps {
  doctor: Doctor;
  specialtyName?: string;
}

const DoctorCard = ({ doctor, specialtyName }: DoctorCardProps) => {
  const [showBioDialog, setShowBioDialog] = useState(false);
  const navigate = useNavigate();
  
  const handleBookAppointment = () => {
    // Navigate to the booking page with doctor ID as query parameter
    navigate(`/booking?doctor_id=${doctor.id}`);
  };
  
  return (
    <>
      <Card className="h-full overflow-hidden transition-all hover:shadow-lg border border-gray-200">
        <CardContent className="p-0">
          <div className="relative pt-0">
            <div className="h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
              {doctor.image ? (
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Users className="h-20 w-20 text-gray-300" />
              )}
            </div>
          </div>
          
          <div className="p-4">
            <h3 className="font-bold text-lg mb-1">{doctor.name}</h3>
            <p className="text-gray-500 text-sm mb-3 line-clamp-2">{doctor.bio || 'طبيب متخصص'}</p>
            
            {specialtyName && (
              <div className="text-xs mb-3 text-gray-500">{specialtyName}</div>
            )}
            
            <div className="flex space-x-2 space-x-reverse mb-4">
              <Button
                variant="outline"
                size="sm"
                className="text-xs px-2 text-brand"
                onClick={() => setShowBioDialog(true)}
              >
                <Info className="h-3 w-3 ml-1" />
                نبذة عن الطبيب
              </Button>
            </div>
            
            <Button 
              className="w-full bg-brand hover:bg-brand-dark flex items-center justify-center gap-2"
              onClick={handleBookAppointment}
            >
              <Calendar className="h-4 w-4" />
              <span>حجز موعد</span>
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Doctor Bio Dialog */}
      <Dialog open={showBioDialog} onOpenChange={setShowBioDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl mb-2">د. {doctor.name}</DialogTitle>
            <DialogDescription>
              <div className="mt-4 space-y-4">
                <div className="flex items-center">
                  <div className="w-20 h-20 rounded-full overflow-hidden mr-4 bg-gray-100 flex-shrink-0">
                    {doctor.image ? (
                      <img
                        src={doctor.image}
                        alt={doctor.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Users className="h-10 w-10 text-gray-300" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-grow">
                    <h3 className="text-lg font-bold">{doctor.name}</h3>
                    <p className="text-gray-500">{specialtyName || 'أخصائي'}</p>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-md">
                  <h4 className="font-bold text-blue-900 mb-2">نبذة عن الطبيب:</h4>
                  <p className="text-blue-800">
                    {doctor.bio || 'طبيب متخصص ذو خبرة واسعة في مجال تخصصه. يسعى دائماً لتقديم أفضل رعاية طبية ممكنة للمرضى.'}
                  </p>
                </div>
                
                {doctor.experience && (
                  <div className="flex items-center text-gray-600">
                    <span className="font-medium ml-2">الخبرة:</span>
                    <span>{doctor.experience} سنوات</span>
                  </div>
                )}
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6 flex space-x-2 space-x-reverse">
            <Button 
              onClick={() => setShowBioDialog(false)} 
              variant="outline" 
              className="flex-1"
            >
              إغلاق
            </Button>
            <Button 
              className="flex-1 bg-brand hover:bg-brand-dark"
              onClick={() => {
                setShowBioDialog(false);
                handleBookAppointment();
              }}
            >
              <Calendar className="h-4 w-4 ml-2" />
              حجز موعد
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DoctorCard;
