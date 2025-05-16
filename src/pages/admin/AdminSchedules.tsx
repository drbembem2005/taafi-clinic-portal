
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Trash, Plus, Clock, Save } from 'lucide-react';
import { Doctor, getDoctors, arabicDayNames } from '@/services/doctorService';
import { supabase } from '@/integrations/supabase/client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';

// Day codes in order
const dayCodes = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

interface ScheduleData {
  [day: string]: string[];
}

const AdminSchedules = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('');
  const [schedule, setSchedule] = useState<ScheduleData>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  useEffect(() => {
    fetchDoctors();
  }, []);
  
  const fetchDoctors = async () => {
    try {
      const doctorsData = await getDoctors();
      setDoctors(doctorsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء جلب بيانات الأطباء',
        variant: 'destructive',
      });
    }
  };
  
  const fetchSchedule = async (doctorId: number) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('doctor_schedules')
        .select('*')
        .eq('doctor_id', doctorId);
      
      if (error) throw error;
      
      // Format schedule data
      const scheduleData: ScheduleData = {};
      dayCodes.forEach(day => {
        scheduleData[day] = [];
      });
      
      data.forEach(item => {
        if (!scheduleData[item.day]) {
          scheduleData[item.day] = [];
        }
        scheduleData[item.day].push(item.time);
      });
      
      setSchedule(scheduleData);
    } catch (error) {
      console.error('Error fetching schedule:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء جلب جدول المواعيد',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleDoctorChange = (doctorId: string) => {
    setSelectedDoctorId(doctorId);
    if (doctorId) {
      fetchSchedule(parseInt(doctorId, 10));
    } else {
      setSchedule({});
    }
  };
  
  const handleAddTimeSlot = (day: string) => {
    setSchedule(prev => ({
      ...prev,
      [day]: [...(prev[day] || []), '']
    }));
  };
  
  const handleTimeChange = (day: string, index: number, value: string) => {
    const newSchedule = { ...schedule };
    newSchedule[day][index] = value;
    setSchedule(newSchedule);
  };
  
  const handleRemoveTimeSlot = (day: string, index: number) => {
    setSchedule(prev => ({
      ...prev,
      [day]: prev[day].filter((_, i) => i !== index)
    }));
  };
  
  const handleSaveSchedule = async () => {
    if (!selectedDoctorId) return;
    
    try {
      setSaving(true);
      const doctorId = parseInt(selectedDoctorId, 10);
      
      // First delete all existing schedule entries for this doctor
      const { error: deleteError } = await supabase
        .from('doctor_schedules')
        .delete()
        .eq('doctor_id', doctorId);
      
      if (deleteError) throw deleteError;
      
      // Prepare new schedule entries
      const scheduleEntries = [];
      for (const [day, times] of Object.entries(schedule)) {
        for (const time of times) {
          if (time.trim()) { // Only add non-empty time slots
            scheduleEntries.push({
              doctor_id: doctorId,
              day,
              time,
            });
          }
        }
      }
      
      // Insert new schedule entries if any
      if (scheduleEntries.length > 0) {
        const { error: insertError } = await supabase
          .from('doctor_schedules')
          .insert(scheduleEntries);
        
        if (insertError) throw insertError;
      }
      
      toast({
        title: 'تم الحفظ',
        description: 'تم حفظ جدول المواعيد بنجاح',
      });
    } catch (error) {
      console.error('Error saving schedule:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء حفظ جدول المواعيد',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">إدارة جداول المواعيد</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>اختر الطبيب</CardTitle>
          <CardDescription>قم باختيار الطبيب لإدارة جدول مواعيده</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedDoctorId} onValueChange={handleDoctorChange}>
            <SelectTrigger>
              <SelectValue placeholder="اختر الطبيب" />
            </SelectTrigger>
            <SelectContent>
              {doctors.map((doctor) => (
                <SelectItem key={doctor.id} value={doctor.id.toString()}>
                  {doctor.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
      
      {selectedDoctorId && !loading && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>جدول المواعيد</CardTitle>
              <Button onClick={handleSaveSchedule} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'جاري الحفظ...' : 'حفظ الجدول'}
              </Button>
            </div>
            <CardDescription>
              أضف أيام وأوقات دوام الطبيب
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" className="w-full">
              {dayCodes.map((day) => (
                <AccordionItem key={day} value={day}>
                  <AccordionTrigger>
                    <div className="flex items-center">
                      <span>{arabicDayNames[day]}</span>
                      <span className="mr-2 text-sm text-gray-500">
                        ({schedule[day]?.filter(t => t.trim()).length || 0} مواعيد)
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 py-2">
                      {schedule[day]?.map((time, index) => (
                        <div key={index} className="flex items-center space-x-2 rtl:space-x-reverse">
                          <Input
                            value={time}
                            onChange={(e) => handleTimeChange(day, index, e.target.value)}
                            placeholder="00:00"
                            className="w-32"
                          />
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleRemoveTimeSlot(day, index)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        onClick={() => handleAddTimeSlot(day)}
                        className="mt-2"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        إضافة موعد
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminSchedules;
