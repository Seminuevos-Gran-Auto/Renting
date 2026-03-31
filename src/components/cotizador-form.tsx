"use client";

import { useMemo, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    useForm,
    type FieldErrors,
    type UseFormRegisterReturn,
} from "react-hook-form";

import { BrandLogo } from "@/components/brand-logo";
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
import type { CotizacionFormDraft, CotizacionFormValues } from "@/types/cotizacion";

type NumberFieldConfig = {
    id: NumericFieldName;
    label: string;
    placeholder: string;
    required?: boolean;
    max?: number;
};

type NumericFieldName =
    | "precioVehiculo"
    | "mensualidadPorcentaje"
    | "costoSeguro"
    | "costoPlacas"
    | "costoMantenimiento"
    | "costoGps"
    | "gastosAdministrativos"
    | "rentasExtraordinarias"
    | "opcionCompraPorcentaje";

const numberFields: NumberFieldConfig[] = [
    {
        id: "precioVehiculo",
        label: "Precio del Vehículo",
        placeholder: "0.00",
        required: true,
    },
    {
        id: "mensualidadPorcentaje",
        label: "Mensualidad (% sobre precio vehículo)",
        placeholder: "0.00",
        required: true,
        max: 100,
    },
    {
        id: "costoSeguro",
        label: "Costo del Seguro (anual/total)",
        placeholder: "0.00",
        required: true,
    },
    {
        id: "costoPlacas",
        label: "Costo de Placas",
        placeholder: "0.00",
        required: true,
    },
    {
        id: "costoMantenimiento",
        label: "Costo de Mantenimiento (ej. anual)",
        placeholder: "0.00",
        required: true,
    },
    {
        id: "costoGps",
        label: "GPS / Activación (Opcional)",
        placeholder: "0.00",
    },
    {
        id: "gastosAdministrativos",
        label: "Gastos Administrativos (Opcional)",
        placeholder: "0.00",
    },
    {
        id: "rentasExtraordinarias",
        label: "Rentas Extraordinarias (Opcional)",
        placeholder: "0.00",
    },
    {
        id: "opcionCompraPorcentaje",
        label: "Opción Compra (% sobre valor inicial) (Opcional)",
        placeholder: "0.00",
        max: 100,
    },
];

export function CotizadorForm() {
    const router = useRouter();

    const defaultValues = useMemo<CotizacionFormDraft>(
        () => ({
            asesorNombre: "",
            clienteNombre: "",
            vehiculoNombre: "",
            imagenVehiculoNombre: undefined,
            costoGps: undefined,
            gastosAdministrativos: undefined,
            rentasExtraordinarias: undefined,
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

    const getError = (
        fieldName: keyof CotizacionFormValues,
        fieldErrors: FieldErrors<CotizacionFormValues>,
    ) => {
        const message = fieldErrors[fieldName]?.message;
        return typeof message === "string" ? message : undefined;
    };

    const numericRegister = (fieldName: NumericFieldName) =>
        register(fieldName, {
            setValueAs: (value) => parseNumberInput(value),
        });

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const fileName = event.currentTarget.files?.[0]?.name;
        setValue("imagenVehiculoNombre", fileName, {
            shouldDirty: true,
        });
    };

    return (
        <Card className="border-border/70 shadow-lg shadow-black/5 print:shadow-none">
            <CardHeader className="space-y-5 px-5 pb-4 pt-6 sm:space-y-6 sm:px-8 sm:pb-6 sm:pt-8">
                <BrandLogo priority />
                <div className="space-y-1 text-center">
                    <CardTitle className="text-2xl font-semibold text-foreground sm:text-3xl">
                        Renting
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Completa los datos para generar la cotización al momento.
                    </p>
                </div>
            </CardHeader>
            <CardContent className="px-5 pb-6 sm:px-8 sm:pb-8">
                <form className="space-y-6 sm:space-y-7" onSubmit={handleSubmit(onSubmit)} noValidate>
                    <div className="space-y-2">
                        <Label htmlFor="asesorNombre">Nombre del Asesor Profesional de Ventas *</Label>
                        <Input
                            id="asesorNombre"
                            placeholder="Ej. Carlos Ramírez"
                            autoComplete="name"
                            className="h-11"
                            {...register("asesorNombre")}
                        />
                        {errors.asesorNombre ? (
                            <p className="text-sm text-destructive">{errors.asesorNombre.message}</p>
                        ) : null}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="clienteNombre">Nombre del Cliente *</Label>
                        <Input
                            id="clienteNombre"
                            placeholder="Ej. Mariana López"
                            autoComplete="name"
                            className="h-11"
                            {...register("clienteNombre")}
                        />
                        {errors.clienteNombre ? (
                            <p className="text-sm text-destructive">{errors.clienteNombre.message}</p>
                        ) : null}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="vehiculoNombre">Nombre del Vehículo *</Label>
                        <Input
                            id="vehiculoNombre"
                            placeholder="Ej. Versa Sense"
                            className="h-11"
                            {...register("vehiculoNombre")}
                        />
                        {errors.vehiculoNombre ? (
                            <p className="text-sm text-destructive">{errors.vehiculoNombre.message}</p>
                        ) : null}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="imagenVehiculoNombre">Imagen del Vehículo (Opcional)</Label>
                        <Input
                            id="imagenVehiculoNombre"
                            type="file"
                            accept="image/*"
                            className="h-11"
                            onChange={handleImageChange}
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                        {numberFields.map((field) => (
                            <NumberInputField
                                key={field.id}
                                id={field.id}
                                label={field.label}
                                placeholder={field.placeholder}
                                error={getError(field.id, errors)}
                                register={numericRegister(field.id)}
                                required={field.required}
                                max={field.max}
                            />
                        ))}
                    </div>

                    <Button
                        type="submit"
                        className="h-11 w-full bg-[#ce2121] text-white hover:bg-[#b21a1a]"
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
    id: NumericFieldName;
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
                className="h-11"
                {...register}
            />
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </div>
    );
}
