import { faHeading } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Editor } from "@tiptap/react";

interface DropDownHeadingProps {
    editor: Editor | null;
}

export function DropDownHeading({ editor }: DropDownHeadingProps) {
    if (!editor) return null;

    const isActive = (level: number) => editor.isActive("heading", { level });

    const getItemStyle = (level: number) =>
        `flex items-center gap-2 px-3 py-2 text-sm transition-colors ${
            isActive(level) ? "bg-gray-100 font-semibold" : "hover:bg-gray-100"
        }`;

    const handleHeading = (level: 1 | 2 | 3 | 4) => {
        editor.chain().focus().toggleHeading({ level }).run();
    };

    const handleRemoveHeading = () => {
        editor.chain().focus().setParagraph().run();
    };

    const isAnyHeadingActive = [1, 2, 3, 4].some(isActive);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    className={`rounded p-1 transition hover:bg-gray-200 ${
                        isAnyHeadingActive ? "bg-gray-300" : ""
                    }`}
                    title="Encabezado"
                    aria-label="Encabezado"
                >
                    <FontAwesomeIcon icon={faHeading} />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                className="mt-2 min-w-[9rem] rounded border border-gray-200 bg-white p-1 shadow-md z-[9999]"
                sideOffset={4}
                align="start"
            >
                <DropdownMenuItem
                    onSelect={handleRemoveHeading}
                    className="px-3 py-2 text-sm hover:bg-gray-100"
                >
                    Párrafo normal
                </DropdownMenuItem>
                <DropdownMenuItem
                    onSelect={() => handleHeading(1)}
                    className={getItemStyle(1)}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <path d="M4 12h8" />
                        <path d="M4 18V6" />
                        <path d="M12 18V6" />
                        <path d="m17 12 3-2v8" />
                    </svg>{" "}
                    Encabezado 1
                </DropdownMenuItem>
                <DropdownMenuItem
                    onSelect={() => handleHeading(2)}
                    className={getItemStyle(2)}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <path d="M4 12h8" />
                        <path d="M4 18V6" />
                        <path d="M12 18V6" />
                        <path d="M21 18h-4c0-4 4-3 4-6 0-1.5-2-2.5-4-1" />
                    </svg>{" "}
                    Encabezado 2
                </DropdownMenuItem>
                <DropdownMenuItem
                    onSelect={() => handleHeading(3)}
                    className={getItemStyle(3)}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <path d="M4 12h8" />
                        <path d="M4 18V6" />
                        <path d="M12 18V6" />
                        <path d="M17.5 10.5c1.7-1 3.5 0 3.5 1.5a2 2 0 0 1-2 2" />
                        <path d="M17 17.5c2 1.5 4 .3 4-1.5a2 2 0 0 0-2-2" />
                    </svg>{" "}
                    Encabezado 3
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
