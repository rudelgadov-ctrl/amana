import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Pencil, Trash2, Loader2, RefreshCw, Settings2, ArrowUp, ArrowDown } from 'lucide-react';
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
  price_es: string | null;
  price_en: string | null;
  is_available: boolean;
  sort_order: number;
}

interface MenuCategory {
  id: string;
  value: string;
  label_es: string;
  label_en: string;
  parent_value: string | null;
  sort_order: number;
  is_active: boolean;
}

const emptyItem: Omit<MenuItem, 'id'> = {
  category: 'starters',
  subcategory: null,
  name_es: '',
  name_en: '',
  description_es: '',
  description_en: '',
  price: '',
  price_es: '',
  price_en: '',
  is_available: true,
  sort_order: 0,
};

const emptyCategory = {
  value: '',
  label_es: '',
  label_en: '',
  parent_value: null as string | null,
  sort_order: 0,
};

const AdminMenu = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [allCategories, setAllCategories] = useState<MenuCategory[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState(emptyItem);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Categories management
  const [isCatDialogOpen, setIsCatDialogOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<MenuCategory | null>(null);
  const [catForm, setCatForm] = useState(emptyCategory);
  const [isCatSaving, setIsCatSaving] = useState(false);

  // Derived lists
  const categories = allCategories.filter(c => c.parent_value === null);
  const subcategoriesByParent = (parent: string) =>
    allCategories.filter(c => c.parent_value === parent);

  const fetchItems = async () => {
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
  };

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('menu_categories')
      .select('*')
      .order('sort_order');
    if (error) {
      toast({ title: 'Error al cargar categorías', description: error.message, variant: 'destructive' });
    } else {
      setAllCategories((data || []) as MenuCategory[]);
    }
  };

  const fetchAll = async () => {
    setIsLoading(true);
    await Promise.all([fetchItems(), fetchCategories()]);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAll();
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
        price_es: item.price_es || '',
        price_en: item.price_en || '',
        is_available: item.is_available,
        sort_order: item.sort_order,
      });
    } else {
      setEditingItem(null);
      setFormData({ ...emptyItem, category: categories[0]?.value || 'starters' });
    }
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name_es || !formData.name_en) {
      toast({ title: 'Error', description: 'El nombre es requerido en ambos idiomas', variant: 'destructive' });
      return;
    }

    setIsSaving(true);
    const hasSubs = subcategoriesByParent(formData.category).length > 0;
    const itemData = {
      ...formData,
      subcategory: hasSubs ? formData.subcategory : null,
    };

    if (editingItem) {
      const { error } = await supabase.from('menu_items').update(itemData).eq('id', editingItem.id);
      if (error) {
        toast({ title: 'Error al actualizar', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Item actualizado' });
        setIsDialogOpen(false);
        fetchItems();
      }
    } else {
      const { error } = await supabase.from('menu_items').insert([itemData]);
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
    const { error } = await supabase.from('menu_items').delete().eq('id', id);
    if (error) {
      toast({ title: 'Error al eliminar', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Item eliminado' });
      fetchItems();
    }
  };

  const handleToggleAvailable = async (id: string, currentValue: boolean) => {
    const { error } = await supabase.from('menu_items').update({ is_available: !currentValue }).eq('id', id);
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
    await queryClient.invalidateQueries({ queryKey: ['menu-categories'] });
    toast({ title: 'Caché actualizado', description: 'Los cambios se reflejarán en el sitio' });
    setIsRefreshing(false);
  };

  // Swap sort_order between two menu items
  const swapItems = async (a: MenuItem, b: MenuItem) => {
    const updates = await Promise.all([
      supabase.from('menu_items').update({ sort_order: b.sort_order }).eq('id', a.id),
      supabase.from('menu_items').update({ sort_order: a.sort_order }).eq('id', b.id),
    ]);
    if (updates.some(u => u.error)) {
      toast({ title: 'Error al reordenar', variant: 'destructive' });
    } else {
      await fetchItems();
      queryClient.invalidateQueries({ queryKey: ['menu-items'] });
    }
  };

  const moveItem = async (item: MenuItem, direction: 'up' | 'down') => {
    const siblings = sortedItems.filter(
      i => i.category === item.category && (i.subcategory ?? null) === (item.subcategory ?? null)
    );
    const idx = siblings.findIndex(i => i.id === item.id);
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= siblings.length) return;
    const target = siblings[targetIdx];
    if (item.sort_order === target.sort_order) {
      await supabase.from('menu_items')
        .update({ sort_order: (target.sort_order ?? 0) + 1 })
        .eq('id', direction === 'down' ? target.id : item.id);
    }
    await swapItems(item, target);
  };

  // Swap sort_order between two categories (same parent scope)
  const swapCategories = async (a: MenuCategory, b: MenuCategory) => {
    const updates = await Promise.all([
      supabase.from('menu_categories').update({ sort_order: b.sort_order }).eq('id', a.id),
      supabase.from('menu_categories').update({ sort_order: a.sort_order }).eq('id', b.id),
    ]);
    if (updates.some(u => u.error)) {
      toast({ title: 'Error al reordenar', variant: 'destructive' });
    } else {
      await fetchCategories();
      queryClient.invalidateQueries({ queryKey: ['menu-categories'] });
    }
  };

  const moveCategory = async (cat: MenuCategory, direction: 'up' | 'down') => {
    const siblings = allCategories
      .filter(c => (c.parent_value ?? null) === (cat.parent_value ?? null))
      .sort((x, y) => (x.sort_order ?? 0) - (y.sort_order ?? 0));
    const idx = siblings.findIndex(c => c.id === cat.id);
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= siblings.length) return;
    const target = siblings[targetIdx];
    if (cat.sort_order === target.sort_order) {
      await supabase.from('menu_categories')
        .update({ sort_order: (target.sort_order ?? 0) + 1 })
        .eq('id', direction === 'down' ? target.id : cat.id);
    }
    await swapCategories(cat, target);
  };

  // === Category management ===
  const slugify = (s: string) =>
    s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');

  const openCatDialog = (cat?: MenuCategory, parent: string | null = null) => {
    if (cat) {
      setEditingCat(cat);
      setCatForm({
        value: cat.value,
        label_es: cat.label_es,
        label_en: cat.label_en,
        parent_value: cat.parent_value,
        sort_order: cat.sort_order,
      });
    } else {
      setEditingCat(null);
      setCatForm({ ...emptyCategory, parent_value: parent });
    }
    setIsCatDialogOpen(true);
  };

  const handleSaveCategory = async () => {
    if (!catForm.label_es || !catForm.label_en) {
      toast({ title: 'Error', description: 'Las etiquetas son requeridas en ambos idiomas', variant: 'destructive' });
      return;
    }
    setIsCatSaving(true);

    const value = catForm.value || slugify(catForm.label_en || catForm.label_es);
    const payload = { ...catForm, value };

    if (editingCat) {
      // If value changed, propagate to menu_items
      const oldValue = editingCat.value;
      const { error } = await supabase.from('menu_categories').update(payload).eq('id', editingCat.id);
      if (error) {
        toast({ title: 'Error al actualizar categoría', description: error.message, variant: 'destructive' });
        setIsCatSaving(false);
        return;
      }
      if (oldValue !== value) {
        if (editingCat.parent_value === null) {
          await supabase.from('menu_items').update({ category: value }).eq('category', oldValue);
          await supabase.from('menu_categories').update({ parent_value: value }).eq('parent_value', oldValue);
        } else {
          await supabase.from('menu_items').update({ subcategory: value }).eq('subcategory', oldValue);
        }
      }
      toast({ title: 'Categoría actualizada' });
    } else {
      const { error } = await supabase.from('menu_categories').insert([payload]);
      if (error) {
        toast({ title: 'Error al crear categoría', description: error.message, variant: 'destructive' });
        setIsCatSaving(false);
        return;
      }
      toast({ title: 'Categoría creada' });
    }

    setIsCatDialogOpen(false);
    await fetchCategories();
    queryClient.invalidateQueries({ queryKey: ['menu-categories'] });
    setIsCatSaving(false);
  };

  const handleDeleteCategory = async (cat: MenuCategory) => {
    // Check if items are using it
    const inUse = items.some(i =>
      cat.parent_value === null ? i.category === cat.value : i.subcategory === cat.value
    );
    if (inUse) {
      toast({
        title: 'No se puede eliminar',
        description: 'Hay items del menú usando esta categoría. Reasígnalos primero.',
        variant: 'destructive',
      });
      return;
    }
    if (!confirm(`¿Eliminar "${cat.label_es}"?`)) return;
    const { error } = await supabase.from('menu_categories').delete().eq('id', cat.id);
    if (error) {
      toast({ title: 'Error al eliminar', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Categoría eliminada' });
      await fetchCategories();
      queryClient.invalidateQueries({ queryKey: ['menu-categories'] });
    }
  };

  // Sort items in the same order as the public menu:
  // 1) parent category sort_order, 2) subcategory sort_order, 3) item sort_order
  const catOrder = (value: string) =>
    allCategories.find(c => c.parent_value === null && c.value === value)?.sort_order ?? 999;
  const subOrder = (parent: string, value: string | null) => {
    if (!value) return -1;
    return allCategories.find(c => c.parent_value === parent && c.value === value)?.sort_order ?? 999;
  };
  const sortedItems = [...items].sort((a, b) => {
    const ca = catOrder(a.category);
    const cb = catOrder(b.category);
    if (ca !== cb) return ca - cb;
    const sa = subOrder(a.category, a.subcategory);
    const sb = subOrder(b.category, b.subcategory);
    if (sa !== sb) return sa - sb;
    return (a.sort_order ?? 0) - (b.sort_order ?? 0);
  });

  const filteredItems = filterCategory === 'all'
    ? sortedItems
    : sortedItems.filter(item => item.category === filterCategory);

  const getCategoryLabel = (value: string) =>
    categories.find(c => c.value === value)?.label_es || value;

  const getSubcategoryLabel = (parent: string, value: string | null) => {
    if (!value) return null;
    return allCategories.find(c => c.parent_value === parent && c.value === value)?.label_es || value;
  };

  const currentSubcategories = subcategoriesByParent(formData.category);

  return (
    <AdminLayout title="Gestión del Menú" description="Administra los platillos, bebidas y categorías">
      <Tabs defaultValue="items" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="items">Items del Menú</TabsTrigger>
          <TabsTrigger value="categories">
            <Settings2 className="h-4 w-4 mr-2" />
            Categorías
          </TabsTrigger>
        </TabsList>

        {/* === ITEMS TAB === */}
        <TabsContent value="items">
          <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-between">
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filtrar por categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat.value} value={cat.value}>{cat.label_es}</SelectItem>
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
                          onValueChange={(value) => setFormData({ ...formData, category: value, subcategory: null })}
                        >
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {categories.map(cat => (
                              <SelectItem key={cat.value} value={cat.value}>{cat.label_es}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {currentSubcategories.length > 0 && (
                        <div className="space-y-2">
                          <Label>Subcategoría</Label>
                          <Select
                            value={formData.subcategory || ''}
                            onValueChange={(value) => setFormData({ ...formData, subcategory: value })}
                          >
                            <SelectTrigger><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
                            <SelectContent>
                              {currentSubcategories.map(sub => (
                                <SelectItem key={sub.value} value={sub.value}>{sub.label_es}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label>Precio (Español)</Label>
                        <Input
                          value={formData.price_es || ''}
                          onChange={(e) => setFormData({ ...formData, price_es: e.target.value, price: e.target.value })}
                          placeholder="₡5.500 / Copa ₡4.000 Botella ₡20.000"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Precio (Inglés)</Label>
                        <Input
                          value={formData.price_en || ''}
                          onChange={(e) => setFormData({ ...formData, price_en: e.target.value })}
                          placeholder="₡5,500 / Glass ₡4,000 Bottle ₡20,000"
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
                        <Input value={formData.name_es} onChange={(e) => setFormData({ ...formData, name_es: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label>Nombre (Inglés)</Label>
                        <Input value={formData.name_en} onChange={(e) => setFormData({ ...formData, name_en: e.target.value })} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Descripción (Español)</Label>
                        <Textarea value={formData.description_es || ''} onChange={(e) => setFormData({ ...formData, description_es: e.target.value })} rows={3} />
                      </div>
                      <div className="space-y-2">
                        <Label>Descripción (Inglés)</Label>
                        <Textarea value={formData.description_en || ''} onChange={(e) => setFormData({ ...formData, description_en: e.target.value })} rows={3} />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Switch checked={formData.is_available} onCheckedChange={(checked) => setFormData({ ...formData, is_available: checked })} />
                      <Label>Disponible</Label>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
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
                <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
              ) : filteredItems.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No hay items en el menú.</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[110px]">Orden</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Categoría</TableHead>
                      <TableHead>Precio</TableHead>
                      <TableHead>Disponible</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map((item) => {
                      const siblings = sortedItems.filter(
                        i => i.category === item.category && (i.subcategory ?? null) === (item.subcategory ?? null)
                      );
                      const idx = siblings.findIndex(i => i.id === item.id);
                      const isFirst = idx === 0;
                      const isLast = idx === siblings.length - 1;
                      return (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="icon" className="h-7 w-7" disabled={isFirst} onClick={() => moveItem(item, 'up')} title="Subir">
                                <ArrowUp className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-7 w-7" disabled={isLast} onClick={() => moveItem(item, 'down')} title="Bajar">
                                <ArrowDown className="h-4 w-4" />
                              </Button>
                              <span className="text-xs text-muted-foreground ml-1">{item.sort_order}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{item.name_es}</div>
                              <div className="text-sm text-muted-foreground">{item.name_en}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap items-center gap-1">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-muted">
                                {getCategoryLabel(item.category)}
                              </span>
                              {item.subcategory && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                                  {getSubcategoryLabel(item.category, item.subcategory)}
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{item.price || '-'}</TableCell>
                          <TableCell>
                            <Switch checked={item.is_available} onCheckedChange={() => handleToggleAvailable(item.id, item.is_available)} />
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                              <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(item)}><Pencil className="h-4 w-4" /></Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* === CATEGORIES TAB === */}
        <TabsContent value="categories">
          <div className="flex justify-end mb-4">
            <Button onClick={() => openCatDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Categoría
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : (
            <div className="space-y-4">
              {categories.map((cat, ci) => {
                const subs = subcategoriesByParent(cat.value).sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
                return (
                <Card key={cat.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="flex flex-col">
                          <Button variant="ghost" size="icon" className="h-6 w-6" disabled={ci === 0} onClick={() => moveCategory(cat, 'up')} title="Subir">
                            <ArrowUp className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-6 w-6" disabled={ci === categories.length - 1} onClick={() => moveCategory(cat, 'down')} title="Bajar">
                            <ArrowDown className="h-3 w-3" />
                          </Button>
                        </div>
                        <div>
                          <div className="font-display text-lg font-bold">{cat.label_es}</div>
                          <div className="text-sm text-muted-foreground">{cat.label_en} · <code className="text-xs">{cat.value}</code> · orden {cat.sort_order}</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => openCatDialog(undefined, cat.value)}>
                          <Plus className="h-3 w-3 mr-1" /> Subcategoría
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => openCatDialog(cat)}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteCategory(cat)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </div>
                    </div>
                    {subs.length > 0 && (
                      <div className="ml-4 border-l-2 border-muted pl-4 space-y-2">
                        {subs.map((sub, si) => (
                          <div key={sub.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="flex flex-col">
                                <Button variant="ghost" size="icon" className="h-5 w-5" disabled={si === 0} onClick={() => moveCategory(sub, 'up')} title="Subir">
                                  <ArrowUp className="h-3 w-3" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-5 w-5" disabled={si === subs.length - 1} onClick={() => moveCategory(sub, 'down')} title="Bajar">
                                  <ArrowDown className="h-3 w-3" />
                                </Button>
                              </div>
                              <div>
                                <div className="font-medium text-sm">{sub.label_es}</div>
                                <div className="text-xs text-muted-foreground">{sub.label_en} · <code>{sub.value}</code> · orden {sub.sort_order}</div>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon" onClick={() => openCatDialog(sub)}><Pencil className="h-3 w-3" /></Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteCategory(sub)}><Trash2 className="h-3 w-3 text-destructive" /></Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
                );
              })}
            </div>
          )}

          {/* Category Dialog */}
          <Dialog open={isCatDialogOpen} onOpenChange={setIsCatDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingCat ? 'Editar Categoría' : 'Nueva Categoría'}</DialogTitle>
                <DialogDescription>
                  {catForm.parent_value
                    ? `Subcategoría de "${categories.find(c => c.value === catForm.parent_value)?.label_es || catForm.parent_value}"`
                    : 'Categoría principal del menú'}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label>Nombre (Español)</Label>
                  <Input value={catForm.label_es} onChange={(e) => setCatForm({ ...catForm, label_es: e.target.value })} placeholder="Entradas" />
                </div>
                <div className="space-y-2">
                  <Label>Nombre (Inglés)</Label>
                  <Input value={catForm.label_en} onChange={(e) => setCatForm({ ...catForm, label_en: e.target.value })} placeholder="Starters" />
                </div>
                <div className="space-y-2">
                  <Label>Identificador interno (opcional)</Label>
                  <Input
                    value={catForm.value}
                    onChange={(e) => setCatForm({ ...catForm, value: e.target.value })}
                    placeholder="se genera automáticamente"
                  />
                  <p className="text-xs text-muted-foreground">Solo letras minúsculas, números y guiones bajos. Si lo dejas vacío, se genera del nombre.</p>
                </div>
                <div className="space-y-2">
                  <Label>Orden</Label>
                  <Input
                    type="number"
                    value={catForm.sort_order}
                    onChange={(e) => setCatForm({ ...catForm, sort_order: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCatDialogOpen(false)}>Cancelar</Button>
                <Button onClick={handleSaveCategory} disabled={isCatSaving}>
                  {isCatSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingCat ? 'Guardar' : 'Crear'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default AdminMenu;
