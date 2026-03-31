"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { ResumenCotizacion } from "@/components/resumen-cotizacion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageContainer } from "@/components/ui/page-container";
import { STORAGE_KEY_COTIZACION } from "@/lib/cotizacion";
import type { CotizacionPayload } from "@/types/cotizacion";

export default function ResumenPage() {
    const router = useRouter();
    const [payload, setPayload] = useState<CotizacionPayload | null>(null);
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        const raw = sessionStorage.getItem(STORAGE_KEY_COTIZACION);
        if (!raw) {
            setIsHydrated(true);
            return;
        }

        try {
            setPayload(JSON.parse(raw) as CotizacionPayload);
        } catch {
            sessionStorage.removeItem(STORAGE_KEY_COTIZACION);
        } finally {
            setIsHydrated(true);
        }
    }, []);

    useEffect(() => {
        if (isHydrated && !payload) {
            router.replace("/");
        }
    }, [isHydrated, payload, router]);

    if (!isHydrated) {
        return (
            <PageContainer className="max-w-4xl items-center">
                <Card className="w-full max-w-lg">
                    <CardContent className="py-10 text-center text-sm text-muted-foreground">
                        Cargando cotizacion...
                    </CardContent>
                </Card>
            </PageContainer>
        );
    }

    if (!payload) {
        return (
            <PageContainer className="max-w-4xl items-center">
                <Card className="w-full max-w-lg">
                    <CardContent className="space-y-4 py-10 text-center text-sm text-muted-foreground">
                        <p>No encontramos una cotizacion en esta sesion.</p>
                        <Button
                            className="bg-[#ce2121] text-white hover:bg-[#b21a1a]"
                            onClick={() => router.replace("/")}
                        >
                            Volver al cotizador
                        </Button>
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
