import { Link } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UtensilsCrossed, Image, Languages, Settings, ArrowRight, Gift } from 'lucide-react';
import { useAdminAuthContext } from '@/contexts/AdminAuthContext';

const AdminDashboard = () => {
  const { isAdmin, user } = useAdminAuthContext();

  const quickLinks = [
    {
      icon: UtensilsCrossed,
      title: 'Gestión del Menú',
      description: 'Agrega, edita o elimina platillos y bebidas',
      href: '/admin/menu',
      color: 'text-orange-500',
    },
    {
      icon: Image,
      title: 'Imágenes del Sitio',
      description: 'Administra las fotos del hero, carrusel y galería',
      href: '/admin/images',
      color: 'text-blue-500',
    },
    {
      icon: Gift,
      title: 'Regalos',
      description: "Pedidos de tarjetas de regalo y Chef's Table, precios y montos",
      href: '/admin/gifts',
      color: 'text-pink-500',
    },
    {
      icon: Languages,
      title: 'Traducciones',
      description: 'Edita los textos en español e inglés',
      href: '/admin/translations',
      color: 'text-green-500',
    },
    {
      icon: Settings,
      title: 'Ajustes',
      description: 'Horarios, contacto y gestión de usuarios',
      href: '/admin/settings',
      color: 'text-purple-500',
      adminOnly: true,
    },
  ];

  return (
    <AdminLayout 
      title="Dashboard" 
      description={`Bienvenido, ${user?.email?.split('@')[0] || 'Admin'}`}
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {quickLinks.map((link) => {
          if (link.adminOnly && !isAdmin) return null;
          
          return (
            <Link key={link.href} to={link.href}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <link.icon className={`h-8 w-8 ${link.color}`} />
                    <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <CardTitle className="text-xl">{link.title}</CardTitle>
                  <CardDescription>{link.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Quick Tips */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Acciones Rápidas</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-medium mb-2">💡 Consejo</h3>
              <p className="text-sm text-muted-foreground">
                Los cambios que hagas aquí se reflejan inmediatamente en el sitio público.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-medium mb-2">🌐 Idiomas</h3>
              <p className="text-sm text-muted-foreground">
                Recuerda actualizar tanto el español como el inglés para cada contenido.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-medium mb-2">📸 Imágenes</h3>
              <p className="text-sm text-muted-foreground">
                Las imágenes se optimizan automáticamente al subirlas.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
