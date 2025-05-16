
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
import { Specialty, getSpecialties } from '@/services/specialtyService';
import { supabase } from '@/integrations/supabase/client';

const AdminSpecialties = () => {
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    icon: '',
    description: '',
    details: '',
  });
  
  useEffect(() => {
    fetchSpecialties();
  }, []);
  
  const fetchSpecialties = async () => {
    setLoading(true);
    try {
      const data = await getSpecialties();
      setSpecialties(data);
    } catch (error) {
      console.error('Error fetching specialties:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء جلب التخصصات',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const openCreateDialog = () => {
    setSelectedSpecialty(null);
    setFormData({
      name: '',
      icon: '',
      description: '',
      details: '',
    });
    setIsDialogOpen(true);
  };
  
  const openEditDialog = (specialty: Specialty) => {
    setSelectedSpecialty(specialty);
    setFormData({
      name: specialty.name,
      icon: specialty.icon,
      description: specialty.description,
      details: specialty.details,
    });
    setIsDialogOpen(true);
  };
  
  const openDeleteDialog = (specialty: Specialty) => {
    setSelectedSpecialty(specialty);
    setIsDeleteDialogOpen(true);
  };
  
  const handleSubmit = async () => {
    try {
      // Validate form
      if (!formData.name || !formData.description || !formData.details) {
        toast({
          title: 'خطأ في البيانات',
          description: 'يرجى ملء جميع الحقول المطلوبة',
          variant: 'destructive',
        });
        return;
      }
      
      if (selectedSpecialty) {
        // Update existing specialty
        const { error } = await supabase
          .from('specialties')
          .update({
            name: formData.name,
            icon: formData.icon || 'default-icon',
            description: formData.description,
            details: formData.details,
          })
          .eq('id', selectedSpecialty.id);
          
        if (error) throw error;
        toast({
          title: 'تم التحديث',
          description: 'تم تحديث التخصص بنجاح',
        });
      } else {
        // Create new specialty
        const { error } = await supabase
          .from('specialties')
          .insert({
            name: formData.name,
            icon: formData.icon || 'default-icon',
            description: formData.description,
            details: formData.details,
          });
          
        if (error) throw error;
        toast({
          title: 'تمت الإضافة',
          description: 'تم إضافة التخصص بنجاح',
        });
      }
      
      // Refresh specialties list
      fetchSpecialties();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving specialty:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء حفظ التخصص',
        variant: 'destructive',
      });
    }
  };
  
  const handleDelete = async () => {
    try {
      if (!selectedSpecialty) return;
      
      const { error } = await supabase
        .from('specialties')
        .delete()
        .eq('id', selectedSpecialty.id);
        
      if (error) throw error;
      
      toast({
        title: 'تم الحذف',
        description: 'تم حذف التخصص بنجاح',
      });
      
      // Refresh specialties list
      fetchSpecialties();
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting specialty:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء حذف التخصص',
        variant: 'destructive',
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">إدارة التخصصات</h1>
        <Button onClick={openCreateDialog}>
          <Plus className="h-4 w-4 mr-2" /> إضافة تخصص
        </Button>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>الاسم</TableHead>
              <TableHead>الوصف المختصر</TableHead>
              <TableHead>الأيقونة</TableHead>
              <TableHead className="w-[100px]">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">جاري التحميل...</TableCell>
              </TableRow>
            ) : specialties.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">لا توجد تخصصات</TableCell>
              </TableRow>
            ) : (
              specialties.map((specialty) => (
                <TableRow key={specialty.id}>
                  <TableCell className="font-medium">{specialty.name}</TableCell>
                  <TableCell>{specialty.description}</TableCell>
                  <TableCell>{specialty.icon}</TableCell>
                  <TableCell className="flex items-center space-x-2">
                    <Button size="sm" variant="ghost" onClick={() => openEditDialog(specialty)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-red-500" onClick={() => openDeleteDialog(specialty)}>
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
              {selectedSpecialty ? 'تعديل التخصص' : 'إضافة تخصص جديد'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="block text-sm font-medium mb-1">اسم التخصص</label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="أدخل اسم التخصص"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">الأيقونة</label>
              <Input
                name="icon"
                value={formData.icon}
                onChange={handleInputChange}
                placeholder="اسم الأيقونة"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">الوصف المختصر</label>
              <Input
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="وصف مختصر للتخصص"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">التفاصيل</label>
              <Textarea
                name="details"
                value={formData.details}
                onChange={handleInputChange}
                placeholder="تفاصيل التخصص"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>إلغاء</Button>
            <Button onClick={handleSubmit}>{selectedSpecialty ? 'تحديث' : 'إضافة'}</Button>
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
            <p>هل أنت متأكد من حذف التخصص "{selectedSpecialty?.name}"؟</p>
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

export default AdminSpecialties;
