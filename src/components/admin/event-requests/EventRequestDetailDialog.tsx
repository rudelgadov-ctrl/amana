import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Mail, MessageCircle, Phone, Send, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
import {
  EventRequest,
  useDeleteEventRequest,
  useSendEventRequestEmail,
  useUpdateEventRequest,
} from '@/hooks/useEventRequests';
import {
  EVENT_REQUEST_STATUSES,
  EVENT_TYPE_LABELS,
  EventRequestStatus,
  MENU_PREFERENCE_LABELS,
  SPACE_LABELS,
  STATUS_BADGE_CLASS,
  STATUS_LABELS,
  capacityExceeded,
  formatBudget,
  formatEventDate,
  isBudgetCurrency,
  isBudgetType,
  isEventRequestStatus,
  isEventSpace,
  isEventType,
  isMenuPreference,
  needsCustomQuote,
  parseISODate,
  toWhatsAppNumber,
} from '@/lib/eventRequests';
import {
  EVENT_EMAIL_TEMPLATE_KEYS,
  EVENT_EMAIL_TEMPLATE_LABELS,
  EventEmailTemplateKey,
  getEventRequestEmailTemplate,
} from '@/lib/eventRequestEmailTemplates';

interface EventRequestDetailDialogProps {
  request: EventRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusOf = (request: EventRequest): EventRequestStatus =>
  isEventRequestStatus(request.status) ? request.status : 'new';

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-0.5">
    <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
    <div className="text-sm text-foreground">{children}</div>
  </div>
);

const EventRequestDetailDialog = ({ request, open, onOpenChange }: EventRequestDetailDialogProps) => {
  const { toast } = useToast();
  const { isAdmin } = useAdminAuthContext();
  const updateRequest = useUpdateEventRequest();
  const deleteRequest = useDeleteEventRequest();
  const sendEmail = useSendEventRequestEmail();

  const [status, setStatus] = useState<EventRequestStatus>('new');
  const [notes, setNotes] = useState('');
  const [emailTemplate, setEmailTemplate] = useState<EventEmailTemplateKey | ''>('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');

  useEffect(() => {
    if (request) {
      setStatus(statusOf(request));
      setNotes(request.admin_notes ?? '');
      setEmailTemplate('');
      setEmailSubject('');
      setEmailBody('');
    }
  }, [request]);

  const handleTemplateChange = (key: EventEmailTemplateKey) => {
    if (!request) return;
    setEmailTemplate(key);
    const { subject, body } = getEventRequestEmailTemplate(key, {
      name: request.name,
      requestCode: request.request_code,
      eventDate: request.event_date,
      guests: request.guests,
      language: request.language === 'en' ? 'en' : 'es',
    });
    setEmailSubject(subject);
    setEmailBody(body);
  };

  const handleSendEmail = async () => {
    if (!request) return;
    try {
      const result = await sendEmail.mutateAsync({
        requestId: request.id,
        templateLabel: emailTemplate ? EVENT_EMAIL_TEMPLATE_LABELS[emailTemplate] : 'Personalizado',
        subject: emailSubject,
        body: emailBody,
      });
      setNotes(result.admin_notes);
      toast({ title: 'Correo enviado', description: `Se envió el correo a ${request.email}` });
    } catch (error) {
      toast({ title: 'Error', description: 'No se pudo enviar el correo', variant: 'destructive' });
    }
  };

  if (!request) return null;

  const isDirty = status !== statusOf(request) || (notes.trim() || '') !== (request.admin_notes ?? '');

  const handleSave = async () => {
    try {
      await updateRequest.mutateAsync({
        id: request.id,
        updates: { status, admin_notes: notes.trim() ? notes.trim() : null },
      });
      toast({ title: 'Solicitud actualizada', description: 'Los cambios se guardaron correctamente' });
    } catch (error) {
      toast({ title: 'Error', description: 'No se pudo actualizar la solicitud', variant: 'destructive' });
    }
  };

  const handleDelete = async () => {
    if (!confirm(`¿Eliminar la solicitud ${request.request_code}? Esta acción no se puede deshacer.`)) return;
    try {
      await deleteRequest.mutateAsync(request.id);
      toast({ title: 'Solicitud eliminada' });
      onOpenChange(false);
    } catch (error) {
      toast({ title: 'Error', description: 'No se pudo eliminar la solicitud', variant: 'destructive' });
    }
  };

  const space = isEventSpace(request.space) ? request.space : null;
  const exceeded = space ? capacityExceeded(space, request.guests) : null;
  const customQuote = needsCustomQuote(parseISODate(request.event_date), request.guests);
  const eventDate = formatEventDate(request.event_date, 'es');
  const budget =
    request.budget_amount && request.budget_currency && request.budget_type &&
    isBudgetCurrency(request.budget_currency) && isBudgetType(request.budget_type)
      ? formatBudget(request.budget_amount, request.budget_currency, request.budget_type, 'es')
      : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span className="font-mono">{request.request_code}</span>
            <Badge className={STATUS_BADGE_CLASS[statusOf(request)]}>{STATUS_LABELS[statusOf(request)]}</Badge>
          </DialogTitle>
          <DialogDescription>
            Recibida el {format(new Date(request.created_at), 'dd/MM/yyyy HH:mm')} · Idioma: {request.language.toUpperCase()}
          </DialogDescription>
        </DialogHeader>

        {(customQuote || exceeded) && (
          <div className="flex flex-wrap gap-2">
            {customQuote && (
              <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-900">
                Cotización a la medida (viernes/sábado o más de 22 personas)
              </Badge>
            )}
            {exceeded && (
              <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-900">
                Excede la capacidad del espacio (hasta {exceeded})
              </Badge>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
          <Row label="Fecha del evento">
            <span className="text-base font-semibold first-letter:uppercase">{eventDate}</span>
          </Row>
          <Row label="Personas">
            <span className="text-base font-semibold">{request.guests}</span>
          </Row>
          <Row label="Tipo de evento">
            {isEventType(request.event_type) ? EVENT_TYPE_LABELS[request.event_type] : request.event_type}
          </Row>
          <Row label="Espacio de interés">{space ? SPACE_LABELS[space] : request.space}</Row>
          <Row label="Preferencia de menú">
            {request.menu_preference && isMenuPreference(request.menu_preference) ? (
              MENU_PREFERENCE_LABELS[request.menu_preference]
            ) : (
              <span className="text-muted-foreground">—</span>
            )}
          </Row>
          <Row label="Presupuesto">
            {budget ? <span className="font-semibold">{budget}</span> : <span className="text-muted-foreground">—</span>}
          </Row>
          <Row label="Cliente">
            {request.name}
            {request.company && <span className="text-muted-foreground"> · {request.company}</span>}
          </Row>
          <Row label="Correo">
            <a
              href={`mailto:${request.email}?subject=${encodeURIComponent(`Amana — solicitud ${request.request_code}`)}`}
              className="inline-flex items-center gap-1.5 text-primary hover:underline"
            >
              <Mail className="h-3.5 w-3.5" />
              {request.email}
            </a>
          </Row>
          <Row label="Teléfono">
            <div className="flex flex-wrap items-center gap-3">
              <a href={`tel:${request.phone}`} className="inline-flex items-center gap-1.5 text-primary hover:underline">
                <Phone className="h-3.5 w-3.5" />
                {request.phone}
              </a>
              <a
                href={`https://wa.me/${toWhatsAppNumber(request.phone)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-primary hover:underline"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                WhatsApp
              </a>
            </div>
          </Row>
          <div className="sm:col-span-2">
            <Row label="Comentarios del cliente">
              {request.comments ? (
                <blockquote className="whitespace-pre-line rounded-md border-l-4 border-yolk bg-muted/50 px-3 py-2 italic">
                  {request.comments}
                </blockquote>
              ) : (
                <span className="text-muted-foreground">—</span>
              )}
            </Row>
          </div>
        </div>

        <div className="space-y-3 border-t pt-4">
          <Label>Enviar correo</Label>
          <p className="text-xs text-muted-foreground">
            Las plantillas se escriben en el idioma del cliente ({request.language === 'en' ? 'inglés' : 'español'}).
          </p>
          <Select value={emailTemplate} onValueChange={(v) => handleTemplateChange(v as EventEmailTemplateKey)}>
            <SelectTrigger>
              <SelectValue placeholder="Elegir una plantilla (opcional)" />
            </SelectTrigger>
            <SelectContent>
              {EVENT_EMAIL_TEMPLATE_KEYS.map((key) => (
                <SelectItem key={key} value={key}>
                  {EVENT_EMAIL_TEMPLATE_LABELS[key]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} placeholder="Asunto del correo" />
          <Textarea
            value={emailBody}
            onChange={(e) => setEmailBody(e.target.value)}
            placeholder="Escriba el mensaje para el cliente"
            className="min-h-[160px]"
          />
          <Button
            variant="secondary"
            onClick={handleSendEmail}
            disabled={sendEmail.isPending || !emailSubject.trim() || !emailBody.trim()}
          >
            <Send className="h-4 w-4 mr-2" />
            {sendEmail.isPending ? 'Enviando...' : 'Enviar correo'}
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-4 border-t pt-4">
          <div className="space-y-2">
            <Label htmlFor="event-request-status">Estado</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as EventRequestStatus)}>
              <SelectTrigger id="event-request-status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EVENT_REQUEST_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="event-request-notes">Notas internas</Label>
            <Textarea
              id="event-request-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej: propuesta enviada el 12/10, adelanto recibido por SINPE el 15/10"
              className="min-h-[88px]"
            />
          </div>
        </div>

        <DialogFooter className="flex-col-reverse sm:flex-row sm:justify-between gap-2">
          <div>
            {isAdmin && (
              <Button
                variant="ghost"
                onClick={handleDelete}
                disabled={deleteRequest.isPending}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </Button>
            )}
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cerrar
            </Button>
            <Button onClick={handleSave} disabled={!isDirty || updateRequest.isPending}>
              {updateRequest.isPending ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EventRequestDetailDialog;
