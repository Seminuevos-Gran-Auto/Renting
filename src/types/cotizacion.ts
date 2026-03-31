export interface CotizacionFormValues {
    asesorNombre: string;
    clienteNombre: string;
    vehiculoNombre: string;
    imagenVehiculoNombre?: string;
    precioVehiculo: number;
    mensualidadPorcentaje: number;
    costoSeguro: number;
    costoPlacas: number;
    costoMantenimiento: number;
    costoGps?: number;
    gastosAdministrativos?: number;
    rentasExtraordinarias?: number;
    opcionCompraPorcentaje?: number;
}

export interface CotizacionResultado {
    mensualBase: number;
    pagoInicial: number;
    pagoMes1: number;
    rentaMensualRestante: number;
    opcionCompraMonto?: number;
}

export interface CotizacionPayload {
    input: CotizacionFormValues;
    resultado: CotizacionResultado;
    fechaGeneracionISO: string;
}

export type CotizacionFormDraft = Partial<CotizacionFormValues>;
