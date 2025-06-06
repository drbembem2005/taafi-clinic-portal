import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Doctor as ServiceDoctor } from '@/services/doctorService';
import { weekDays, dayMappings } from '@/data/doctors';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Phone, Calendar, MessageCircle, Clock, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import { openWhatsAppWithBookingDetails } from '@/services/bookingService';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from '@/hooks/use-toast';

interface DoctorWithSpecialty extends ServiceDoctor {
  specialty: string;
  schedule?: Record<string, string[]>;
}

interface DoctorCardProps {
  doctor: DoctorWithSpecialty;
  compact?: boolean;
}

// Function to get color for specialty badges
const getSpecialtyColorClass = (specialty: string) => {
  // Map of specialties to color classes
  const colorMap: Record<string, { bg: string, text: string, border: string }> = {
    "طب الأطفال وحديثي الولادة": { 
      bg: "bg-blue-50", 
      text: "text-blue-600", 
      border: "border-blue-100" 
    },
    "النساء والتوليد والعقم": { 
      bg: "bg-pink-50", 
      text: "text-pink-600", 
      border: "border-pink-100" 
    },
    "الجلدية والتجميل": { 
      bg: "bg-purple-50", 
      text: "text-purple-600", 
      border: "border-purple-100" 
    },
    "الجراحة العامة والمناظير": { 
      bg: "bg-red-50", 
      text: "text-red-600", 
      border: "border-red-100" 
    },
    "الذكورة وتأخر الإنجاب": { 
      bg: "bg-indigo-50", 
      text: "text-indigo-600", 
      border: "border-indigo-100" 
    },
    "الباطنة والسكري والغدد والكلى": { 
      bg: "bg-green-50", 
      text: "text-green-600", 
      border: "border-green-100" 
    },
    "الأمراض النفسية وتعديل السلوك": { 
      bg: "bg-violet-50", 
      text: "text-violet-600", 
      border: "border-violet-100" 
    },
  };

  // Default color if specialty not found in map
  const defaultColor = { 
    bg: "bg-gray-50", 
    text: "text-gray-600", 
    border: "border-gray-100" 
  };

  return colorMap[specialty] || defaultColor;
};

const DoctorCard = ({ doctor, compact = false }: DoctorCardProps) => {
  const [showDialog, setShowDialog] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  // Get specialty colors
  const specialtyColors = getSpecialtyColorClass(doctor.specialty);
  
  // Format fees
  const formatFee = (fee: number | string | null) => {
    if (fee === null) return 'غير متاح';
    return typeof fee === 'number' ? `${fee} جنيه` : fee;
  };

  const openWhatsApp = () => {
    // Directly open WhatsApp without showing a notification
    openWhatsAppWithBookingDetails({
      doctorName: doctor.name,
      specialtyName: doctor.specialty
    });
  };

  const redirectToBookingWizard = () => {
    // Navigate to booking page with doctor and specialty info
    navigate('/booking', { 
      state: { 
        selectedDoctor: doctor.id,
        selectedSpecialty: doctor.specialty_id
      } 
    });
  };

  // Get available days from doctor's schedule in a more compact format
  const getAvailableDays = () => {
    if (!doctor.schedule) return [];
    
    return Object.entries(doctor.schedule)
      .filter(([_, times]) => times && times.length > 0)
      .map(([day, times]) => {
        // Map English day key back to Arabic
        const arabicDay = Object.keys(dayMappings).find(
          (key) => dayMappings[key as keyof typeof dayMappings] === day
        );
        return { 
          day: arabicDay || day, 
          times: Array.isArray(times) ? times : [] 
        };
      });
  };
  
  // Get available days for this doctor
  const availableDays = getAvailableDays();

  // Completely redesigned compact doctor card
  if (compact) {
    return (
      <Card className="overflow-hidden border border-gray-200 hover:border-brand/30 transition-colors rounded-xl shadow-sm hover:shadow-md">
        <div className="relative">
          {/* Colored accent line at top */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand to-blue-500"></div>
          
          <div className="p-5">
            {/* Doctor info with avatar */}
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 rounded-full border-2 border-gray-100">
                {doctor.image ? (
                  <AvatarImage 
                    src={doctor.image} 
                    alt={doctor.name} 
                    className="object-cover" 
                  />
                ) : (
                  <AvatarFallback className="bg-brand/10 text-brand">
                    <User className="h-6 w-6" />
                  </AvatarFallback>
                )}
              </Avatar>
              
              <div className="flex-grow">
                <Badge 
                  variant="outline" 
                  className={`mb-1 ${specialtyColors.bg} ${specialtyColors.text} ${specialtyColors.border} text-xs py-0.5 px-2`}
                >
                  {doctor.specialty}
                </Badge>
                <h3 className="font-bold text-lg text-gray-800">{doctor.name}</h3>
                {doctor.bio && (
                  <p className="text-sm text-gray-500 line-clamp-1">{doctor.bio}</p>
                )}
              </div>
            </div>
            
            {/* Doctor fees */}
            <div className="mt-4 flex justify-between text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-brand" />
                <span>رسوم الكشف: {formatFee(doctor.fees.examination)}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-brand" />
                <span>الاستشارة: {formatFee(doctor.fees.consultation || 'غير متاح')}</span>
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="mt-4 flex justify-between gap-2">
              <Button 
                variant="outline" 
                className="flex-1 text-brand border-brand/30 hover:bg-brand/5"
                onClick={() => setShowDialog(true)}
              >
                التفاصيل
              </Button>
              <Button 
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                onClick={openWhatsApp}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
                احجز الآن
              </Button>
            </div>
          </div>
        </div>
        
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="p-0 sm:max-w-lg mx-auto rounded-lg overflow-hidden">
            <DoctorDetails 
              doctor={doctor} 
              onBookingWizard={redirectToBookingWizard} 
              onWhatsApp={openWhatsApp} 
              onClose={() => setShowDialog(false)} 
            />
          </DialogContent>
        </Dialog>
      </Card>
    );
  }

  // Full sized doctor card
  return (
    <motion.div 
      className="xl shadow-md overflow-hidden bg-white border border-gray-100"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex flex-col md:flex-row">
        <div className={`${isMobile ? 'py-4' : 'md:w-1/3'} bg-gradient-to-br from-brand/5 to-brand/10 p-6 flex items-center justify-center`}>
          <div className={`${isMobile ? 'w-24 h-24' : 'w-32 h-32'} rounded-full bg-white shadow p-1.5 flex items-center justify-center overflow-hidden`}>
            {doctor.image ? (
              <img 
                src={doctor.image} 
                alt={doctor.name} 
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-brand/10 flex items-center justify-center">
                <User className={`${isMobile ? 'h-12 w-12' : 'h-16 w-16'} text-brand/40`} />
              </div>
            )}
          </div>
        </div>
        
        <div className={`${isMobile ? 'w-full' : 'md:w-2/3'} p-4`}>
          <div className="mb-2">
            <Badge 
              variant="outline" 
              className={`${specialtyColors.bg} ${specialtyColors.text} ${specialtyColors.border} text-xs px-2 py-0.5 mb-2`}
            >
              {doctor.specialty}
            </Badge>
            <h3 className="text-xl md:text-2xl font-bold text-gray-800">{doctor.name}</h3>
          </div>
          
          {doctor.bio && !isMobile && (
            <p className="text-gray-600 mb-4 line-clamp-2">{doctor.bio}</p>
          )}
          
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="bg-gray-50 rounded p-2 flex items-center">
              <Clock className="h-4 w-4 text-brand ml-2" />
              <div>
                <span className="text-xs text-gray-500">رسوم الكشف</span>
                <p className="font-semibold text-sm">{formatFee(doctor.fees.examination)}</p>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded p-2 flex items-center">
              <Calendar className="h-4 w-4 text-brand ml-2" />
              <div>
                <span className="text-xs text-gray-500">الاستشارة</span>
                <p className="font-semibold text-sm">{formatFee(doctor.fees.consultation || 'غير متاح')}</p>
              </div>
            </div>
          </div>

          {/* Mobile-optimized schedule display */}
          <div className="mb-3">
            <h4 className="text-sm font-medium text-gray-700 mb-1">أيام العمل:</h4>
            <div className="flex flex-wrap gap-1">
              {availableDays.length > 0 ? (
                availableDays.map((dayInfo, index) => (
                  <Badge key={index} variant="outline" className="bg-blue-50 text-xs text-brand border-blue-100 py-0.5">
                    {dayInfo.day} {dayInfo.times[0]}
                  </Badge>
                ))
              ) : (
                <span className="text-xs text-gray-500">يرجى الاتصال لمعرفة المواعيد</span>
              )}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline"
              size={isMobile ? "sm" : "default"}
              className="border-brand/20 text-brand hover:bg-brand/5"
              onClick={() => setShowDialog(true)}
            >
              عرض التفاصيل
            </Button>
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white"
              size={isMobile ? "sm" : "default"}
              onClick={openWhatsApp}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              احجز الآن
            </Button>
          </div>
        </div>
      </div>
      
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="p-0 max-w-[95%] sm:max-w-md md:max-w-lg mx-auto rounded-lg overflow-hidden">
          <DoctorDetails 
            doctor={doctor} 
            onBookingWizard={redirectToBookingWizard} 
            onWhatsApp={openWhatsApp} 
            onClose={() => setShowDialog(false)} 
          />
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

// Dialog component for doctor details
const DoctorDetails = ({ 
  doctor, 
  onBookingWizard,
  onWhatsApp,
  onClose 
}: { 
  doctor: DoctorWithSpecialty;
  onBookingWizard: () => void;
  onWhatsApp: () => void;
  onClose: () => void;
}) => {
  const specialtyColors = getSpecialtyColorClass(doctor.specialty);
  const isMobile = useIsMobile();

  const formatFee = (fee: number | string | null) => {
    if (fee === null) return 'غير متاح';
    return typeof fee === 'number' ? `${fee} جنيه` : fee;
  };

  // Get available days from schedule
  const getAvailableDays = () => {
    if (!doctor.schedule) return [];
    
    return Object.entries(doctor.schedule)
      .filter(([_, times]) => times && times.length > 0);
  };
  
  const availableDays = getAvailableDays();
  
  // Direct WhatsApp opening without notification
  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onWhatsApp();
  };
  
  return (
    <div className="bg-white overflow-hidden max-h-[85vh] flex flex-col">
      {/* Header with gradient background and doctor info */}
      <DialogHeader className="relative bg-gradient-to-r from-brand to-blue-600 p-4 md:p-6 text-white">
        <button 
          onClick={onClose} 
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30"
          aria-label="إغلاق"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>

        <div className="flex items-center">
          {/* Doctor avatar - improved to fill the container */}
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-white/30 overflow-hidden flex-shrink-0 bg-white/10 ml-4">
            {doctor.image ? (
              <img 
                src={doctor.image} 
                alt={doctor.name} 
                className="w-full h-full rounded-full object-cover" 
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="h-8 w-8 md:h-10 md:w-10 text-white/70" />
              </div>
            )}
          </div>
          
          {/* Doctor info */}
          <div className="flex-1">
            <Badge 
              variant="outline" 
              className="mb-1 border-white/30 bg-white/10 text-white py-0.5 px-2 text-xs"
            >
              {doctor.specialty}
            </Badge>
            <DialogTitle className="text-lg md:text-xl font-bold text-white">{doctor.name}</DialogTitle>
            {doctor.bio && (
              <DialogDescription className="text-xs md:text-sm mt-1 text-white/90 line-clamp-2">
                {doctor.bio}
              </DialogDescription>
            )}
          </div>
        </div>
      </DialogHeader>
      
      {/* Fees section */}
      <div className="p-4 grid grid-cols-2 gap-3">
        <div className="bg-blue-50 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-600 mb-1">رسوم الكشف</p>
          <p className="font-bold text-lg text-brand">
            {formatFee(doctor.fees.examination)}
          </p>
        </div>
        
        <div className="bg-green-50 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-600 mb-1">رسوم الاستشارة</p>
          <p className="font-bold text-lg text-green-600">
            {formatFee(doctor.fees.consultation || 'غير متاح')}
          </p>
        </div>
      </div>
      
      {/* Bio section - updated design */}
      <div className="border-t mx-4 pt-3 pb-2">
        <div className="flex items-center mb-2">
          <User className="text-brand ml-2 h-5 w-5" />
          <h3 className="font-bold text-gray-700">نبذة عن الطبيب</h3>
        </div>
        
        <p className="text-gray-700 text-sm px-1 mb-4">
          {doctor.bio || 'طبيب متخصص ذو خبرة واسعة في مجال تخصصه. يسعى دائماً لتقديم أفضل رعاية طبية ممكنة للمرضى.'}
        </p>
      </div>
      
      {/* Schedule section in more compact format */}
      <div className="border-t mx-4 pt-3 pb-4">
        <div className="flex items-center mb-3">
          <Calendar className="text-brand ml-2 h-5 w-5" />
          <h3 className="font-bold text-gray-700">جدول المواعيد</h3>
        </div>
        
        <div className="overflow-y-auto max-h-48">
          {availableDays.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-3 gap-y-2 px-1">
              {availableDays.map(([englishDay, times], index) => {
                const arabicDay = Object.keys(dayMappings).find(
                  (key) => dayMappings[key as keyof typeof dayMappings] === englishDay
                ) || englishDay;
                
                return (
                  <div key={index} className="flex items-center">
                    <span className="font-medium text-sm ml-2">{arabicDay}:</span>
                    <div className="flex flex-wrap gap-1">
                      {Array.isArray(times) && times.map((time: string, timeIndex: number) => (
                        <Badge key={timeIndex} variant="outline" className="bg-brand/10 text-brand px-2 py-0.5 text-xs">
                          {time}
                        </Badge>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-3 text-sm">يرجى الاتصال بالعيادة لمعرفة المواعيد المتاحة</p>
          )}
        </div>
      </div>
      
      {/* Action buttons - fixed at bottom */}
      <div className="p-3 border-t mt-auto bg-gray-50 flex flex-col sm:flex-row gap-2">
        <Button 
          variant="outline"
          className="sm:flex-1 text-brand border-brand/30"
          onClick={onClose}
        >
          إغلاق
        </Button>
        <Button 
          onClick={onBookingWizard}
          className="sm:flex-1 bg-brand text-white flex items-center justify-center gap-2"
        >
          <Calendar className="h-4 w-4 ml-1" />
          احجز موعد
        </Button>
        <Button 
          onClick={handleWhatsAppClick}
          className="sm:flex-1 bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
          </svg>
          احجز عبر واتساب
        </Button>
      </div>
    </div>
  );
};

export default DoctorCard;
