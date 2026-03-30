"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type UseFormRegisterReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  cotizacionSchema,
  crearPayloadCotizacion,
  parseNumberInput,
  STORAGE_KEY_COTIZACION,
} from "@/lib/cotizacion";
import type { CotizacionFormValues } from "@/types/cotizacion";

export function CotizadorForm() {
  const router = useRouter();

  const defaultValues = useMemo<CotizacionFormValues>(
    () => ({
      asesorNombre: "",
      clienteNombre: "",
      vehiculoNombre: "",
      imagenVehiculoNombre: undefined,
      precioVehiculo: undefined as unknown as number,
      mensualidadPorcentaje: undefined as unknown as number,
      costoSeguro: undefined as unknown as number,
      costoPlacas: undefined as unknown as number,
      costoMantenimiento: undefined as unknown as number,
      costoGps: undefined,
      gastosAdministrativos: undefined,
      rentasExtraordinarias: undefined,
      opcionCompraPorcentaje: undefined as unknown as number,
    }),
    [],
  );

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CotizacionFormValues>({
    resolver: zodResolver(cotizacionSchema),
    defaultValues,
    mode: "onBlur",
  });

  const onSubmit = (data: CotizacionFormValues) => {
    const payload = crearPayloadCotizacion(data);
    sessionStorage.setItem(STORAGE_KEY_COTIZACION, JSON.stringify(payload));
    router.push("/resumen");
  };

  const numericRegister = (fieldName: keyof CotizacionFormValues) =>
    register(fieldName, {
      setValueAs: (value) => parseNumberInput(value),
    });

  return (
    <Card className="border-border/70 shadow-sm">
      <CardHeader className="space-y-2 pb-2">
        <CardTitle className="text-3xl font-semibold text-center text-[#313030]">
          Cotizador
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="space-y-2">
            <Label htmlFor="asesorNombre">Nombre del Asesor Profesional de Ventas *</Label>
            <Input
              id="asesorNombre"
              placeholder="Ej. Carlos Ramírez"
              autoComplete="name"
              {...register("asesorNombre")}
            />
            {errors.asesorNombre ? (
              <p className="text-sm text-[#ce2121]">{errors.asesorNombre.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="clienteNombre">Nombre del Cliente *</Label>
            <Input
              id="clienteNombre"
              placeholder="Ej. Mariana López"
              autoComplete="name"
              {...register("clienteNombre")}
            />
            {errors.clienteNombre ? (
              <p className="text-sm text-[#ce2121]">{errors.clienteNombre.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="vehiculoNombre">Nombre del Vehículo *</Label>
            <Input
              id="vehiculoNombre"
              placeholder="Ej. Versa Sense"
              {...register("vehiculoNombre")}
            />
            {errors.vehiculoNombre ? (
              <p className="text-sm text-[#ce2121]">{errors.vehiculoNombre.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="imagenVehiculoNombre">Imagen del Vehículo (Opcional)</Label>
            <Input
              id="imagenVehiculoNombre"
              type="file"
              accept="image/*"
              onChange={(event) => {
                const fileName = event.currentTarget.files?.[0]?.name;
                setValue("imagenVehiculoNombre", fileName);
              }}
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <NumberInputField
              id="precioVehiculo"
              label="Precio del Vehículo"
              placeholder="0.00"
              error={errors.precioVehiculo?.message}
              register={numericRegister("precioVehiculo")}
              required
            />

            <NumberInputField
              id="mensualidadPorcentaje"
              label="Mensualidad (% sobre precio vehículo)"
              placeholder="0.00"
              error={errors.mensualidadPorcentaje?.message}
              register={numericRegister("mensualidadPorcentaje")}
              required
              max={100}
            />

            <NumberInputField
              id="costoSeguro"
              label="Costo del Seguro (anual/total)"
              placeholder="0.00"
              error={errors.costoSeguro?.message}
              register={numericRegister("costoSeguro")}
              required
            />

            <NumberInputField
              id="costoPlacas"
              label="Costo de Placas"
              placeholder="0.00"
              error={errors.costoPlacas?.message}
              register={numericRegister("costoPlacas")}
              required
            />

            <NumberInputField
              id="costoMantenimiento"
              label="Costo de Mantenimiento (ej. anual)"
              placeholder="0.00"
              error={errors.costoMantenimiento?.message}
              register={numericRegister("costoMantenimiento")}
              required
            />

            <NumberInputField
              id="costoGps"
              label="GPS / Activación (Opcional)"
              placeholder="0.00"
              error={errors.costoGps?.message}
              register={numericRegister("costoGps")}
            />

            <NumberInputField
              id="gastosAdministrativos"
              label="Gastos Administrativos (Opcional)"
              placeholder="0.00"
              error={errors.gastosAdministrativos?.message}
              register={numericRegister("gastosAdministrativos")}
            />

            <NumberInputField
              id="rentasExtraordinarias"
              label="Rentas Extraordinarias (Opcional)"
              placeholder="0.00"
              error={errors.rentasExtraordinarias?.message}
              register={numericRegister("rentasExtraordinarias")}
            />

            <NumberInputField
              id="opcionCompraPorcentaje"
              label="Opción Compra (% sobre valor inicial)"
              placeholder="0.00"
              error={errors.opcionCompraPorcentaje?.message}
              register={numericRegister("opcionCompraPorcentaje")}
              required
              max={100}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-[#ce2121] hover:bg-[#b21a1a] text-white"
            disabled={isSubmitting}
          >
            Generar Cotización
          </Button>

          <p className="text-xs text-muted-foreground">
            Campos marcados con * son obligatorios.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}

type NumberInputFieldProps = {
  id: string;
  label: string;
  placeholder: string;
  error?: string;
  required?: boolean;
  max?: number;
  register: UseFormRegisterReturn;
};

function NumberInputField({
  id,
  label,
  placeholder,
  error,
  required,
  max,
  register,
}: NumberInputFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label}
        {required ? " *" : ""}
      </Label>
      <Input
        id={id}
        type="number"
        inputMode="decimal"
        step="0.01"
        min="0"
        max={max}
        placeholder={placeholder}
        {...register}
      />
      {error ? <p className="text-sm text-[#ce2121]">{error}</p> : null}
    </div>
  );
}
