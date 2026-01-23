import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Plus, Pencil, Trash2, Loader2, Save, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Translation {
  id: string;
  key: string;
  section: string;
  text_es: string;
  text_en: string;
}

const sections = [
  { value: 'nav', label: 'Navegación' },
  { value: 'hero', label: 'Hero' },
  { value: 'concept', label: 'Concepto' },
  { value: 'reservation', label: 'Reservaciones' },
  { value: 'reviews', label: 'Reseñas' },
  { value: 'cta', label: 'CTA' },
  { value: 'footer', label: 'Footer' },
  { value: 'hours', label: 'Horarios' },
  { value: 'about', label: 'Sobre Nosotros' },
  { value: 'menu', label: 'Menú' },
  { value: 'contact', label: 'Contacto' },
];

const emptyTranslation = {
  key: '',
  section: 'nav',
  text_es: '',
  text_en: '',
};

const AdminTranslations = () => {
  const { toast } = useToast();
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Translation | null>(null);
  const [formData, setFormData] = useState(emptyTranslation);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingInline, setEditingInline] = useState<string | null>(null);
  const [inlineData, setInlineData] = useState({ text_es: '', text_en: '' });

  const fetchTranslations = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('site_translations')
      .select('*')
      .order('section')
      .order('key');

    if (error) {
      toast({ title: 'Error al cargar traducciones', description: error.message, variant: 'destructive' });
    } else {
      setTranslations(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchTranslations();
  }, []);

  const handleOpenDialog = (item?: Translation) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        key: item.key,
        section: item.section,
        text_es: item.text_es,
        text_en: item.text_en,
      });
    } else {
      setEditingItem(null);
      setFormData(emptyTranslation);
    }
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.key || !formData.text_es || !formData.text_en) {
      toast({ title: 'Error', description: 'Todos los campos son requeridos', variant: 'destructive' });
      return;
    }

    setIsSaving(true);

    if (editingItem) {
      const { error } = await supabase
        .from('site_translations')
        .update({
          section: formData.section,
          text_es: formData.text_es,
          text_en: formData.text_en,
        })
        .eq('id', editingItem.id);

      if (error) {
        toast({ title: 'Error al actualizar', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Traducción actualizada' });
        setIsDialogOpen(false);
        fetchTranslations();
      }
    } else {
      const { error } = await supabase
        .from('site_translations')
        .insert([formData]);

      if (error) {
        toast({ title: 'Error al crear', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Traducción creada' });
        setIsDialogOpen(false);
        fetchTranslations();
      }
    }

    setIsSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta traducción?')) return;

    const { error } = await supabase
      .from('site_translations')
      .delete()
      .eq('id', id);

    if (error) {
      toast({ title: 'Error al eliminar', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Traducción eliminada' });
      fetchTranslations();
    }
  };

  const startInlineEdit = (t: Translation) => {
    setEditingInline(t.id);
    setInlineData({ text_es: t.text_es, text_en: t.text_en });
  };

  const saveInlineEdit = async (id: string) => {
    const { error } = await supabase
      .from('site_translations')
      .update({
        text_es: inlineData.text_es,
        text_en: inlineData.text_en,
      })
      .eq('id', id);

    if (error) {
      toast({ title: 'Error al actualizar', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Guardado' });
      setEditingInline(null);
      fetchTranslations();
    }
  };

  const filteredTranslations = translations.filter(t => 
    t.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.text_es.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.text_en.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedTranslations = sections.map(section => ({
    ...section,
    items: filteredTranslations.filter(t => t.section === section.value),
  })).filter(section => section.items.length > 0);

  return (
    <AdminLayout title="Traducciones" description="Gestiona los textos bilingües del sitio">
      <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar traducciones..."
            className="pl-10"
          />
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Traducción
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Editar Traducción' : 'Nueva Traducción'}</DialogTitle>
              <DialogDescription>
                Define el texto en español e inglés
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Clave (Key)</Label>
                  <Input
                    value={formData.key}
                    onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                    placeholder="hero.title"
                    disabled={!!editingItem}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Sección</Label>
                  <Select 
                    value={formData.section} 
                    onValueChange={(value) => setFormData({ ...formData, section: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sections.map(s => (
                        <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Español 🇪🇸</Label>
                  <Textarea
                    value={formData.text_es}
                    onChange={(e) => setFormData({ ...formData, text_es: e.target.value })}
                    placeholder="Texto en español..."
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Inglés 🇺🇸</Label>
                  <Textarea
                    value={formData.text_en}
                    onChange={(e) => setFormData({ ...formData, text_en: e.target.value })}
                    placeholder="Text in English..."
                    rows={4}
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingItem ? 'Guardar Cambios' : 'Crear'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : groupedTranslations.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No hay traducciones. ¡Agrega la primera o migra las existentes!
          </CardContent>
        </Card>
      ) : (
        <Accordion type="multiple" className="space-y-4">
          {groupedTranslations.map((section) => (
            <AccordionItem key={section.value} value={section.value} className="border rounded-lg">
              <AccordionTrigger className="px-4 hover:no-underline">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{section.label}</span>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                    {section.items.length}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="space-y-3">
                  {section.items.map((t) => (
                    <div key={t.id} className="border rounded-lg p-3 bg-card">
                      <div className="flex items-center justify-between mb-2">
                        <code className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                          {t.key}
                        </code>
                        <div className="flex gap-1">
                          {editingInline === t.id ? (
                            <Button size="sm" onClick={() => saveInlineEdit(t.id)}>
                              <Save className="h-3 w-3 mr-1" />
                              Guardar
                            </Button>
                          ) : (
                            <>
                              <Button variant="ghost" size="icon" onClick={() => startInlineEdit(t)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDelete(t.id)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                      {editingInline === t.id ? (
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label className="text-xs">🇪🇸 Español</Label>
                            <Textarea
                              value={inlineData.text_es}
                              onChange={(e) => setInlineData({ ...inlineData, text_es: e.target.value })}
                              rows={2}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">🇺🇸 English</Label>
                            <Textarea
                              value={inlineData.text_en}
                              onChange={(e) => setInlineData({ ...inlineData, text_en: e.target.value })}
                              rows={2}
                              className="mt-1"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-xs text-muted-foreground">🇪🇸</span>
                            <p className="mt-1">{t.text_es}</p>
                          </div>
                          <div>
                            <span className="text-xs text-muted-foreground">🇺🇸</span>
                            <p className="mt-1">{t.text_en}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </AdminLayout>
  );
};

export default AdminTranslations;
