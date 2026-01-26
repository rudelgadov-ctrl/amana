import { ReactNode, useState } from 'react';
import AdminSidebar from './AdminSidebar';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
}

const AdminLayout = ({ children, title, description }: AdminLayoutProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleRefreshAll = async () => {
    setIsRefreshing(true);
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['site-translations'] }),
      queryClient.invalidateQueries({ queryKey: ['menu-items'] }),
      queryClient.invalidateQueries({ queryKey: ['site-images'] }),
      queryClient.invalidateQueries({ queryKey: ['restaurant-info'] }),
    ]);
    toast({ 
      title: 'Sitio actualizado', 
      description: 'Traducciones, menú e imágenes refrescados' 
    });
    setIsRefreshing(false);
  };

  return (
    <div className="min-h-screen flex bg-background">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <header className="mb-8 flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground">{title}</h1>
              {description && (
                <p className="mt-1 text-muted-foreground">{description}</p>
              )}
            </div>
            <Button 
              variant="outline" 
              onClick={handleRefreshAll} 
              disabled={isRefreshing}
              className="shrink-0"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Actualizar Sitio
            </Button>
          </header>
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
