import { z } from "zod";

import type {
    CotizacionFormValues,
    CotizacionPayload,
    CotizacionResultado,
} from "@/types/cotizacion";

const soloLetrasRegex = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]+$/;
const nombreVehiculoRegex = /^[A-Za-z0-9ÁÉÍÓÚÜÑáéíóúüñ\s\-\.]+$/;
const MONTO_MAXIMO = 1_000_000_000;

function numericRequiredFieldSchema(max = MONTO_MAXIMO) {
    return z
        .number({ error: "Ingresa un número válido" })
        .min(0, "El costo no puede ser negativo")
        .max(max, "Monto fuera de rango");
}

function numericOptionalFieldSchema(max = MONTO_MAXIMO) {
    return numericRequiredFieldSchema(max).optional();
}

export const cotizacionSchema = z.object({
    asesorNombre: z
        .string()
        .trim()
        .min(3, "Ingresa al menos 3 caracteres")
        .max(80, "Máximo 80 caracteres")
        .regex(soloLetrasRegex, "Solo se permiten letras y espacios"),
    clienteNombre: z
        .string()
        .trim()
        .min(3, "Ingresa al menos 3 caracteres")
        .max(80, "Máximo 80 caracteres")
        .regex(soloLetrasRegex, "Solo se permiten letras y espacios"),
    vehiculoNombre: z
        .string()
        .trim()
        .min(2, "Ingresa al menos 2 caracteres")
        .max(80, "Máximo 80 caracteres")
        .regex(nombreVehiculoRegex, "Usa solo letras, números, espacios, punto o guion"),
    imagenVehiculoNombre: z.string().optional(),
    precioVehiculo: z
        .number({ error: "Ingresa un número válido" })
        .positive("El precio debe ser mayor a 0")
        .max(MONTO_MAXIMO, "Monto fuera de rango"),
    mensualidadPorcentaje: z
        .number({ error: "Ingresa un número válido" })
        .positive("La mensualidad debe ser mayor a 0")
        .max(100, "El porcentaje no puede ser mayor a 100"),
    costoSeguro: numericRequiredFieldSchema(),
    costoPlacas: numericRequiredFieldSchema(),
    costoMantenimiento: numericRequiredFieldSchema(),
    costoGps: numericOptionalFieldSchema(),
    gastosAdministrativos: numericOptionalFieldSchema(),
    rentasExtraordinarias: numericOptionalFieldSchema(),
    opcionCompraPorcentaje: z
        .number({ error: "Ingresa un número válido" })
        .positive("La opción de compra debe ser mayor a 0")
        .max(100, "El porcentaje no puede ser mayor a 100"),
});

export const STORAGE_KEY_COTIZACION = "renting-cotizacion-actual";

export function calcularCotizacion(
    input: CotizacionFormValues,
): CotizacionResultado {
    const costoGps = input.costoGps ?? 0;
    const gastosAdministrativos = input.gastosAdministrativos ?? 0;
    const rentasExtraordinarias = input.rentasExtraordinarias ?? 0;

    const mensualBase = input.precioVehiculo * (input.mensualidadPorcentaje / 100);

    const pagoInicial =
        mensualBase +
        input.costoSeguro +
        input.costoPlacas +
        input.costoMantenimiento +
        costoGps +
        gastosAdministrativos +
        rentasExtraordinarias;

    const pagoMes1 = mensualBase;

    const rentaMensualRestante = pagoMes1 - rentasExtraordinarias / 11;

    const opcionCompraMonto =
        input.precioVehiculo * (input.opcionCompraPorcentaje / 100);

    return {
        mensualBase,
        pagoInicial,
        pagoMes1,
        rentaMensualRestante,
        opcionCompraMonto,
    };
}

export function crearPayloadCotizacion(
    input: CotizacionFormValues,
): CotizacionPayload {
    return {
        input,
        resultado: calcularCotizacion(input),
        fechaGeneracionISO: new Date().toISOString(),
    };
}

export function parseNumberInput(value: unknown): number | undefined {
    if (value === null || value === undefined || value === "") {
        return undefined;
    }

    if (typeof value === "number") {
        return Number.isFinite(value) ? value : undefined;
    }

    if (typeof value === "string") {
        const normalized = value
            .trim()
            .replace(/\s+/g, "")
            .replace(/\.(?=\d{3}(\D|$))/g, "")
            .replace(/,/g, ".");
        if (!normalized) {
            return undefined;
        }

        const parsed = Number(normalized);
        return Number.isFinite(parsed) ? parsed : undefined;
    }

    return undefined;
}

export function roundTo2(value: number): number {
    return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function formatCurrency(value: number): string {
    return new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(roundTo2(value));
}

export function formatPercent(value: number): string {
    return `${roundTo2(value).toFixed(2)}%`;
}
