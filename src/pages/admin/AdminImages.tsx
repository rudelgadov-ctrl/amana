import { useState, useEffect, useRef } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Trash2, Loader2, Upload, Image as ImageIcon, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { seedSiteImages } from '@/lib/seedSiteImages';
import { useQueryClient } from '@tanstack/react-query';

interface SiteImage {
  id: string;
  location: string;
  storage_path: string;
  url: string;
  alt_text_es: string | null;
  alt_text_en: string | null;
  is_active: boolean;
  sort_order: number;
}

const locations = [
  { value: 'hero', label: 'Hero Principal' },
  { value: 'carousel', label: 'Carrusel (Concept)' },
  { value: 'gallery', label: 'Galería' },
  { value: 'chef', label: 'Chef' },
  { value: 'about', label: 'Sobre Nosotros' },
];

const AdminImages = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<SiteImage[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filterLocation, setFilterLocation] = useState<string>('all');
  
  const [uploadData, setUploadData] = useState({
    location: 'hero',
    alt_text_es: '',
    alt_text_en: '',
    file: null as File | null,
    preview: '',
  });

  const fetchImages = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('site_images')
      .select('*')
      .order('location')
      .order('sort_order');

    if (error) {
      toast({ title: 'Error al cargar imágenes', description: error.message, variant: 'destructive' });
    } else {
      setImages(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadData({
        ...uploadData,
        file,
        preview: URL.createObjectURL(file),
      });
    }
  };

  const handleUpload = async () => {
    if (!uploadData.file) {
      toast({ title: 'Error', description: 'Selecciona una imagen', variant: 'destructive' });
      return;
    }

    setIsUploading(true);

    try {
      // Generate unique filename
      const fileExt = uploadData.file.name.split('.').pop();
      const fileName = `${uploadData.location}/${Date.now()}.${fileExt}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('site-images')
        .upload(fileName, uploadData.file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('site-images')
        .getPublicUrl(fileName);

      // Save to database
      const { error: dbError } = await supabase
        .from('site_images')
        .insert([{
          location: uploadData.location,
          storage_path: fileName,
          url: publicUrl,
          alt_text_es: uploadData.alt_text_es || null,
          alt_text_en: uploadData.alt_text_en || null,
          is_active: true,
          sort_order: images.filter(i => i.location === uploadData.location).length,
        }]);

      if (dbError) throw dbError;

      toast({ title: 'Imagen subida correctamente' });
      setIsDialogOpen(false);
      setUploadData({
        location: 'hero',
        alt_text_es: '',
        alt_text_en: '',
        file: null,
        preview: '',
      });
      fetchImages();
    } catch (error: any) {
      toast({ title: 'Error al subir imagen', description: error.message, variant: 'destructive' });
    }

    setIsUploading(false);
  };

  const handleSeedFromCurrentSite = async () => {
    setIsUploading(true);
    try {
      const { inserted } = await seedSiteImages(supabase as any);
      toast({
        title: 'Imágenes importadas',
        description: `Se importaron ${inserted} imágenes al CMS.`,
      });
      fetchImages();
    } catch (error: any) {
      toast({
        title: 'Error al importar imágenes',
        description: error?.message || 'Ocurrió un error inesperado.',
        variant: 'destructive',
      });
    }
    setIsUploading(false);
  };

  const handleDelete = async (image: SiteImage) => {
    if (!confirm('¿Estás seguro de eliminar esta imagen?')) return;

    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('site-images')
        .remove([image.storage_path]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('site_images')
        .delete()
        .eq('id', image.id);

      if (dbError) throw dbError;

      toast({ title: 'Imagen eliminada' });
      fetchImages();
    } catch (error: any) {
      toast({ title: 'Error al eliminar', description: error.message, variant: 'destructive' });
    }
  };

  const handleToggleActive = async (id: string, currentValue: boolean) => {
    const { error } = await supabase
      .from('site_images')
      .update({ is_active: !currentValue })
      .eq('id', id);

    if (error) {
      toast({ title: 'Error al actualizar', description: error.message, variant: 'destructive' });
    } else {
      fetchImages();
      queryClient.invalidateQueries({ queryKey: ['site-images'] });
    }
  };

  const handleRefreshCache = async () => {
    setIsRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ['site-images'] });
    toast({ title: 'Caché actualizado', description: 'Los cambios se reflejarán en el sitio' });
    setIsRefreshing(false);
  };

  const filteredImages = filterLocation === 'all' 
    ? images 
    : images.filter(img => img.location === filterLocation);

  const getLocationLabel = (value: string) => 
    locations.find(l => l.value === value)?.label || value;

  return (
    <AdminLayout title="Gestión de Imágenes" description="Administra las fotos del sitio">
      <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-between">
        <Select value={filterLocation} onValueChange={setFilterLocation}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filtrar por ubicación" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las ubicaciones</SelectItem>
            {locations.map(loc => (
              <SelectItem key={loc.value} value={loc.value}>{loc.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-end">
          <Button variant="outline" onClick={handleRefreshCache} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refrescar Sitio
          </Button>

          <Button
            variant="outline"
            onClick={handleSeedFromCurrentSite}
            disabled={isUploading}
          >
            {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Importar imágenes actuales
          </Button>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Subir Imagen
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Subir Nueva Imagen</DialogTitle>
              <DialogDescription>
                Selecciona una imagen y completa la información
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Ubicación</Label>
                <Select 
                  value={uploadData.location} 
                  onValueChange={(value) => setUploadData({ ...uploadData, location: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map(loc => (
                      <SelectItem key={loc.value} value={loc.value}>{loc.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Imagen</Label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                {uploadData.preview ? (
                  <div className="relative">
                    <img 
                      src={uploadData.preview} 
                      alt="Preview" 
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute bottom-2 right-2"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Cambiar
                    </Button>
                  </div>
                ) : (
                  <div 
                    className="border-2 border-dashed border-muted rounded-lg p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Haz clic para seleccionar una imagen
                    </p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Texto Alt (Español)</Label>
                  <Input
                    value={uploadData.alt_text_es}
                    onChange={(e) => setUploadData({ ...uploadData, alt_text_es: e.target.value })}
                    placeholder="Descripción de la imagen"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Texto Alt (Inglés)</Label>
                  <Input
                    value={uploadData.alt_text_en}
                    onChange={(e) => setUploadData({ ...uploadData, alt_text_en: e.target.value })}
                    placeholder="Image description"
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleUpload} disabled={isUploading || !uploadData.file}>
                {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Subir Imagen
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredImages.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="mb-4">No hay imágenes en el CMS todavía.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={() => setIsDialogOpen(true)} disabled={isUploading}>
                <Plus className="h-4 w-4 mr-2" />
                Subir imagen
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredImages.map((image) => (
            <Card key={image.id} className="overflow-hidden">
              <div className="relative aspect-video">
                <img 
                  src={image.url} 
                  alt={image.alt_text_es || 'Imagen del sitio'} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-background/90 backdrop-blur">
                    {getLocationLabel(image.location)}
                  </span>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={image.is_active}
                      onCheckedChange={() => handleToggleActive(image.id, image.is_active)}
                    />
                    <span className="text-sm text-muted-foreground">
                      {image.is_active ? 'Activa' : 'Inactiva'}
                    </span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(image)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
                {image.alt_text_es && (
                  <p className="mt-2 text-sm text-muted-foreground truncate">
                    {image.alt_text_es}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminImages;
