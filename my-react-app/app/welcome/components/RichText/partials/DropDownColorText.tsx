import { faFont } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Editor } from "@tiptap/react";
import { useRef } from "react";

interface DropDownTextColorProps {
    editor: Editor | null;
}

const COLORS = [
    { color: "#000000", label: "Negro" },
    { color: "#ef4444", label: "Rojo" },
    { color: "#f59e0b", label: "Naranja" },
    { color: "#10b981", label: "Verde" },
    { color: "#3b82f6", label: "Azul" },
    { color: "#8b5cf6", label: "Morado" },
    { color: "#ec4899", label: "Rosa" },
];

export function DropDownTextColor({ editor }: DropDownTextColorProps) {
    const dropdownRef = useRef<HTMLDivElement>(null);

    if (!editor) return null;

    const isColorActive = (color: string) =>
        editor.isActive("textStyle", { color });

    const applyColor = (color: string) => {
        editor.chain().focus().setMark("textStyle", { color }).run();
    };

    const isAnyColorActive = COLORS.some(({ color }) => isColorActive(color));

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    className={`rounded p-1 transition hover:bg-gray-200 ${
                        isAnyColorActive ? "bg-gray-300" : ""
                    }`}
                    aria-label="Color de texto"
                    title="Color de texto"
                >
                    <FontAwesomeIcon icon={faFont} />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                ref={dropdownRef}
                className="mt-2 grid grid-cols-4 gap-2 rounded border border-gray-200 bg-white p-2 shadow-lg z-[9999]"
                sideOffset={4}
                align="start"
            >
                {COLORS.map(({ color, label }) => (
                    <DropdownMenuItem
                        key={color}
                        onSelect={(e) => {
                            e.preventDefault();
                            applyColor(color);
                        }}
                        className="flex justify-center"
                    >
                        <button
                            className={`h-6 w-6 rounded-full border border-gray-300 transition-all duration-150 ${
                                isColorActive(color)
                                    ? "ring-2 ring-offset-2 ring-gray-400"
                                    : "hover:scale-110"
                            }`}
                            style={{ backgroundColor: color }}
                            aria-label={label}
                            title={label}
                        />
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
