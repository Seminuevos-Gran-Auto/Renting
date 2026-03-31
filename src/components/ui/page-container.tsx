import { cn } from "@/lib/utils";

type PageContainerProps = {
    children: React.ReactNode;
    className?: string;
};

export function PageContainer({ children, className }: PageContainerProps) {
    return (
        <main
            className={cn(
                "mx-auto flex min-h-screen w-full flex-col justify-center px-3 py-5 sm:px-6 sm:py-8 md:px-8 md:py-10",
                className,
            )}
        >
            {children}
        </main>
    );
}
