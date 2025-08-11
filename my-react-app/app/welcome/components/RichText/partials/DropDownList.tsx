import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { faList, faListOl } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Editor } from "@tiptap/react";

interface DropDownListProps {
    editor: Editor | null;
}

export function DropDownList({ editor }: DropDownListProps) {
    if (!editor) return null;

    const isActive = (type: "bulletList" | "orderedList") =>
        editor.isActive(type);

    const getItemStyle = (type: "bulletList" | "orderedList") =>
        `flex items-center gap-2 px-3 py-2 text-sm transition-colors ${
            isActive(type) ? "bg-gray-100 font-semibold" : "hover:bg-gray-100"
        }`;

    const handleList = (type: "bulletList" | "orderedList") => {
        editor.chain().focus().toggleList?.(type, "listItem")?.run?.();
    };

    const isAnyActive = (
        ["bulletList", "orderedList"] as ("bulletList" | "orderedList")[]
    ).some(isActive);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    className={`rounded p-1 transition hover:bg-gray-200 ${
                        isAnyActive ? "bg-gray-300" : ""
                    }`}
                    title="Lista"
                    aria-label="Lista"
                >
                    <FontAwesomeIcon icon={faList} />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                className="mt-2 min-w-[10rem] rounded border border-gray-200 bg-white p-1 shadow-md z-[9999]"
                sideOffset={4}
                align="start"
            >
                <DropdownMenuItem
                    onSelect={() => handleList("bulletList")}
                    className={getItemStyle("bulletList")}
                >
                    <FontAwesomeIcon icon={faList} />
                    Lista con viñetas
                </DropdownMenuItem>

                <DropdownMenuItem
                    onSelect={() => handleList("orderedList")}
                    className={getItemStyle("orderedList")}
                >
                    <FontAwesomeIcon icon={faListOl} />
                    Lista numerada
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
