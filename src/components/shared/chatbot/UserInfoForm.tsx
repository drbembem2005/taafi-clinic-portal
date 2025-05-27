
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, Phone, Mail, Loader2 } from 'lucide-react';

interface UserInfoFormProps {
  onSubmit: (userInfo: { name: string; phone: string; email?: string }) => void;
  isLoading?: boolean;
}

const UserInfoForm = ({ onSubmit, isLoading = false }: UserInfoFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) return;
    
    onSubmit({
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim() || undefined
    });
  };

  return (
    <motion.div
      className="bg-white border border-gray-200 rounded-xl p-4 shadow-lg max-w-sm"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-400" />
          <Input
            placeholder="الاسم الكامل *"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="text-sm"
            required
            disabled={isLoading}
          />
        </div>

        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-gray-400" />
          <Input
            placeholder="رقم الهاتف *"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            className="text-sm"
            required
            disabled={isLoading}
          />
        </div>

        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-gray-400" />
          <Input
            placeholder="البريد الإلكتروني (اختياري)"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="text-sm"
            disabled={isLoading}
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading || !formData.name.trim() || !formData.phone.trim()}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg font-medium"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              جاري الحجز...
            </>
          ) : (
            'تأكيد الحجز'
          )}
        </Button>
      </form>
    </motion.div>
  );
};

export default UserInfoForm;
