import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { GiftSettingKey, useGiftSettings, useUpdateGiftSettings } from '@/hooks/useGiftSettings';
import { formatCRC } from '@/lib/format';
import { parseAmountList } from '@/lib/gift';

interface FormState {
  chefsTablePrice: string;
  pairingPrice: string;
  cardAmounts: string;
  cardMinAmount: string;
  chefsTableEnabled: boolean;
  cardsEnabled: boolean;
}

const isPositiveInt = (value: string) => /^\d+$/.test(value.trim()) && parseInt(value, 10) > 0;

const GiftSettingsForm = () => {
  const { toast } = useToast();
  const { data: settings, isLoading } = useGiftSettings();
  const updateSettings = useUpdateGiftSettings();

  const [form, setForm] = useState<FormState>({
    chefsTablePrice: '',
    pairingPrice: '',
    cardAmounts: '',
    cardMinAmount: '',
    chefsTableEnabled: true,
    cardsEnabled: true,
  });

  useEffect(() => {
    if (!settings) return;
    setForm({
      chefsTablePrice: String(settings.chefsTablePrice),
      pairingPrice: String(settings.pairingPrice),
      cardAmounts: settings.cardAmounts.join(', '),
      cardMinAmount: String(settings.cardMinAmount),
      chefsTableEnabled: settings.chefsTableEnabled,
      cardsEnabled: settings.cardsEnabled,
    });
  }, [settings]);

  const previewAmounts = parseAmountList(form.cardAmounts);
  const minAmount = isPositiveInt(form.cardMinAmount) ? parseInt(form.cardMinAmount, 10) : null;
  const minAboveSmallestPreset =
    minAmount !== null && previewAmounts.length > 0 && minAmount > previewAmounts[0];

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    if (!isPositiveInt(form.chefsTablePrice) || !isPositiveInt(form.pairingPrice) || !isPositiveInt(form.cardMinAmount)) {
      toast({
        title: 'Valores inválidos',
        description: 'Los precios y el monto mínimo deben ser números enteros mayores a 0 (sin puntos ni símbolos).',
        variant: 'destructive',
      });
      return;
    }
    if (previewAmounts.length === 0) {
      toast({
        title: 'Montos inválidos',
        description: 'Ingresa al menos un monto predefinido, separados por coma.',
        variant: 'destructive',
      });
      return;
    }

    const values: Partial<Record<GiftSettingKey, string>> = {
      gift_chefs_table_price: String(parseInt(form.chefsTablePrice, 10)),
      gift_pairing_price: String(parseInt(form.pairingPrice, 10)),
      gift_card_amounts: previewAmounts.join(','),
      gift_card_min_amount: String(parseInt(form.cardMinAmount, 10)),
      gift_chefs_table_enabled: form.chefsTableEnabled ? 'true' : 'false',
      gift_cards_enabled: form.cardsEnabled ? 'true' : 'false',
    };

    try {
      await updateSettings.mutateAsync(values);
      toast({ title: 'Configuración guardada', description: 'Los cambios ya aplican a nuevos pedidos' });
    } catch (error) {
      toast({
        title: 'Error al guardar',
        description: error instanceof Error ? error.message : 'Intenta de nuevo',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return <p className="text-muted-foreground">Cargando configuración...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle>Chef's Table</CardTitle>
                <CardDescription>Precios en colones, sin puntos (ej: 44000)</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="ct-enabled" className="text-sm text-muted-foreground">
                  Visible
                </Label>
                <Switch
                  id="ct-enabled"
                  checked={form.chefsTableEnabled}
                  onCheckedChange={(v) => set('chefsTableEnabled', v)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ct-price">Precio por persona</Label>
              <Input
                id="ct-price"
                inputMode="numeric"
                value={form.chefsTablePrice}
                onChange={(e) => set('chefsTablePrice', e.target.value.replace(/\D/g, ''))}
              />
              {isPositiveInt(form.chefsTablePrice) && (
                <p className="text-xs text-muted-foreground">{formatCRC(parseInt(form.chefsTablePrice, 10), 'es')}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="ct-pairing">Precio del maridaje por persona</Label>
              <Input
                id="ct-pairing"
                inputMode="numeric"
                value={form.pairingPrice}
                onChange={(e) => set('pairingPrice', e.target.value.replace(/\D/g, ''))}
              />
              {isPositiveInt(form.pairingPrice) && (
                <p className="text-xs text-muted-foreground">{formatCRC(parseInt(form.pairingPrice, 10), 'es')}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle>Tarjetas de regalo</CardTitle>
                <CardDescription>Montos predefinidos y monto mínimo para "Otro monto"</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="gc-enabled" className="text-sm text-muted-foreground">
                  Visible
                </Label>
                <Switch id="gc-enabled" checked={form.cardsEnabled} onCheckedChange={(v) => set('cardsEnabled', v)} />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="gc-amounts">Montos predefinidos (separados por coma)</Label>
              <Input
                id="gc-amounts"
                value={form.cardAmounts}
                onChange={(e) => set('cardAmounts', e.target.value)}
                placeholder="20000, 30000, 40000, 50000"
              />
              <div className="flex flex-wrap gap-1.5 min-h-[22px]">
                {previewAmounts.map((amount) => (
                  <Badge key={amount} variant="secondary">
                    {formatCRC(amount, 'es')}
                  </Badge>
                ))}
                {previewAmounts.length === 0 && (
                  <span className="text-xs text-destructive">Ingresa al menos un monto válido</span>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="gc-min">Monto mínimo</Label>
              <Input
                id="gc-min"
                inputMode="numeric"
                value={form.cardMinAmount}
                onChange={(e) => set('cardMinAmount', e.target.value.replace(/\D/g, ''))}
              />
              {minAmount !== null && (
                <p className="text-xs text-muted-foreground">{formatCRC(minAmount, 'es')}</p>
              )}
              {minAboveSmallestPreset && (
                <p className="text-xs text-amber-600">
                  El mínimo es mayor que el monto predefinido más bajo; los clientes no podrán ordenar ese monto.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={updateSettings.isPending}>
          <Save className="h-4 w-4 mr-2" />
          {updateSettings.isPending ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </div>
    </div>
  );
};

export default GiftSettingsForm;
