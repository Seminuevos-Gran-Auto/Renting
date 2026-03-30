import Image from "next/image";

import { cn } from "@/lib/utils";

type BrandLogoProps = {
    className?: string;
    imageClassName?: string;
    priority?: boolean;
};

export function BrandLogo({
    className,
    imageClassName,
    priority = false,
}: BrandLogoProps) {
    return (
        <div className={cn("flex justify-center", className)}>
            <Image
                src="/brand/logo_grupogranauto.png"
                alt="Grupo Gran Auto"
                width={320}
                height={120}
                priority={priority}
                className={cn("h-auto w-[170px] sm:w-[220px]", imageClassName)}
            />
        </div>
    );
}
