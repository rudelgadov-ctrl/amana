import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Pencil, Trash2, Loader2, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

interface MenuItem {
  id: string;
  category: string;
  subcategory: string | null;
  name_es: string;
  name_en: string;
  description_es: string | null;
  description_en: string | null;
  price: string | null;
  is_available: boolean;
  sort_order: number;
}

const categories = [
  { value: 'starters', label: 'Entradas' },
  { value: 'mains', label: 'Platos Fuertes' },
  { value: 'desserts', label: 'Postres' },
  { value: 'drinks', label: 'Bebidas' },
  { value: 'chefs_table', label: "Chef's Table" },
];

const drinksSubcategories = [
  { value: 'cocktails', label: 'Cócteles' },
  { value: 'low_alcohol', label: 'Bajo/Sin Alcohol' },
  { value: 'red_wine', label: 'Vino Tinto' },
  { value: 'white_wine', label: 'Vino Blanco' },
  { value: 'rose_wine', label: 'Vino Rosado' },
  { value: 'sparkling_wine', label: 'Vino Espumante' },
];

const emptyItem: Omit<MenuItem, 'id'> = {
  category: 'starters',
  subcategory: null,
  name_es: '',
  name_en: '',
  description_es: '',
  description_en: '',
  price: '',
  is_available: true,
  sort_order: 0,
};

const AdminMenu = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState(emptyItem);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const fetchItems = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .order('category')
      .order('sort_order');

    if (error) {
      toast({ title: 'Error al cargar el menú', description: error.message, variant: 'destructive' });
    } else {
      setItems(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleOpenDialog = (item?: MenuItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        category: item.category,
        subcategory: item.subcategory,
        name_es: item.name_es,
        name_en: item.name_en,
        description_es: item.description_es || '',
        description_en: item.description_en || '',
        price: item.price || '',
        is_available: item.is_available,
        sort_order: item.sort_order,
      });
    } else {
      setEditingItem(null);
      setFormData(emptyItem);
    }
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name_es || !formData.name_en) {
      toast({ title: 'Error', description: 'El nombre es requerido en ambos idiomas', variant: 'destructive' });
      return;
    }

    setIsSaving(true);

    const itemData = {
      ...formData,
      subcategory: formData.category === 'drinks' ? formData.subcategory : null,
    };

    if (editingItem) {
      const { error } = await supabase
        .from('menu_items')
        .update(itemData)
        .eq('id', editingItem.id);

      if (error) {
        toast({ title: 'Error al actualizar', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Item actualizado' });
        setIsDialogOpen(false);
        fetchItems();
      }
    } else {
      const { error } = await supabase
        .from('menu_items')
        .insert([itemData]);

      if (error) {
        toast({ title: 'Error al crear', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Item creado' });
        setIsDialogOpen(false);
        fetchItems();
      }
    }

    setIsSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este item?')) return;

    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', id);

    if (error) {
      toast({ title: 'Error al eliminar', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Item eliminado' });
      fetchItems();
    }
  };

  const handleToggleAvailable = async (id: string, currentValue: boolean) => {
    const { error } = await supabase
      .from('menu_items')
      .update({ is_available: !currentValue })
      .eq('id', id);

    if (error) {
      toast({ title: 'Error al actualizar', description: error.message, variant: 'destructive' });
    } else {
      fetchItems();
      queryClient.invalidateQueries({ queryKey: ['menu-items'] });
    }
  };

  const handleRefreshCache = async () => {
    setIsRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ['menu-items'] });
    toast({ title: 'Caché actualizado', description: 'Los cambios se reflejarán en el sitio' });
    setIsRefreshing(false);
  };

  const filteredItems = filterCategory === 'all' 
    ? items 
    : items.filter(item => item.category === filterCategory);

  const getCategoryLabel = (value: string) => 
    categories.find(c => c.value === value)?.label || value;

  return (
    <AdminLayout title="Gestión del Menú" description="Administra los platillos y bebidas">
      <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-between">
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filtrar por categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las categorías</SelectItem>
            {categories.map(cat => (
              <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefreshCache} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refrescar Sitio
          </Button>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Agregar Item
              </Button>
            </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Editar Item' : 'Nuevo Item'}</DialogTitle>
              <DialogDescription>
                Completa la información del item en ambos idiomas
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Categoría</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {formData.category === 'drinks' && (
                  <div className="space-y-2">
                    <Label>Tipo de Bebida</Label>
                    <Select 
                      value={formData.subcategory || ''} 
                      onValueChange={(value) => setFormData({ ...formData, subcategory: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar..." />
                      </SelectTrigger>
                      <SelectContent>
                        {drinksSubcategories.map(sub => (
                          <SelectItem key={sub.value} value={sub.value}>{sub.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Precio</Label>
                  <Input
                    value={formData.price || ''}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="₡5,500"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Orden</Label>
                  <Input
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nombre (Español)</Label>
                  <Input
                    value={formData.name_es}
                    onChange={(e) => setFormData({ ...formData, name_es: e.target.value })}
                    placeholder="Ceviche de Corvina"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Nombre (Inglés)</Label>
                  <Input
                    value={formData.name_en}
                    onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                    placeholder="Corvina Ceviche"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Descripción (Español)</Label>
                  <Textarea
                    value={formData.description_es || ''}
                    onChange={(e) => setFormData({ ...formData, description_es: e.target.value })}
                    placeholder="Corvina fresca, leche de tigre, cilantro..."
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Descripción (Inglés)</Label>
                  <Textarea
                    value={formData.description_en || ''}
                    onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                    placeholder="Fresh corvina, tiger's milk, cilantro..."
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.is_available}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_available: checked })}
                />
                <Label>Disponible</Label>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingItem ? 'Guardar Cambios' : 'Crear Item'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No hay items en el menú. ¡Agrega el primero!
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Disponible</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{item.name_es}</div>
                        <div className="text-sm text-muted-foreground">{item.name_en}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-muted">
                        {getCategoryLabel(item.category)}
                      </span>
                    </TableCell>
                    <TableCell>{item.price || '-'}</TableCell>
                    <TableCell>
                      <Switch
                        checked={item.is_available}
                        onCheckedChange={() => handleToggleAvailable(item.id, item.is_available)}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(item)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default AdminMenu;
