"use client";

import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
    formatCurrency,
    formatPercent,
    roundTo2,
} from "@/lib/cotizacion";
import type { CotizacionPayload } from "@/types/cotizacion";

type ResumenCotizacionProps = {
    payload: CotizacionPayload;
};

export function ResumenCotizacion({ payload }: ResumenCotizacionProps) {
    const { input, resultado } = payload;
    const fecha = new Date(payload.fechaGeneracionISO);
    const fechaFormateada = Number.isNaN(fecha.valueOf())
        ? "Fecha no disponible"
        : new Intl.DateTimeFormat("es-MX", {
              dateStyle: "short",
              timeStyle: "short",
          }).format(fecha);

    return (
        <Card className="border-border/70 shadow-lg shadow-black/5 print:border-none print:shadow-none print:[break-inside:avoid]">
            <CardHeader className="space-y-4 px-5 pb-4 pt-6 sm:space-y-5 sm:px-8 sm:pb-6 sm:pt-8 print:px-4 print:pt-3">
                <BrandLogo className="pb-1" imageClassName="w-[160px] sm:w-[210px]" priority />
                <CardTitle className="text-center text-2xl font-semibold text-foreground sm:text-3xl print:text-2xl">
                    Resumen de Cotización
                </CardTitle>
                <div className="grid gap-2 text-sm text-secondary-foreground sm:grid-cols-2 sm:gap-3">
                    <p>
                        <span className="font-semibold">Cliente:</span> {input.clienteNombre}
                    </p>
                    <p>
                        <span className="font-semibold">Vehículo:</span> {input.vehiculoNombre}
                    </p>
                    <p>
                        <span className="font-semibold">Cotizado por:</span> {input.asesorNombre}
                    </p>
                    <p>
                        <span className="font-semibold">Fecha:</span>{" "}
                        {fechaFormateada}
                    </p>
                </div>
            </CardHeader>

            <CardContent className="space-y-6 px-5 pb-6 sm:space-y-7 sm:px-8 sm:pb-8 print:space-y-4 print:px-4 print:pb-4">
                <div className="space-y-2.5 text-sm">
                    <SummaryRow
                        label="Precio Base Vehículo"
                        value={formatCurrency(input.precioVehiculo)}
                    />
                    <SummaryRow
                        label="Mensualidad (%)"
                        value={formatPercent(input.mensualidadPorcentaje)}
                    />
                    <SummaryRow label="Costo Seguro" value={formatCurrency(input.costoSeguro)} />
                    <SummaryRow label="Costo Placas" value={formatCurrency(input.costoPlacas)} />
                    <SummaryRow
                        label="Costo Mantenimiento"
                        value={formatCurrency(input.costoMantenimiento)}
                    />
                    <SummaryRow
                        label="Costo GPS / Activación"
                        value={formatCurrency(input.costoGps ?? 0)}
                    />
                    <SummaryRow
                        label="Gastos Administrativos"
                        value={formatCurrency(input.gastosAdministrativos ?? 0)}
                    />
                    <SummaryRow
                        label="Rentas Extraordinarias"
                        value={formatCurrency(input.rentasExtraordinarias ?? 0)}
                    />
                </div>

                <Separator />

                <div className="space-y-2.5 text-sm md:text-base">
                    <SummaryRow
                        label="Total Pago Inicial"
                        value={formatCurrency(resultado.pagoInicial)}
                        highlight
                    />
                    <SummaryRow
                        label="Renta Mensual (11 meses restantes)"
                        value={formatCurrency(resultado.rentaMensualRestante)}
                        highlight
                    />
                    <SummaryRow
                        label={`Pago Mensual Estimado (Mes 1) (${formatPercent(
                            input.mensualidadPorcentaje,
                        )})`}
                        value={formatCurrency(resultado.pagoMes1)}
                        highlight
                    />
                    <SummaryRow
                        label={`Opción de Compra Después de 12 Meses (${formatPercent(
                            input.opcionCompraPorcentaje,
                        )} del Valor Inicial)`}
                        value={formatCurrency(resultado.opcionCompraMonto)}
                        highlight
                    />
                </div>

                <p className="text-xs leading-relaxed text-muted-foreground print:pt-2">
                    Nota: La mensualidad mostrada se calcula con base en el porcentaje
                    ingresado sobre el precio del vehículo. No incluye intereses de
                    financiamiento, plazo u otros cargos adicionales.
                </p>

                <div className="print:hidden">
                    <Button
                        onClick={() => window.print()}
                        className="h-11 w-full bg-[#ce2121] text-white hover:bg-[#b21a1a]"
                    >
                        Imprimir Cotización
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

type SummaryRowProps = {
    label: string;
    value: string;
    highlight?: boolean;
};

function SummaryRow({ label, value, highlight }: SummaryRowProps) {
    const labelStyle = highlight ? "font-semibold text-foreground" : "text-secondary-foreground";
    const valueStyle = highlight
        ? "font-semibold text-foreground"
        : "text-secondary-foreground";

    return (
        <div className="flex flex-col gap-1.5 sm:grid sm:grid-cols-[1fr_auto] sm:items-center sm:gap-4">
            <p className={labelStyle}>{label}:</p>
            <p className={`${valueStyle} text-left sm:text-right`}>{value}</p>
        </div>
    );
}

export function getResumenDebugData(payload: CotizacionPayload) {
    return {
        mensualBase: roundTo2(payload.resultado.mensualBase),
        pagoInicial: roundTo2(payload.resultado.pagoInicial),
        pagoMes1: roundTo2(payload.resultado.pagoMes1),
        rentaMensualRestante: roundTo2(payload.resultado.rentaMensualRestante),
        opcionCompraMonto: roundTo2(payload.resultado.opcionCompraMonto),
    };
}
