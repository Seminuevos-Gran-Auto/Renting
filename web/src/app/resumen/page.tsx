"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

import { ResumenCotizacion } from "@/components/resumen-cotizacion";
import { Card, CardContent } from "@/components/ui/card";
import { PageContainer } from "@/components/ui/page-container";
import { STORAGE_KEY_COTIZACION } from "@/lib/cotizacion";
import type { CotizacionPayload } from "@/types/cotizacion";

export default function ResumenPage() {
    const router = useRouter();
    const payload = useMemo<CotizacionPayload | null>(() => {
        if (typeof window === "undefined") {
            return null;
        }

        const raw = sessionStorage.getItem(STORAGE_KEY_COTIZACION);
        if (!raw) {
            return null;
        }

        try {
            return JSON.parse(raw) as CotizacionPayload;
        } catch {
            sessionStorage.removeItem(STORAGE_KEY_COTIZACION);
            return null;
        }
    }, []);

    useEffect(() => {
        if (!payload) {
            router.replace("/");
        }
    }, [payload, router]);

    if (!payload) {
        return (
            <PageContainer className="max-w-4xl items-center">
                <Card className="w-full max-w-lg">
                    <CardContent className="py-10 text-center text-sm text-muted-foreground">
                        Cargando cotización...
                    </CardContent>
                </Card>
            </PageContainer>
        );
    }

    return (
        <PageContainer className="max-w-4xl print:max-w-none print:p-0">
            <ResumenCotizacion payload={payload} />
        </PageContainer>
    );
}
