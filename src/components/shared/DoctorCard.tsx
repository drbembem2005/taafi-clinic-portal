
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Doctor as ServiceDoctor } from '@/services/doctorService';
import { weekDays, dayMappings } from '@/data/doctors';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Phone, Calendar, MessageCircle } from 'lucide-react';

interface DoctorWithSpecialty extends ServiceDoctor {
  specialty: string;
}

interface DoctorCardProps {
  doctor: DoctorWithSpecialty;
  compact?: boolean;
}

const DoctorCard = ({ doctor, compact = false }: DoctorCardProps) => {
  const [showDialog, setShowDialog] = useState(false);
  
  // Get available days from schedule
  const getAvailableDays = () => {
    return Object.entries(doctor.schedule)
      .filter(([_, times]) => times.length > 0)
      .map(([day, _]) => {
        // Map English day key back to Arabic
        const arabicDay = Object.keys(dayMappings).find(
          (key) => dayMappings[key as keyof typeof dayMappings] === day
        );
        return arabicDay || day;
      });
  };
  
  const availableDays = getAvailableDays();

  // Format fees
  const formatFee = (fee: number | string | null) => {
    if (fee === null) return 'غير متاح';
    return typeof fee === 'number' ? `${fee} جنيه` : fee;
  };

  const openWhatsApp = () => {
    const message = `مرحباً، أود حجز موعد مع الدكتور ${doctor.name} (${doctor.specialty})`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/201119007403?text=${encodedMessage}`, '_blank');
  };

  if (compact) {
    return (
      <motion.div 
        className="doctor-card bg-white rounded-lg shadow-md overflow-hidden"
        whileHover={{ y: -5 }}
      >
        <div className="p-4">
          <div className="flex items-center mb-3">
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-3">
              {doctor.image ? (
                <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              )}
            </div>
            <div>
              <h3 className="font-bold text-gray-900">{doctor.name}</h3>
              <p className="text-sm text-gray-600">{doctor.specialty}</p>
            </div>
          </div>
          
          <div className="mt-3 flex justify-between">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs"
              onClick={() => setShowDialog(true)}
            >
              التفاصيل
            </Button>
            <Button 
              size="sm" 
              className="bg-green-600 hover:bg-green-700 text-white text-xs"
              onClick={openWhatsApp}
            >
              احجز الآن
            </Button>
          </div>
        </div>
        
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="p-0 max-w-[95%] sm:max-w-md mx-auto rounded-lg overflow-hidden">
            <DoctorDetails doctor={doctor} onBooking={openWhatsApp} />
          </DialogContent>
        </Dialog>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="doctor-card bg-white rounded-lg shadow-md overflow-hidden"
      whileHover={{ y: -5 }}
    >
      <div className="grid md:grid-cols-4">
        <div className="md:col-span-1 bg-gray-100 flex items-center justify-center p-4">
          <div className="w-32 h-32 rounded-full bg-white shadow-inner flex items-center justify-center overflow-hidden">
            {doctor.image ? (
              <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            )}
          </div>
        </div>
        
        <div className="md:col-span-3 p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{doctor.name}</h3>
          <p className="text-brand font-medium mb-3">{doctor.specialty}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <h4 className="font-bold text-gray-700">رسوم الكشف:</h4>
              <p className="text-gray-600">{formatFee(doctor.fees.examination)}</p>
            </div>
            <div>
              <h4 className="font-bold text-gray-700">رسوم الاستشارة:</h4>
              <p className="text-gray-600">{formatFee(doctor.fees.consultation)}</p>
            </div>
          </div>

          <div className="mb-4">
            <h4 className="font-bold text-gray-700 mb-1">أيام العمل:</h4>
            <div className="flex flex-wrap gap-1">
              {availableDays.length > 0 ? (
                availableDays.map((day, index) => (
                  <span key={index} className="bg-blue-50 text-brand px-2 py-1 rounded text-sm">
                    {day}
                  </span>
                ))
              ) : (
                <span className="text-gray-500">يرجى الاتصال لمعرفة المواعيد</span>
              )}
            </div>
          </div>
          
          {doctor.bio && (
            <div className="mb-4">
              <h4 className="font-bold text-gray-700 mb-1">نبذة:</h4>
              <p className="text-gray-600 line-clamp-2">{doctor.bio}</p>
            </div>
          )}
          
          <div className="flex flex-wrap gap-3 mt-4">
            <Button 
              variant="outline" 
              onClick={() => setShowDialog(true)}
            >
              عرض التفاصيل
            </Button>
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={openWhatsApp}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              احجز الآن
            </Button>
          </div>
        </div>
      </div>
      
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="p-0 max-w-[95%] sm:max-w-md mx-auto rounded-lg overflow-hidden">
          <DoctorDetails doctor={doctor} onBooking={openWhatsApp} />
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

// Redesigned DoctorDetails component for the dialog
const DoctorDetails = ({ doctor, onBooking }: { doctor: DoctorWithSpecialty; onBooking: () => void }) => {
  const formatFee = (fee: number | string | null) => {
    if (fee === null) return 'غير متاح';
    return typeof fee === 'number' ? `${fee} جنيه` : fee;
  };

  const getAvailableDays = () => {
    return Object.entries(doctor.schedule)
      .filter(([_, times]) => times.length > 0)
      .map(([day, _]) => {
        // Map English day key back to Arabic
        const arabicDay = Object.keys(dayMappings).find(
          (key) => dayMappings[key as keyof typeof dayMappings] === day
        );
        return arabicDay || day;
      });
  };
  
  const availableDays = getAvailableDays();
  
  return (
    <div className="overflow-hidden">
      {/* Header with doctor name and close button */}
      <div className="bg-brand text-white p-4 text-center relative">
        <h3 className="text-xl font-bold">{doctor.name}</h3>
        <p className="text-sm text-blue-100">{doctor.specialty}</p>
      </div>
      
      {/* Doctor details content */}
      <div className="p-4 max-h-[70vh] overflow-y-auto">
        {/* Fees section */}
        <div className="mb-4 bg-gray-50 p-3 rounded-lg">
          <h4 className="font-bold text-lg text-gray-800 mb-2 text-right">الرسوم</h4>
          <div className="flex justify-between items-center border-b border-gray-200 py-2">
            <span className="text-gray-900 font-medium">
              {formatFee(doctor.fees.examination)}
            </span>
            <span className="text-gray-600">رسوم الكشف:</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-900 font-medium">
              {doctor.fees.consultation 
                ? formatFee(doctor.fees.consultation)
                : 'غير متاح'}
            </span>
            <span className="text-gray-600">رسوم الاستشارة:</span>
          </div>
        </div>
        
        {/* Schedule section */}
        <div className="mb-4 bg-gray-50 p-3 rounded-lg">
          <h4 className="font-bold text-lg text-gray-800 mb-2 text-right">جدول المواعيد</h4>
          {availableDays.length > 0 ? (
            <div className="space-y-2">
              {availableDays.map((day, index) => {
                const englishDay = Object.entries(dayMappings)
                  .find(([k, _]) => k === day)?.[1];
                
                const times = englishDay ? doctor.schedule[englishDay] : [];
                
                return (
                  <div key={index} className="flex justify-between items-center border-b border-gray-200 pb-2">
                    <div className="flex flex-wrap gap-1 justify-end">
                      {times.map((time: string, timeIndex: number) => (
                        <span key={timeIndex} className="bg-blue-50 text-brand px-2 py-1 rounded text-sm">
                          {time}
                        </span>
                      ))}
                    </div>
                    <span className="font-medium text-gray-700">{day}:</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-center">يرجى الاتصال بالعيادة لمعرفة المواعيد المتاحة.</p>
          )}
        </div>
        
        {/* Bio section */}
        {doctor.bio && (
          <div className="mb-4 bg-gray-50 p-3 rounded-lg">
            <h4 className="font-bold text-lg text-gray-800 mb-2 text-right">نبذة عن الطبيب</h4>
            <p className="text-gray-700 text-right">{doctor.bio}</p>
          </div>
        )}
      </div>
      
      {/* Call to action button */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <Button 
          onClick={onBooking}
          className="bg-green-600 hover:bg-green-700 text-white w-full"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
          </svg>
          احجز الآن عبر واتساب
        </Button>
      </div>
    </div>
  );
};

export default DoctorCard;
