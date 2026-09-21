import AdminLayout from '@/components/admin/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import GiftOrdersTable from '@/components/admin/gifts/GiftOrdersTable';
import GiftSettingsForm from '@/components/admin/gifts/GiftSettingsForm';
import { useNewGiftOrdersCount } from '@/hooks/useGiftOrders';

const AdminGifts = () => {
  const { data: newCount = 0 } = useNewGiftOrdersCount();

  return (
    <AdminLayout
      title="Regalos"
      description="Pedidos de la página Regala Amana (Chef's Table y tarjetas de regalo) y configuración de precios"
    >
      <Tabs defaultValue="orders" className="space-y-6">
        <TabsList>
          <TabsTrigger value="orders" className="gap-2">
            Pedidos
            {newCount > 0 && (
              <Badge className="bg-yolk text-blueberry hover:bg-yolk px-1.5 py-0 text-xs">{newCount}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="settings">Configuración</TabsTrigger>
        </TabsList>

        <TabsContent value="orders">
          <GiftOrdersTable />
        </TabsContent>

        <TabsContent value="settings">
          <GiftSettingsForm />
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default AdminGifts;
