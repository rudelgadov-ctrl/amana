import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Mail, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useAdminAuthContext } from '@/contexts/AdminAuthContext';
import { GiftOrder, useDeleteGiftOrder, useUpdateGiftOrder } from '@/hooks/useGiftOrders';
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

interface GiftOrderDetailDialogProps {
  order: GiftOrder | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusOf = (order: GiftOrder): GiftOrderStatus => (isGiftOrderStatus(order.status) ? order.status : 'new');

const describeBreakdown = (order: GiftOrder): string => {
  if (order.order_type === 'chefs_table') {
    const base = `${order.quantity} × ${formatCRC(order.unit_price ?? 0, 'es')}`;
    const pairing = order.pairing_quantity
      ? ` + ${order.pairing_quantity} × ${formatCRC(order.pairing_unit_price ?? 0, 'es')} (maridaje)`
      : '';
    return base + pairing;
  }
  return `${order.quantity} × ${formatCRC(order.amount ?? 0, 'es')}`;
};

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-0.5">
    <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
    <div className="text-sm text-foreground">{children}</div>
  </div>
);

const GiftOrderDetailDialog = ({ order, open, onOpenChange }: GiftOrderDetailDialogProps) => {
  const { toast } = useToast();
  const { isAdmin } = useAdminAuthContext();
  const updateOrder = useUpdateGiftOrder();
  const deleteOrder = useDeleteGiftOrder();

  const [status, setStatus] = useState<GiftOrderStatus>('new');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (order) {
      setStatus(statusOf(order));
      setNotes(order.admin_notes ?? '');
    }
  }, [order]);

  if (!order) return null;

  const isDirty = status !== statusOf(order) || (notes.trim() || '') !== (order.admin_notes ?? '');

  const handleSave = async () => {
    try {
      await updateOrder.mutateAsync({
        id: order.id,
        updates: { status, admin_notes: notes.trim() ? notes.trim() : null },
      });
      toast({ title: 'Pedido actualizado', description: 'Los cambios se guardaron correctamente' });
    } catch (error) {
      toast({ title: 'Error', description: 'No se pudo actualizar el pedido', variant: 'destructive' });
    }
  };

  const handleDelete = async () => {
    if (!confirm(`¿Eliminar el pedido ${order.order_code}? Esta acción no se puede deshacer.`)) return;
    try {
      await deleteOrder.mutateAsync(order.id);
      toast({ title: 'Pedido eliminado' });
      onOpenChange(false);
    } catch (error) {
      toast({ title: 'Error', description: 'No se pudo eliminar el pedido', variant: 'destructive' });
    }
  };

  const typeLabel = isOrderType(order.order_type) ? ORDER_TYPE_LABELS[order.order_type] : order.order_type;
  const paymentLabel = isPaymentMethod(order.payment_method)
    ? PAYMENT_LABELS[order.payment_method]
    : order.payment_method;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span className="font-mono">{order.order_code}</span>
            <Badge className={STATUS_BADGE_CLASS[statusOf(order)]}>{STATUS_LABELS[statusOf(order)]}</Badge>
          </DialogTitle>
          <DialogDescription>
            Recibido el {format(new Date(order.created_at), 'dd/MM/yyyy HH:mm')} · Idioma: {order.language.toUpperCase()}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
          <Row label="Tipo">{typeLabel}</Row>
          <Row label="Detalle">{describeBreakdown(order)}</Row>
          <Row label="Total">
            <span className="text-lg font-semibold">{formatCRC(order.total, 'es')}</span>
          </Row>
          <Row label="Método de pago">{paymentLabel}</Row>
          <Row label="Cliente">
            {order.first_name} {order.last_name}
          </Row>
          <Row label="Correo">
            <a
              href={`mailto:${order.email}?subject=${encodeURIComponent(`Amana — pedido ${order.order_code}`)}`}
              className="inline-flex items-center gap-1.5 text-primary hover:underline"
            >
              <Mail className="h-3.5 w-3.5" />
              {order.email}
            </a>
          </Row>
          <div className="sm:col-span-2">
            <Row label="Mensaje del cliente">
              {order.message ? (
                <blockquote className="rounded-md border-l-4 border-yolk bg-muted/50 px-3 py-2 italic">
                  {order.message}
                </blockquote>
              ) : (
                <span className="text-muted-foreground">—</span>
              )}
            </Row>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-4 border-t pt-4">
          <div className="space-y-2">
            <Label htmlFor="order-status">Estado</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as GiftOrderStatus)}>
              <SelectTrigger id="order-status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {GIFT_ORDER_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="order-notes">Notas internas</Label>
            <Textarea
              id="order-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej: pago recibido por SINPE el 12/10, tarjeta entregada en mano"
              className="min-h-[88px]"
            />
          </div>
        </div>

        <DialogFooter className="flex-col-reverse sm:flex-row sm:justify-between gap-2">
          <div>
            {isAdmin && (
              <Button variant="ghost" onClick={handleDelete} disabled={deleteOrder.isPending} className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </Button>
            )}
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cerrar
            </Button>
            <Button onClick={handleSave} disabled={!isDirty || updateOrder.isPending}>
              {updateOrder.isPending ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GiftOrderDetailDialog;
