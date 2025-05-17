
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Spinner } from '@/components/ui/spinner';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { loading, isAdmin } = useAdminAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }
  
  if (!isAdmin) {
    return <Navigate to="/management-portal" replace />;
  }
  
  return <>{children}</>;
};

export default AdminRoute;
