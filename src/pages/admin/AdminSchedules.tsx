import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { getDoctors, Doctor, arabicDayNames } from '@/services/doctorService';

interface Schedule {
  id?: number;
  doctor_id: number;
  day: string;
  time: string;
}

const timeSchema = z.object({
  time: z.string().min(1, {
    message: "الوقت مطلوب",
  }),
})

const AdminSchedules = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = React.useState(false)

  const form = useForm<z.infer<typeof timeSchema>>({
    resolver: zodResolver(timeSchema),
    defaultValues: {
      time: "",
    },
  })

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: schedulesData, error: schedulesError } = await supabase
        .from('doctor_schedules')
        .select('*');

      if (schedulesError) {
        console.error('Error fetching schedules:', schedulesError);
        toast({
          title: "Error",
          description: "Failed to fetch schedules.",
          variant: "destructive",
        });
      } else {
        setSchedules(schedulesData || []);
      }

      const fetchedDoctors = await getDoctors();
      setDoctors(fetchedDoctors);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDoctorChange = (doctorId: number | undefined) => {
    setSelectedDoctor(doctorId !== undefined ? doctorId : null);
  };

  const addSchedule = async (values: z.infer<typeof timeSchema>) => {
    if (!selectedDoctor) {
      toast({
        title: "Error",
        description: "Please select a doctor.",
        variant: "destructive",
      });
      return;
    }

    const newSchedule = {
      doctor_id: selectedDoctor,
      day: 'Sat', // Default day, will be updated in the UI
      time: values.time,
    };

    try {
      const { data, error } = await supabase
        .from('doctor_schedules')
        .insert([newSchedule])
        .select();

      if (error) {
        console.error('Error adding schedule:', error);
        toast({
          title: "Error",
          description: "Failed to add schedule.",
          variant: "destructive",
        });
      } else {
        setSchedules([...schedules, data[0]]);
        toast({
          title: "Success",
          description: "Schedule added successfully.",
        });
        form.reset();
        setOpen(false)
      }
    } catch (error) {
      console.error('Error adding schedule:', error);
      toast({
        title: "Error",
        description: "Failed to add schedule.",
        variant: "destructive",
      });
    }
  };

  const updateSchedule = async (id: number, day: string) => {
    try {
      const { error } = await supabase
        .from('doctor_schedules')
        .update({ day })
        .eq('id', id);

      if (error) {
        console.error('Error updating schedule:', error);
        toast({
          title: "Error",
          description: "Failed to update schedule.",
          variant: "destructive",
        });
      } else {
        setSchedules(schedules.map(s => s.id === id ? { ...s, day } : s));
        toast({
          title: "Success",
          description: "Schedule updated successfully.",
        });
      }
    } catch (error) {
      console.error('Error updating schedule:', error);
      toast({
        title: "Error",
        description: "Failed to update schedule.",
        variant: "destructive",
      });
    }
  };

  const deleteSchedule = async (id: number) => {
    try {
      const { error } = await supabase
        .from('doctor_schedules')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting schedule:', error);
        toast({
          title: "Error",
          description: "Failed to delete schedule.",
          variant: "destructive",
        });
      } else {
        setSchedules(schedules.filter(s => s.id !== id));
        toast({
          title: "Success",
          description: "Schedule deleted successfully.",
        });
      }
    } catch (error) {
      console.error('Error deleting schedule:', error);
      toast({
        title: "Error",
        description: "Failed to delete schedule.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Schedules</h1>

      {/* Doctor Selection */}
      <div className="mb-4">
        <Label htmlFor="doctor">Select Doctor</Label>
        <Select onValueChange={(value) => handleDoctorChange(parseInt(value))} defaultValue={selectedDoctor ? selectedDoctor.toString() : ""}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a doctor" />
          </SelectTrigger>
          <SelectContent>
            {doctors.map(doctor => (
              <SelectItem key={doctor.id} value={doctor.id.toString()}>
                {doctor.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Add Schedule Form */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">اضافة معاد</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>اضافة معاد</DialogTitle>
            <DialogDescription>
              قم باضافة معاد جديد
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(addSchedule)} className="space-y-4">
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الوقت</FormLabel>
                    <FormControl>
                      <Input placeholder="18:00" {...field} />
                    </FormControl>
                    <FormDescription>
                      قم باضافة الوقت
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Schedules Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Doctor</TableHead>
              <TableHead>Day</TableHead>
              <TableHead>Time</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schedules.filter(schedule => selectedDoctor === null || schedule.doctor_id === selectedDoctor).map(schedule => (
              <TableRow key={schedule.id}>
                <TableCell className="font-medium">{doctors.find(doctor => doctor.id === schedule.doctor_id)?.name}</TableCell>
                <TableCell>
                  <Select value={schedule.day} onValueChange={(day) => updateSchedule(schedule.id, day)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a day" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(arabicDayNames).map(([key, value]) => (
                        <SelectItem key={key} value={key}>{value}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>{schedule.time}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" onClick={() => deleteSchedule(schedule.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminSchedules;
