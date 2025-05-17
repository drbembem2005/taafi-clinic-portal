
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getDoctors, Doctor } from '@/services/doctorService';
import { Users, Star, CheckCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface DoctorSelectionProps {
  specialtyId: number | null;
  selectedDoctorId: number | null;
  onSelectDoctor: (doctor: Doctor) => void;
  className?: string;
}

const DoctorSelection = ({
  specialtyId,
  selectedDoctorId,
  onSelectDoctor,
  className = ''
}: DoctorSelectionProps) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showBioDialog, setShowBioDialog] = useState<boolean>(false);
  
  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const data = await getDoctors();
        setDoctors(data);
        
        if (specialtyId) {
          const filtered = data.filter(doctor => doctor.specialty_id === specialtyId);
          setFilteredDoctors(filtered);
        } else {
          setFilteredDoctors(data);
        }
        
        // If we already have a selected doctor, find it in the list
        if (selectedDoctorId) {
          const doctor = data.find(d => d.id === selectedDoctorId);
          if (doctor) setSelectedDoctor(doctor);
        }
      } catch (error) {
        console.error('Failed to load doctors:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadDoctors();
  }, []);
  
  // Update filtered doctors when specialty changes
  useEffect(() => {
    if (specialtyId) {
      const filtered = doctors.filter(doctor => doctor.specialty_id === specialtyId);
      setFilteredDoctors(filtered);
      
      // If the currently selected doctor is not in this specialty, deselect it
      if (selectedDoctor && selectedDoctor.specialty_id !== specialtyId) {
        setSelectedDoctor(null);
      }
    } else {
      setFilteredDoctors(doctors);
    }
  }, [specialtyId, doctors, selectedDoctor]);

  const handleDoctorSelect = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    onSelectDoctor(doctor);
  };
  
  const handleShowBio = (doctor: Doctor, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedDoctor(doctor);
    setShowBioDialog(true);
  };
  
  if (!specialtyId) {
    return (
      <div className={`${className} flex items-center justify-center p-8`}>
        <div className="text-center p-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">اختر تخصصًا أولًا</h3>
          <p className="text-gray-500 text-sm mb-0">
            يرجى اختيار التخصص الطبي لعرض قائمة الأطباء المتخصصين
          </p>
        </div>
      </div>
    );
  }
  
  if (loading) {
    return (
      <div className={`${className} p-4`}>
        <h2 className="text-xl font-bold mb-4">الأطباء المتخصصون</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-gray-100 animate-pulse rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className={`${className} p-4`}>
      <h2 className="text-xl font-bold mb-4">الأطباء المتخصصون</h2>
      
      <AnimatePresence mode="wait">
        {filteredDoctors.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {filteredDoctors.map((doctor) => (
              <motion.div
                key={doctor.id}
                className={`
                  relative cursor-pointer rounded-xl overflow-hidden border-2 transition-all
                  ${selectedDoctorId === doctor.id ? 'border-brand shadow-lg shadow-brand/20' : 'border-gray-100 hover:border-gray-200 shadow-md'}
                `}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleDoctorSelect(doctor)}
              >
                <div className="flex p-3">
                  {/* Doctor Image */}
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden mr-4 flex-shrink-0 border border-gray-100 bg-gray-50">
                    {doctor.image ? (
                      <img
                        src={doctor.image}
                        alt={doctor.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <Users className="w-10 h-10 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  {/* Doctor Info */}
                  <div className="flex-grow">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold mb-1">{doctor.name}</h3>
                      {selectedDoctorId === doctor.id && (
                        <div className="w-6 h-6 bg-brand rounded-full flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                    
                    <p className="text-gray-500 text-sm mb-2">{doctor.title || 'طبيب متخصص'}</p>
                    
                    {/* Years of experience */}
                    {doctor.experience && (
                      <div className="flex items-center text-xs text-gray-600 mb-1">
                        <span className="ml-1">الخبرة:</span>
                        <span>{doctor.experience} سنوات</span>
                      </div>
                    )}
                    
                    {/* Rating */}
                    <div className="flex items-center">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            size={14} 
                            fill={star <= (doctor.rating || 5) ? "#FFB800" : "none"} 
                            stroke={star <= (doctor.rating || 5) ? "#FFB800" : "#CBD5E1"}
                            className="mr-0.5" 
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500 mr-1">
                        ({doctor.reviews_count || 0} تقييم)
                      </span>
                    </div>
                    
                    {/* Bio button */}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="mt-2 text-brand hover:text-brand hover:bg-brand/5 p-0 h-auto"
                      onClick={(e) => handleShowBio(doctor, e)}
                    >
                      <Info className="w-4 h-4 ml-1" />
                      <span className="text-xs">نبذة عن الطبيب</span>
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center p-8 text-center"
          >
            <div className="p-6 bg-gray-50 rounded-lg border border-dashed border-gray-300 max-w-md">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">لا يوجد أطباء متاحين</h3>
              <p className="text-gray-500 text-sm">
                لا يوجد أطباء متاحين في هذا التخصص حاليًا. يرجى اختيار تخصص آخر.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Doctor Bio Dialog */}
      <Dialog open={showBioDialog} onOpenChange={setShowBioDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span>نبذة عن د. {selectedDoctor?.name}</span>
            </DialogTitle>
            <DialogDescription>
              <div className="mt-4">
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <div className="w-24 h-24 rounded-full overflow-hidden mx-auto md:mx-0">
                    {selectedDoctor?.image ? (
                      <img
                        src={selectedDoctor.image}
                        alt={selectedDoctor.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <Users className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{selectedDoctor?.name}</h3>
                    <p className="text-gray-500">{selectedDoctor?.title || 'طبيب متخصص'}</p>
                    
                    {/* Rating */}
                    <div className="flex items-center mt-2">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            size={16} 
                            fill={star <= (selectedDoctor?.rating || 5) ? "#FFB800" : "none"} 
                            stroke={star <= (selectedDoctor?.rating || 5) ? "#FFB800" : "#CBD5E1"}
                            className="mr-0.5" 
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500 mr-1">
                        ({selectedDoctor?.reviews_count || 0} تقييم)
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h4 className="font-bold text-gray-800 mb-2">نبذة مختصرة:</h4>
                  <p className="text-gray-700">
                    {selectedDoctor?.bio || 'طبيب متخصص ذو خبرة واسعة في مجال تخصصه. يسعى دائماً لتقديم أفضل رعاية طبية ممكنة للمرضى.'}
                  </p>
                </div>
                
                <div className="mt-4">
                  <h4 className="font-bold text-gray-800 mb-2">الخبرات والمؤهلات:</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>خبرة {selectedDoctor?.experience || '5'} سنوات في مجال التخصص</li>
                    <li>حاصل على شهادة البورد في التخصص</li>
                    <li>عضو في الجمعية الطبية المتخصصة</li>
                  </ul>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <Button 
              className="w-full bg-brand hover:bg-brand-dark"
              onClick={() => {
                setShowBioDialog(false);
                if (selectedDoctor) handleDoctorSelect(selectedDoctor);
              }}
            >
              اختيار هذا الطبيب
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DoctorSelection;
