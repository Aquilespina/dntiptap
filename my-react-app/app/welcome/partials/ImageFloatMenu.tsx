import { Editor } from "@tiptap/react";

interface ImageFloatMenuProps {
    editor: Editor;
}

const options = [
    {
        label: "Centrar (100%)",
        class: "mx-auto block",
        style: "width: 100%",
    },
    {
        label: "Izquierda (33%)",
        class: "float-left mr-4",
        style: "width: 33%",
    },
    {
        label: "Derecha (33%)",
        class: "float-right ml-4",
        style: "width: 33%",
    },
    {
        label: "Centrar (50%)",
        class: "mx-auto block",
        style: "width: 50%",
    },
];

export default function ImageFloatMenu({ editor }: ImageFloatMenuProps) {
    if (!editor) return null;

    const handleApply = (option: { class: string; style: string }) => {
        editor
            .chain()
            .focus()
            .updateAttributes(" ", {
                class: option.class,
                style: option.style,
            })
            .run();
    };

    return (
        <div className="mt-4 flex flex-wrap gap-2 border-t pt-2">
            {options.map((option) => (
                <button
                    key={option.label}
                    onClick={() => handleApply(option)}
                    className="rounded bg-gray-100 px-3 py-1 text-sm hover:bg-gray-200 focus:ring-1 focus:ring-primary focus:outline-none transition"
                    aria-label={option.label}
                    title={option.label}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
}
