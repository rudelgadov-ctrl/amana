import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Loader2, Save, UserPlus, Clock, Phone, MapPin, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAdminAuthContext } from '@/contexts/AdminAuthContext';

interface RestaurantInfo {
  id: string;
  key: string;
  value: string;
  value_type: string;
}

interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'editor';
  created_at: string;
  user_email?: string;
}

const infoKeys = [
  { key: 'phone', label: 'Teléfono', icon: Phone, type: 'text' },
  { key: 'email', label: 'Email', icon: Mail, type: 'text' },
  { key: 'address', label: 'Dirección', icon: MapPin, type: 'text' },
  { key: 'whatsapp', label: 'WhatsApp', icon: Phone, type: 'text' },
  { key: 'hours_monday', label: 'Lunes', icon: Clock, type: 'text' },
  { key: 'hours_tuesday', label: 'Martes', icon: Clock, type: 'text' },
  { key: 'hours_wednesday', label: 'Miércoles', icon: Clock, type: 'text' },
  { key: 'hours_thursday', label: 'Jueves', icon: Clock, type: 'text' },
  { key: 'hours_friday', label: 'Viernes', icon: Clock, type: 'text' },
  { key: 'hours_saturday', label: 'Sábado', icon: Clock, type: 'text' },
  { key: 'hours_sunday', label: 'Domingo', icon: Clock, type: 'text' },
];

const AdminSettings = () => {
  const { toast } = useToast();
  const { isAdmin } = useAdminAuthContext();
  const [info, setInfo] = useState<RestaurantInfo[]>([]);
  const [users, setUsers] = useState<UserRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editedInfo, setEditedInfo] = useState<Record<string, string>>({});
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState<'admin' | 'editor'>('editor');

  const fetchInfo = async () => {
    const { data, error } = await supabase
      .from('restaurant_info')
      .select('*')
      .order('key');

    if (error) {
      toast({ title: 'Error al cargar información', description: error.message, variant: 'destructive' });
    } else {
      setInfo(data || []);
      const infoMap: Record<string, string> = {};
      data?.forEach(item => { infoMap[item.key] = item.value; });
      setEditedInfo(infoMap);
    }
  };

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('user_roles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: 'Error al cargar usuarios', description: error.message, variant: 'destructive' });
    } else {
      setUsers(data || []);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchInfo(), fetchUsers()]);
      setIsLoading(false);
    };
    loadData();
  }, []);

  const handleSaveInfo = async () => {
    setIsSaving(true);

    for (const key of Object.keys(editedInfo)) {
      const existingItem = info.find(i => i.key === key);
      
      if (existingItem) {
        if (existingItem.value !== editedInfo[key]) {
          const { error } = await supabase
            .from('restaurant_info')
            .update({ value: editedInfo[key] })
            .eq('id', existingItem.id);
          
          if (error) {
            toast({ title: 'Error al guardar', description: error.message, variant: 'destructive' });
            setIsSaving(false);
            return;
          }
        }
      } else if (editedInfo[key]) {
        const { error } = await supabase
          .from('restaurant_info')
          .insert([{ key, value: editedInfo[key], value_type: 'text' }]);
        
        if (error) {
          toast({ title: 'Error al guardar', description: error.message, variant: 'destructive' });
          setIsSaving(false);
          return;
        }
      }
    }

    toast({ title: 'Información guardada' });
    fetchInfo();
    setIsSaving(false);
  };

  const handleAddUser = async () => {
    if (!newUserEmail || !newUserPassword) {
      toast({ title: 'Error', description: 'Email y contraseña son requeridos', variant: 'destructive' });
      return;
    }

    setIsSaving(true);

    // Create user via auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: newUserEmail,
      password: newUserPassword,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });

    if (authError) {
      toast({ title: 'Error al crear usuario', description: authError.message, variant: 'destructive' });
      setIsSaving(false);
      return;
    }

    if (authData.user) {
      // Assign role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert([{ user_id: authData.user.id, role: newUserRole }]);

      if (roleError) {
        toast({ title: 'Error al asignar rol', description: roleError.message, variant: 'destructive' });
      } else {
        toast({ title: 'Usuario creado', description: `${newUserEmail} ha sido agregado como ${newUserRole}` });
        setIsUserDialogOpen(false);
        setNewUserEmail('');
        setNewUserPassword('');
        setNewUserRole('editor');
        fetchUsers();
      }
    }

    setIsSaving(false);
  };

  const handleDeleteUser = async (roleId: string) => {
    if (!confirm('¿Estás seguro de eliminar este usuario del CMS?')) return;

    const { error } = await supabase
      .from('user_roles')
      .delete()
      .eq('id', roleId);

    if (error) {
      toast({ title: 'Error al eliminar', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Usuario eliminado del CMS' });
      fetchUsers();
    }
  };

  if (isLoading) {
    return (
      <AdminLayout title="Ajustes" description="Configuración del sitio">
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Ajustes" description="Configuración del sitio">
      <Tabs defaultValue="info" className="space-y-6">
        <TabsList>
          <TabsTrigger value="info">Información del Restaurante</TabsTrigger>
          {isAdmin && <TabsTrigger value="users">Usuarios</TabsTrigger>}
        </TabsList>

        <TabsContent value="info" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información de Contacto</CardTitle>
              <CardDescription>Datos que aparecen en el sitio</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {infoKeys.slice(0, 4).map((item) => (
                  <div key={item.key} className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Label>
                    <Input
                      value={editedInfo[item.key] || ''}
                      onChange={(e) => setEditedInfo({ ...editedInfo, [item.key]: e.target.value })}
                      placeholder={`Ingresa ${item.label.toLowerCase()}`}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Horarios</CardTitle>
              <CardDescription>Horario de atención por día</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {infoKeys.slice(4).map((item) => (
                  <div key={item.key} className="space-y-2">
                    <Label>{item.label}</Label>
                    <Input
                      value={editedInfo[item.key] || ''}
                      onChange={(e) => setEditedInfo({ ...editedInfo, [item.key]: e.target.value })}
                      placeholder="Ej: Cerrado, 12-4 PM, 6-10 PM"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSaveInfo} disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Guardar Cambios
            </Button>
          </div>
        </TabsContent>

        {isAdmin && (
          <TabsContent value="users">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Usuarios del CMS</CardTitle>
                  <CardDescription>Gestiona quién puede acceder al panel de administración</CardDescription>
                </div>
                <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Agregar Usuario
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Agregar Nuevo Usuario</DialogTitle>
                      <DialogDescription>
                        Crea una cuenta para un miembro del equipo
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                          type="email"
                          value={newUserEmail}
                          onChange={(e) => setNewUserEmail(e.target.value)}
                          placeholder="usuario@ejemplo.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Contraseña</Label>
                        <Input
                          type="password"
                          value={newUserPassword}
                          onChange={(e) => setNewUserPassword(e.target.value)}
                          placeholder="Mínimo 6 caracteres"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Rol</Label>
                        <Select value={newUserRole} onValueChange={(v: 'admin' | 'editor') => setNewUserRole(v)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="editor">Editor (puede editar contenido)</SelectItem>
                            <SelectItem value="admin">Admin (todo + gestión de usuarios)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsUserDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleAddUser} disabled={isSaving}>
                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Crear Usuario
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {users.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No hay usuarios configurados. ¡Agrega el primero!
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Usuario ID</TableHead>
                        <TableHead>Rol</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-mono text-xs">
                            {user.user_id.slice(0, 8)}...
                          </TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                              user.role === 'admin' 
                                ? 'bg-primary/10 text-primary' 
                                : 'bg-muted text-muted-foreground'
                            }`}>
                              {user.role === 'admin' ? 'Admin' : 'Editor'}
                            </span>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(user.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </AdminLayout>
  );
};

export default AdminSettings;
