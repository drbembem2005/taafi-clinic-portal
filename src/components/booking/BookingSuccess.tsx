
import { motion } from 'framer-motion';
import { Check, Calendar, Users, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BookingSuccessProps {
  bookingReference: string;
  doctorName: string;
  appointmentDate: string;
  appointmentTime: string;
  userPhone: string;
  userEmail: string | null;
  onReset: () => void;
}

const BookingSuccess = ({
  bookingReference,
  doctorName,
  appointmentDate,
  appointmentTime,
  userPhone,
  userEmail,
  onReset
}: BookingSuccessProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <Check className="h-10 w-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-3">تم الحجز بنجاح!</h2>
        <p className="text-gray-600 mb-4">
          شكراً لك، تم استلام طلب حجزك بنجاح. سيتم التواصل معك قريباً عبر واتساب أو الهاتف لتأكيد الحجز.
        </p>
        
        {bookingReference && (
          <div className="py-3 px-6 bg-gray-50 rounded-full inline-block shadow-sm">
            <p className="text-sm text-gray-500 mb-1">رقم مرجعي للحجز:</p>
            <p className="font-mono font-bold text-xl text-brand tracking-wide">{bookingReference.substring(0, 8)}</p>
          </div>
        )}
      </div>
      
      <div className="bg-gray-50 rounded-lg p-6 mb-8 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold mb-4 flex items-center text-brand">
          <Calendar className="mr-2 h-5 w-5" />
          تفاصيل الحجز:
        </h3>
        <ul className="space-y-4">
          <li className="flex items-center">
            <Users className="h-5 w-5 text-brand ml-3 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-500">الطبيب:</p>
              <p className="font-medium">{doctorName}</p>
            </div>
          </li>
          <li className="flex items-center">
            <Calendar className="h-5 w-5 text-brand ml-3 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-500">الموعد:</p>
              <p className="font-medium">{appointmentDate} - {appointmentTime}</p>
            </div>
          </li>
          <li className="flex items-center">
            <Phone className="h-5 w-5 text-brand ml-3 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-500">رقم الهاتف:</p>
              <p className="font-medium" dir="ltr">{userPhone}</p>
            </div>
          </li>
          {userEmail && (
            <li className="flex items-center">
              <Mail className="h-5 w-5 text-brand ml-3 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500">البريد الإلكتروني:</p>
                <p className="font-medium">{userEmail}</p>
              </div>
            </li>
          )}
        </ul>
      </div>
      
      <div className="bg-amber-50 rounded-lg p-4 mb-6 border border-amber-100">
        <p className="text-sm text-amber-800 flex items-start">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <span>
            يرجى الحضور قبل موعدك بـ 15 دقيقة لإكمال إجراءات التسجيل وإحضار جميع التقارير الطبية السابقة إن وجدت.
          </span>
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-3 md:justify-center">
        <Button 
          className="bg-brand hover:bg-brand-dark text-white"
          onClick={onReset}
        >
          حجز موعد آخر
        </Button>
        
        <Button 
          variant="outline"
          className="border-brand text-brand hover:bg-brand/5"
          onClick={() => window.location.href = '/'}
        >
          العودة للصفحة الرئيسية
        </Button>
      </div>
    </motion.div>
  );
};

export default BookingSuccess;
