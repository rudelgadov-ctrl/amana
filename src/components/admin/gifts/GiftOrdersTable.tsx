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
import { GiftOrder, useGiftOrders, useUpdateGiftOrder } from '@/hooks/useGiftOrders';
import { formatCRC } from '@/lib/format';
import {
  GIFT_ORDER_STATUSES,
  GiftOrderStatus,
  ORDER_TYPE_LABELS,
  PAYMENT_LABELS,
  STATUS_BADGE_CLASS,
  STATUS_LABELS,
  isGiftOrderStatus,
  isOrderType,
  isPaymentMethod,
} from '@/lib/gift';
import GiftOrderDetailDialog from './GiftOrderDetailDialog';

type StatusFilter = GiftOrderStatus | 'all';

const GiftOrdersTable = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: orders, isLoading } = useGiftOrders();
  const updateOrder = useUpdateGiftOrder();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selected, setSelected] = useState<GiftOrder | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const filtered = useMemo(() => {
    if (!orders) return [];
    const term = search.trim().toLowerCase();
    return orders.filter((order) => {
      if (statusFilter !== 'all' && order.status !== statusFilter) return false;
      if (!term) return true;
      const haystack = `${order.order_code} ${order.first_name} ${order.last_name} ${order.email}`.toLowerCase();
      return haystack.includes(term);
    });
  }, [orders, search, statusFilter]);

  // Keep the dialog in sync with fresh data after a save
  const selectedOrder = selected ? orders?.find((o) => o.id === selected.id) ?? selected : null;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ['gift-orders'] });
    setIsRefreshing(false);
    toast({ title: 'Pedidos actualizados' });
  };

  const handleQuickStatus = async (order: GiftOrder, status: GiftOrderStatus) => {
    if (status === order.status) return;
    try {
      await updateOrder.mutateAsync({ id: order.id, updates: { status } });
      toast({ title: 'Estado actualizado', description: `${order.order_code} → ${STATUS_LABELS[status]}` });
    } catch (error) {
      toast({ title: 'Error', description: 'No se pudo cambiar el estado', variant: 'destructive' });
    }
  };

  const openDetail = (order: GiftOrder) => {
    setSelected(order);
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
              placeholder="Buscar por código, nombre o correo"
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
            <SelectTrigger className="sm:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              {GIFT_ORDER_STATUSES.map((s) => (
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
              <TableHead>Fecha</TableHead>
              <TableHead>Código</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>Pago</TableHead>
              <TableHead className="w-44">Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  Cargando pedidos...
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  {orders && orders.length > 0
                    ? 'Ningún pedido coincide con el filtro.'
                    : 'Aún no hay pedidos. Aparecerán aquí cuando alguien ordene desde la página Regala.'}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((order) => {
                const status = isGiftOrderStatus(order.status) ? order.status : 'new';
                return (
                  <TableRow
                    key={order.id}
                    onClick={() => openDetail(order)}
                    className="cursor-pointer"
                  >
                    <TableCell className="whitespace-nowrap text-sm">
                      {format(new Date(order.created_at), 'dd/MM/yyyy HH:mm')}
                    </TableCell>
                    <TableCell className="font-mono text-sm">{order.order_code}</TableCell>
                    <TableCell className="text-sm">
                      {isOrderType(order.order_type) ? ORDER_TYPE_LABELS[order.order_type] : order.order_type}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-0.5">
                        <p className="font-medium text-sm">
                          {order.first_name} {order.last_name}
                        </p>
                        <p className="text-xs text-muted-foreground">{order.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium whitespace-nowrap">
                      {formatCRC(order.total, 'es')}
                    </TableCell>
                    <TableCell className="text-sm">
                      {isPaymentMethod(order.payment_method) ? PAYMENT_LABELS[order.payment_method] : order.payment_method}
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Select value={status} onValueChange={(v) => handleQuickStatus(order, v as GiftOrderStatus)}>
                        <SelectTrigger className="h-8 border-0 bg-transparent px-1 shadow-none focus:ring-0">
                          <Badge className={STATUS_BADGE_CLASS[status]}>{STATUS_LABELS[status]}</Badge>
                        </SelectTrigger>
                        <SelectContent>
                          {GIFT_ORDER_STATUSES.map((s) => (
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

      <GiftOrderDetailDialog order={selectedOrder} open={isDetailOpen} onOpenChange={setIsDetailOpen} />
    </div>
  );
};

export default GiftOrdersTable;
