import { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { RefreshCw, Search } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { EventRequest, useEventRequests, useUpdateEventRequest } from '@/hooks/useEventRequests';
import {
  EVENT_REQUEST_STATUSES,
  EVENT_TYPE_LABELS,
  EventRequestStatus,
  SPACE_LABELS,
  STATUS_BADGE_CLASS,
  STATUS_LABELS,
  isEventRequestStatus,
  isEventSpace,
  isEventType,
  parseISODate,
} from '@/lib/eventRequests';
import EventRequestDetailDialog from './EventRequestDetailDialog';

type StatusFilter = EventRequestStatus | 'all';

const EventRequestsTable = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: requests, isLoading } = useEventRequests();
  const updateRequest = useUpdateEventRequest();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selected, setSelected] = useState<EventRequest | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const filtered = useMemo(() => {
    if (!requests) return [];
    const term = search.trim().toLowerCase();
    return requests.filter((request) => {
      if (statusFilter !== 'all' && request.status !== statusFilter) return false;
      if (!term) return true;
      const haystack =
        `${request.request_code} ${request.name} ${request.company ?? ''} ${request.email} ${request.phone}`.toLowerCase();
      return haystack.includes(term);
    });
  }, [requests, search, statusFilter]);

  // Keep the dialog in sync with fresh data after a save
  const selectedRequest = selected ? requests?.find((r) => r.id === selected.id) ?? selected : null;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ['event-requests'] });
    setIsRefreshing(false);
    toast({ title: 'Solicitudes actualizadas' });
  };

  const handleQuickStatus = async (request: EventRequest, status: EventRequestStatus) => {
    if (status === request.status) return;
    try {
      await updateRequest.mutateAsync({ id: request.id, updates: { status } });
      toast({ title: 'Estado actualizado', description: `${request.request_code} → ${STATUS_LABELS[status]}` });
    } catch (error) {
      toast({ title: 'Error', description: 'No se pudo cambiar el estado', variant: 'destructive' });
    }
  };

  const openDetail = (request: EventRequest) => {
    setSelected(request);
    setIsDetailOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <div className="relative sm:max-w-xs flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por código, nombre, empresa o contacto"
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
            <SelectTrigger className="sm:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              {EVENT_REQUEST_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {STATUS_LABELS[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refrescar
        </Button>
      </div>

      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Recibida</TableHead>
              <TableHead>Código</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Fecha del evento</TableHead>
              <TableHead className="text-right">Personas</TableHead>
              <TableHead>Espacio</TableHead>
              <TableHead className="w-44">Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  Cargando solicitudes...
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  {requests && requests.length > 0
                    ? 'Ninguna solicitud coincide con el filtro.'
                    : 'Aún no hay solicitudes. Aparecerán aquí cuando alguien cotice desde la página de Eventos.'}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((request) => {
                const status = isEventRequestStatus(request.status) ? request.status : 'new';
                return (
                  <TableRow key={request.id} onClick={() => openDetail(request)} className="cursor-pointer">
                    <TableCell className="whitespace-nowrap text-sm">
                      {format(new Date(request.created_at), 'dd/MM/yyyy HH:mm')}
                    </TableCell>
                    <TableCell className="font-mono text-sm">{request.request_code}</TableCell>
                    <TableCell>
                      <div className="space-y-0.5">
                        <p className="font-medium text-sm">{request.name}</p>
                        <p className="text-xs text-muted-foreground">{request.company || request.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {isEventType(request.event_type) ? EVENT_TYPE_LABELS[request.event_type] : request.event_type}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm">
                      {format(parseISODate(request.event_date), 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell className="text-right font-medium">{request.guests}</TableCell>
                    <TableCell className="text-sm">
                      {isEventSpace(request.space) ? SPACE_LABELS[request.space] : request.space}
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Select value={status} onValueChange={(v) => handleQuickStatus(request, v as EventRequestStatus)}>
                        <SelectTrigger className="h-8 border-0 bg-transparent px-1 shadow-none focus:ring-0">
                          <Badge className={STATUS_BADGE_CLASS[status]}>{STATUS_LABELS[status]}</Badge>
                        </SelectTrigger>
                        <SelectContent>
                          {EVENT_REQUEST_STATUSES.map((s) => (
                            <SelectItem key={s} value={s}>
                              {STATUS_LABELS[s]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <EventRequestDetailDialog request={selectedRequest} open={isDetailOpen} onOpenChange={setIsDetailOpen} />
    </div>
  );
};

export default EventRequestsTable;
