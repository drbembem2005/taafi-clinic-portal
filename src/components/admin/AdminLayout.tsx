
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { 
  BarChart3, 
  Users, 
  Calendar, 
  FileText, 
  Home,
  Settings,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { signOut } = useAdminAuth();
  const navigate = useNavigate();
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/management-portal');
  };
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 z-10 flex w-64 flex-col border-r bg-white">
        <div className="flex h-14 items-center border-b px-4">
          <Link to="/management-portal" className="flex items-center font-medium">
            <span className="text-xl font-bold text-primary">لوحة التحكم</span>
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto p-2">
          <div className="space-y-1">
            <NavLink 
              to="/management-portal"
              end
              className={({ isActive }) => 
                cn("flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <BarChart3 className="h-5 w-5" />
              <span>لوحة المعلومات</span>
            </NavLink>
            
            <NavLink 
              to="/management-portal/specialties"
              className={({ isActive }) => 
                cn("flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <Home className="h-5 w-5" />
              <span>التخصصات</span>
            </NavLink>
            
            <NavLink 
              to="/management-portal/doctors"
              className={({ isActive }) => 
                cn("flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <Users className="h-5 w-5" />
              <span>الأطباء</span>
            </NavLink>
            
            <NavLink 
              to="/management-portal/schedules"
              className={({ isActive }) => 
                cn("flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <Calendar className="h-5 w-5" />
              <span>المواعيد</span>
            </NavLink>
            
            <NavLink 
              to="/management-portal/blog"
              className={({ isActive }) => 
                cn("flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <FileText className="h-5 w-5" />
              <span>المدونة</span>
            </NavLink>
          </div>
        </nav>
        
        <div className="mt-auto border-t p-4">
          <button
            onClick={handleSignOut}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
          >
            <LogOut className="h-4 w-4" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>
      
      {/* Main content */}
      <main className="flex-1 pr-64">
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-white px-6">
          <div className="flex-1">
            <h1 className="text-lg font-semibold">لوحة التحكم الإدارية</h1>
          </div>
        </header>
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
