import { Button } from "@heroui/react";
import { router } from "@inertiajs/react";
import type { FormEvent, ReactNode } from "react";

type RadiusType = "none" | "sm" | "md" | "lg" | "full";
interface ButtonProps {
    children: ReactNode;
    className?: string;
    radius?: RadiusType;
    href?: string;
    onClick?: (event: FormEvent | null) => void;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
}

export const PrimaryButton = ({
    children,
    className = "",
    radius = "sm",
    href,
    onClick,
    disabled = false,
    type = "button",
}: ButtonProps) => (
    <Button
        className={`bg-primary text-white ${disabled ? "opacity-50 cursor-not-allowed bg-gray-300 text-white" : ""} ${className}`}
        radius={radius}
        isDisabled={disabled}
        onPress={() => {
            if (disabled) return;
            if (onClick) {
                onClick();
            } else if (href) {
                router.visit(href);
            }
        }}
        type={type}
    >
        {children}
    </Button>
);

export const SecondaryButton = ({
    children,
    className,
    radius = "sm",
    href,
    onClick,
    disabled = false,
    type = "button",
}: ButtonProps) => (
    <Button
        className={`bg-background text-primary border border-primary ${className}`}
        radius={radius}
        onPress={() => {
            if (onClick) {
                onClick();
            } else if (href) {
                router.visit(href);
            }
        }}
        type={type}
        disabled={disabled}
    >
        {children}
    </Button>
);

export const TextButton = ({
    children,
    className = "",
    href,
    onClick,
}: ButtonProps) => (
    <Button
        className={`text-primary text-medium bg-transparent ${className}`}
        onPress={() => {
            if (onClick) {
                onClick();
            } else if (href) {
                router.visit(href);
            }
        }}
    >
        {children}
    </Button>
);

export const ButtonSection = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => (
    <div
        className={`flex flex-col justify-between items-start bg-[#F6F6F6] py-4 px-8 rounded-b-lg text-m text-gray-700 ${className}`}
    >
        {children}
    </div>
);
