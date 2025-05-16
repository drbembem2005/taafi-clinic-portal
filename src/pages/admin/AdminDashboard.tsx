
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserIcon, CalendarIcon, StethoscopeIcon, FileTextIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalSpecialties: 0,
    totalBookings: 0,
    totalBlogPosts: 0
  });
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch counts from Supabase
        const [
          doctorsResult, 
          specialtiesResult, 
          bookingsResult, 
          blogPostsResult
        ] = await Promise.all([
          supabase.from('doctors').select('id', { count: 'exact', head: true }),
          supabase.from('specialties').select('id', { count: 'exact', head: true }),
          supabase.from('bookings').select('id', { count: 'exact', head: true }),
          supabase.from('blog_posts').select('id', { count: 'exact', head: true })
        ]);
        
        setStats({
          totalDoctors: doctorsResult.count || 0,
          totalSpecialties: specialtiesResult.count || 0,
          totalBookings: bookingsResult.count || 0,
          totalBlogPosts: blogPostsResult.count || 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">مرحباً بك في لوحة التحكم الإدارية</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الأطباء</CardTitle>
            <UserIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : stats.totalDoctors}</div>
            <p className="text-xs text-muted-foreground">طبيب مسجل في النظام</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي التخصصات</CardTitle>
            <StethoscopeIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : stats.totalSpecialties}</div>
            <p className="text-xs text-muted-foreground">تخصص طبي متاح</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الحجوزات</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : stats.totalBookings}</div>
            <p className="text-xs text-muted-foreground">حجز مسجل في النظام</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">مقالات المدونة</CardTitle>
            <FileTextIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : stats.totalBlogPosts}</div>
            <p className="text-xs text-muted-foreground">مقال منشور</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>المهام السريعة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex flex-col space-y-2">
              <a href="/management-portal/doctors" className="text-blue-600 hover:underline">إضافة طبيب جديد</a>
              <a href="/management-portal/specialties" className="text-blue-600 hover:underline">إدارة التخصصات</a>
              <a href="/management-portal/blog/create" className="text-blue-600 hover:underline">إنشاء مقال جديد</a>
              <a href="/management-portal/schedules" className="text-blue-600 hover:underline">تحديث جداول المواعيد</a>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>ملاحظات</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              مرحباً بك في لوحة التحكم الإدارية الخاصة بعيادتك. يمكنك من هنا إدارة جميع جوانب الموقع بما في ذلك إضافة وتعديل الأطباء، التخصصات، جداول المواعيد، ومقالات المدونة.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
