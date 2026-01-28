import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
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
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, GripVertical, RefreshCw } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import {
  useEvents,
  useCreateEvent,
  useUpdateEvent,
  useDeleteEvent,
  Event,
  EventInsert,
} from '@/hooks/useEvents';

const AdminEvents = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: events, isLoading } = useEvents(false);
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();
  const deleteEvent = useDeleteEvent();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ['events'] });
    setIsRefreshing(false);
    toast({
      title: 'Sitio actualizado',
      description: 'Los eventos se han sincronizado correctamente',
    });
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    date_text_es: '',
    date_text_en: '',
    title_es: '',
    title_en: '',
    is_active: true,
    sort_order: 0,
  });

  const resetForm = () => {
    setFormData({
      date_text_es: '',
      date_text_en: '',
      title_es: '',
      title_en: '',
      is_active: true,
      sort_order: events?.length || 0,
    });
    setEditingEvent(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setFormData(prev => ({ ...prev, sort_order: events?.length || 0 }));
    setIsDialogOpen(true);
  };

  const openEditDialog = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      date_text_es: event.date_text_es,
      date_text_en: event.date_text_en,
      title_es: event.title_es,
      title_en: event.title_en,
      is_active: event.is_active,
      sort_order: event.sort_order,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingEvent) {
        await updateEvent.mutateAsync({
          id: editingEvent.id,
          updates: formData,
        });
        toast({ title: 'Evento actualizado', description: 'Los cambios se guardaron correctamente' });
      } else {
        await createEvent.mutateAsync(formData as EventInsert);
        toast({ title: 'Evento creado', description: 'El evento se agregó correctamente' });
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo guardar el evento',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este evento?')) return;
    
    try {
      await deleteEvent.mutateAsync(id);
      toast({ title: 'Evento eliminado', description: 'El evento se eliminó correctamente' });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el evento',
        variant: 'destructive',
      });
    }
  };

  const handleToggleActive = async (event: Event) => {
    try {
      await updateEvent.mutateAsync({
        id: event.id,
        updates: { is_active: !event.is_active },
      });
      toast({
        title: event.is_active ? 'Evento desactivado' : 'Evento activado',
        description: `El evento ahora está ${event.is_active ? 'oculto' : 'visible'} en el sitio`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo cambiar el estado del evento',
        variant: 'destructive',
      });
    }
  };

  return (
    <AdminLayout
      title="Eventos"
      description="Gestiona los próximos eventos que aparecen en la sección de reservaciones"
    >
      <div className="space-y-6">
        {/* Header with Add Button */}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refrescar Sitio
          </Button>
          <Button onClick={openCreateDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Agregar Evento
          </Button>
        </div>

        {/* Events Table */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Título</TableHead>
                <TableHead className="w-24 text-center">Activo</TableHead>
                <TableHead className="w-24 text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Cargando eventos...
                  </TableCell>
                </TableRow>
              ) : !events || events.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No hay eventos. Haz clic en "Agregar Evento" para crear uno.
                  </TableCell>
                </TableRow>
              ) : (
                events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>
                      <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium">{event.date_text_es}</p>
                        <p className="text-sm text-muted-foreground">{event.date_text_en}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium">{event.title_es}</p>
                        <p className="text-sm text-muted-foreground">{event.title_en}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch
                        checked={event.is_active}
                        onCheckedChange={() => handleToggleActive(event)}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(event)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(event.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingEvent ? 'Editar Evento' : 'Agregar Evento'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              {/* Date fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date_text_es">Fecha (Español)</Label>
                  <Input
                    id="date_text_es"
                    value={formData.date_text_es}
                    onChange={(e) => setFormData(prev => ({ ...prev, date_text_es: e.target.value }))}
                    placeholder="14 de febrero"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date_text_en">Fecha (Inglés)</Label>
                  <Input
                    id="date_text_en"
                    value={formData.date_text_en}
                    onChange={(e) => setFormData(prev => ({ ...prev, date_text_en: e.target.value }))}
                    placeholder="February 14"
                    required
                  />
                </div>
              </div>

              {/* Title fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title_es">Título (Español)</Label>
                  <Input
                    id="title_es"
                    value={formData.title_es}
                    onChange={(e) => setFormData(prev => ({ ...prev, title_es: e.target.value }))}
                    placeholder="Menú de San Valentín"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title_en">Título (Inglés)</Label>
                  <Input
                    id="title_en"
                    value={formData.title_en}
                    onChange={(e) => setFormData(prev => ({ ...prev, title_en: e.target.value }))}
                    placeholder="Valentine's Day Menu"
                    required
                  />
                </div>
              </div>

              {/* Active toggle */}
              <div className="flex items-center justify-between">
                <Label htmlFor="is_active">Mostrar en el sitio</Label>
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                />
              </div>

              {/* Sort order */}
              <div className="space-y-2">
                <Label htmlFor="sort_order">Orden</Label>
                <Input
                  id="sort_order"
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                  min={0}
                />
                <p className="text-xs text-muted-foreground">
                  Los eventos se ordenan de menor a mayor. El 0 aparece primero.
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={createEvent.isPending || updateEvent.isPending}>
                {editingEvent ? 'Guardar Cambios' : 'Crear Evento'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminEvents;
