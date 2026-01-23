import { Navigate } from 'react-router-dom';
import { useAdminAuthContext } from '@/contexts/AdminAuthContext';
import { Loader2 } from 'lucide-react';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const AdminProtectedRoute = ({ children, requireAdmin = false }: AdminProtectedRouteProps) => {
  const { user, isLoading, canManageContent, isAdmin } = useAdminAuthContext();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!canManageContent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-display font-bold text-foreground mb-2">
            Acceso Denegado
          </h1>
          <p className="text-muted-foreground">
            No tienes permisos para acceder al panel de administración.
          </p>
        </div>
      </div>
    );
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-display font-bold text-foreground mb-2">
            Acceso Restringido
          </h1>
          <p className="text-muted-foreground">
            Esta sección requiere permisos de administrador.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;
