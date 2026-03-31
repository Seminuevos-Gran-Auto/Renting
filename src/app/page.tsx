import { CotizadorForm } from "@/components/cotizador-form";
import { PageContainer } from "@/components/ui/page-container";

export default function Home() {
  return (
    <PageContainer className="max-w-3xl">
      <CotizadorForm />
    </PageContainer>
  );
}
