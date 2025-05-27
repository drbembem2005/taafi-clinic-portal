
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { User, Phone, Mail, Calendar, StickyNote } from 'lucide-react';

interface ContactInfoFormProps {
  doctorName: string;
  appointmentDate: string;
  appointmentTime: string;
  initialValues: {
    name: string;
    phone: string;
    email: string;
    notes: string;
  };
  onUpdateContactInfo: (name: string, phone: string, email: string | null, notes: string | null) => void;
}

const ContactInfoForm = ({
  doctorName,
  appointmentDate,
  appointmentTime,
  initialValues,
  onUpdateContactInfo
}: ContactInfoFormProps) => {
  const [name, setName] = useState(initialValues.name);
  const [phone, setPhone] = useState(initialValues.phone);
  const [email, setEmail] = useState(initialValues.email);
  const [notes, setNotes] = useState(initialValues.notes);
  
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [emailError, setEmailError] = useState('');

  // Handle phone number input to only allow numbers
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); // Only allow numbers
    setPhone(value);
  };
  
  // Validate inputs when they change
  useEffect(() => {
    // Name validation
    if (name.trim() !== '') {
      setNameError('');
    }
    
    // Phone validation
    const phoneRegex = /^[0-9]{10,15}$/;
    if (phone && !phoneRegex.test(phone)) {
      setPhoneError('يرجى إدخال رقم هاتف صحيح (10-15 رقم)');
    } else {
      setPhoneError('');
    }
    
    // Email validation (only if provided)
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setEmailError('يرجى إدخال بريد إلكتروني صحيح أو تركه فارغًا');
      } else {
        setEmailError('');
      }
    } else {
      setEmailError('');
    }
    
    // Update parent component with current values
    onUpdateContactInfo(
      name,
      phone,
      email || null,
      notes || null
    );
  }, [name, phone, email, notes, onUpdateContactInfo]);
  
  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">أدخل بياناتك الشخصية</h2>
        <p className="text-gray-600">نحتاج لبعض المعلومات لإتمام حجز موعدك</p>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center mb-3 md:mb-0">
            <User className="h-5 w-5 text-brand ml-2" />
            <div>
              <p className="text-xs text-gray-500">الطبيب:</p>
              <p className="font-medium text-sm">{doctorName}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-brand ml-2" />
            <div>
              <p className="text-xs text-gray-500">الموعد:</p>
              <p className="font-medium text-sm">
                {appointmentDate} - {appointmentTime}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-5">
        <div>
          <Label htmlFor="name" className="flex items-center mb-1.5">
            <User className="h-4 w-4 ml-1.5 text-gray-500" />
            الاسم بالكامل
            <span className="text-red-500 mr-1">*</span>
          </Label>
          <Input 
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="أدخل اسمك هنا"
            className={nameError ? 'border-red-300' : ''}
            required
          />
          {nameError && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="text-red-500 text-xs mt-1"
            >
              {nameError}
            </motion.p>
          )}
        </div>
        
        <div>
          <Label htmlFor="phone" className="flex items-center mb-1.5">
            <Phone className="h-4 w-4 ml-1.5 text-gray-500" />
            رقم الهاتف
            <span className="text-red-500 mr-1">*</span>
          </Label>
          <Input 
            id="phone"
            type="tel"
            inputMode="numeric"
            pattern="[0-9]*"
            value={phone}
            onChange={handlePhoneChange}
            placeholder="01xxxxxxxxx"
            className={`text-left ${phoneError ? 'border-red-300' : ''}`}
            dir="ltr"
            maxLength={15}
            required
          />
          {phoneError && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="text-red-500 text-xs mt-1"
            >
              {phoneError}
            </motion.p>
          )}
        </div>
        
        <div>
          <Label htmlFor="email" className="flex items-center mb-1.5">
            <Mail className="h-4 w-4 ml-1.5 text-gray-500" />
            البريد الإلكتروني (اختياري)
          </Label>
          <Input 
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@example.com"
            className={`text-left ${emailError ? 'border-red-300' : ''}`}
            dir="ltr"
          />
          {emailError && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="text-red-500 text-xs mt-1"
            >
              {emailError}
            </motion.p>
          )}
        </div>
        
        <div>
          <Label htmlFor="notes" className="flex items-center mb-1.5">
            <StickyNote className="h-4 w-4 ml-1.5 text-gray-500" />
            ملاحظات إضافية (اختياري)
          </Label>
          <Textarea 
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="أي معلومات إضافية ترغب بإضافتها للحجز"
            rows={3}
          />
        </div>
        
        <div className="bg-amber-50 p-3 rounded-md border border-amber-200">
          <p className="text-sm text-amber-800">
            <span className="font-bold">ملاحظة: </span>
            سيتم استخدام هذه البيانات فقط لأغراض حجز الموعد والتواصل معك.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactInfoForm;
