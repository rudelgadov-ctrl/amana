import AdminLayout from '@/components/admin/AdminLayout';
import EventRequestsTable from '@/components/admin/event-requests/EventRequestsTable';

const AdminEventRequests = () => {
  return (
    <AdminLayout
      title="Solicitudes de eventos"
      description="Cotizaciones enviadas desde la página de Eventos (/eventos). Los textos e imágenes de esa página se editan en Traducciones › Página de Eventos e Imágenes › Eventos."
    >
      <EventRequestsTable />
    </AdminLayout>
  );
};

export default AdminEventRequests;
