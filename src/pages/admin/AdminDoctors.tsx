
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Pencil, Trash, Plus } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Doctor, getDoctors, Fees } from '@/services/doctorService';
import { Specialty, getSpecialties } from '@/services/specialtyService';
import { supabase } from '@/integrations/supabase/client';

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    specialty_id: '',
    bio: '',
    image: '',
    examination_fee: '',
    consultation_fee: '',
  });
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    setLoading(true);
    try {
      const [doctorsData, specialtiesData] = await Promise.all([
        getDoctors(),
        getSpecialties()
      ]);
      setDoctors(doctorsData);
      setSpecialties(specialtiesData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء جلب البيانات',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const getSpecialtyName = (id: number) => {
    const specialty = specialties.find(s => s.id === id);
    return specialty ? specialty.name : 'غير محدد';
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const openCreateDialog = () => {
    setSelectedDoctor(null);
    setFormData({
      name: '',
      specialty_id: '',
      bio: '',
      image: '',
      examination_fee: '',
      consultation_fee: '',
    });
    setIsDialogOpen(true);
  };
  
  const openEditDialog = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setFormData({
      name: doctor.name,
      specialty_id: doctor.specialty_id.toString(),
      bio: doctor.bio || '',
      image: doctor.image || '',
      examination_fee: doctor.fees.examination.toString(),
      consultation_fee: doctor.fees.consultation ? doctor.fees.consultation.toString() : '',
    });
    setIsDialogOpen(true);
  };
  
  const openDeleteDialog = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsDeleteDialogOpen(true);
  };
  
  const handleSubmit = async () => {
    try {
      // Validate form
      if (!formData.name || !formData.specialty_id || !formData.examination_fee) {
        toast({
          title: 'خطأ في البيانات',
          description: 'يرجى ملء جميع الحقول المطلوبة',
          variant: 'destructive',
        });
        return;
      }
      
      // Prepare fees object
      const fees: Fees = {
        examination: parseInt(formData.examination_fee, 10),
        consultation: formData.consultation_fee ? parseInt(formData.consultation_fee, 10) : null
      };
      
      if (selectedDoctor) {
        // Update existing doctor
        const { error } = await supabase
          .from('doctors')
          .update({
            name: formData.name,
            specialty_id: parseInt(formData.specialty_id, 10),
            bio: formData.bio,
            image: formData.image,
            fees: fees
          })
          .eq('id', selectedDoctor.id);
          
        if (error) throw error;
        toast({
          title: 'تم التحديث',
          description: 'تم تحديث بيانات الطبيب بنجاح',
        });
      } else {
        // Create new doctor
        const { error } = await supabase
          .from('doctors')
          .insert({
            name: formData.name,
            specialty_id: parseInt(formData.specialty_id, 10),
            bio: formData.bio,
            image: formData.image,
            fees: fees,
            old_schedule: {}
          });
          
        if (error) throw error;
        toast({
          title: 'تمت الإضافة',
          description: 'تم إضافة الطبيب بنجاح',
        });
      }
      
      // Refresh doctors list
      fetchData();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving doctor:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء حفظ بيانات الطبيب',
        variant: 'destructive',
      });
    }
  };
  
  const handleDelete = async () => {
    try {
      if (!selectedDoctor) return;
      
      const { error } = await supabase
        .from('doctors')
        .delete()
        .eq('id', selectedDoctor.id);
        
      if (error) throw error;
      
      toast({
        title: 'تم الحذف',
        description: 'تم حذف الطبيب بنجاح',
      });
      
      // Refresh doctors list
      fetchData();
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting doctor:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء حذف الطبيب',
        variant: 'destructive',
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">إدارة الأطباء</h1>
        <Button onClick={openCreateDialog}>
          <Plus className="h-4 w-4 mr-2" /> إضافة طبيب
        </Button>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>الاسم</TableHead>
              <TableHead>التخصص</TableHead>
              <TableHead>رسوم الكشف</TableHead>
              <TableHead>رسوم الاستشارة</TableHead>
              <TableHead className="w-[100px]">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">جاري التحميل...</TableCell>
              </TableRow>
            ) : doctors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">لا يوجد أطباء</TableCell>
              </TableRow>
            ) : (
              doctors.map((doctor) => (
                <TableRow key={doctor.id}>
                  <TableCell className="font-medium">{doctor.name}</TableCell>
                  <TableCell>{getSpecialtyName(doctor.specialty_id)}</TableCell>
                  <TableCell>{doctor.fees.examination} جنيه</TableCell>
                  <TableCell>{doctor.fees.consultation ? `${doctor.fees.consultation} جنيه` : '-'}</TableCell>
                  <TableCell className="flex items-center space-x-2">
                    <Button size="sm" variant="ghost" onClick={() => openEditDialog(doctor)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-red-500" onClick={() => openDeleteDialog(doctor)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedDoctor ? 'تعديل بيانات الطبيب' : 'إضافة طبيب جديد'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="block text-sm font-medium mb-1">اسم الطبيب</label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="أدخل اسم الطبيب"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">التخصص</label>
              <Select
                value={formData.specialty_id}
                onValueChange={(value) => setFormData(prev => ({ ...prev, specialty_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر التخصص" />
                </SelectTrigger>
                <SelectContent>
                  {specialties.map((specialty) => (
                    <SelectItem key={specialty.id} value={specialty.id.toString()}>
                      {specialty.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">نبذة عن الطبيب</label>
              <Textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="نبذة مختصرة عن الطبيب"
                rows={3}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">رابط الصورة (اختياري)</label>
              <Input
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                placeholder="رابط صورة الطبيب"
              />
            </div>
            
            <div className="flex space-x-4 rtl:space-x-reverse">
              <div className="w-1/2">
                <label className="block text-sm font-medium mb-1">رسوم الكشف</label>
                <Input
                  name="examination_fee"
                  type="number"
                  value={formData.examination_fee}
                  onChange={handleInputChange}
                  placeholder="سعر الكشف"
                />
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium mb-1">رسوم الاستشارة (اختياري)</label>
                <Input
                  name="consultation_fee"
                  type="number"
                  value={formData.consultation_fee}
                  onChange={handleInputChange}
                  placeholder="سعر الاستشارة"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>إلغاء</Button>
            <Button onClick={handleSubmit}>{selectedDoctor ? 'تحديث' : 'إضافة'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تأكيد الحذف</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>هل أنت متأكد من حذف الطبيب "{selectedDoctor?.name}"؟</p>
            <p className="text-sm text-red-500 mt-2">لا يمكن التراجع عن هذا الإجراء.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>إلغاء</Button>
            <Button variant="destructive" onClick={handleDelete}>حذف</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDoctors;
