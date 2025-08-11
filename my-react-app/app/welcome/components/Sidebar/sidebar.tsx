import { ReactNode } from "react";
import { PrimaryButton } from "@/components/Button";

interface SidebarProps {
    children: ReactNode;
    showViewAllButton?: boolean;
    title?: string;
}

export const Sidebar = ({
    children,
    showViewAllButton = true,
    title,
}: SidebarProps) => {
    return (
        <div className="min-w-xs max-w-[22rem] h-screen bg-primary-foreground border-r flex flex-col resize-x overflow-hidden">
            {title && (
                <h1 className="font-xl-medium p-5 text-primary">{title}</h1>
            )}

            <div className="flex-1 overflow-y-auto">
                {children}
            </div>

            {showViewAllButton && (
                <div className="flex justify-center bg-secondary p-4 shrink-0">
                    <PrimaryButton
                        className="w-full btn-primary-solid text-lg-medium rounded-lg"
                        href={route("events.create")}
                    >
                        Crear evento
                    </PrimaryButton>
                </div>
            )}
        </div>
    );
};
