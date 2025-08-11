import { Editor } from "@tiptap/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBold,
    faItalic,
    faUnderline,
    faStrikethrough,
    faUndo,
    faRedo,
    faEraser,
    faQuoteRight,
    faLink,
    faMinus,
    faArrowTurnDown,
    faImage,
    faAlignLeft,
    faAlignCenter,
    faAlignRight,
    faAlignJustify,
} from "@fortawesome/free-solid-svg-icons";
import { DropDownTextColor } from "./partials/DropDownColorText";
import { DropDownHeading } from "./partials/DropDownHeading";
import { DropDownList } from "./partials/DropDownList";

interface MenuBarProps {
    insertImage: (url: string) => void;
    openUploadDialog: () => void;
    editor: Editor | null;
}

const ToolbarButton = ({
    onClick,
    isActive,
    icon,
    title,
}: {
    onClick: () => void;
    isActive?: boolean;
    icon: any;
    title: string;
}) => (
    <button
        type="button"
        onClick={onClick}
        title={title}
        aria-label={title}
        className={`rounded p-1 transition hover:bg-gray-200 ${isActive ? "bg-gray-300" : ""}`}
    >
        <FontAwesomeIcon icon={icon} />
    </button>
);

export const MenuBar = ({ openUploadDialog, editor }: MenuBarProps) => {
    if (!editor) return null;

    const addLink = () => {
        const previousUrl = editor.getAttributes("link").href;
        const url = window.prompt("URL", previousUrl);
        if (url === null) return;
        if (url === "") {
            editor.chain().focus().extendMarkRange("link").unsetLink().run();
            return;
        }
        editor
            .chain()
            .focus()
            .extendMarkRange("link")
            .setLink({ href: url })
            .run();
    };

    return (
        <div className="control-group rounded border border-gray-300 bg-white p-4 shadow-sm">
            <div className="mb-3 flex flex-wrap items-center gap-2 border-b pb-2">
                <ToolbarButton
                    onClick={() => editor.chain().focus().undo().run()}
                    icon={faUndo}
                    title="Deshacer"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().redo().run()}
                    icon={faRedo}
                    title="Rehacer"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().unsetAllMarks().run()}
                    icon={faEraser}
                    title="Limpiar formato"
                />

                <span className="text-gray-400 px-1 text-xl">|</span>

                <DropDownHeading editor={editor} />
                <DropDownList editor={editor} />

                <span className="text-gray-400 px-1 text-xl">|</span>

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive("bold")}
                    icon={faBold}
                    title="Negrita"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive("italic")}
                    icon={faItalic}
                    title="Cursiva"
                />
                <ToolbarButton
                    onClick={() =>
                        editor.chain().focus().toggleMark("underline").run()
                    }
                    isActive={editor.isActive("underline")}
                    icon={faUnderline}
                    title="Subrayado"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    isActive={editor.isActive("strike")}
                    icon={faStrikethrough}
                    title="Tachado"
                />
                <DropDownTextColor editor={editor} />

                <span className="text-gray-400 px-1 text-xl">|</span>

                <ToolbarButton
                    onClick={() =>
                        editor.chain().focus().toggleBlockquote().run()
                    }
                    isActive={editor.isActive("blockquote")}
                    icon={faQuoteRight}
                    title="Cita"
                />
                <ToolbarButton
                    onClick={addLink}
                    isActive={editor.isActive("link")}
                    icon={faLink}
                    title="Insertar enlace"
                />
                <ToolbarButton
                    onClick={() =>
                        editor.chain().focus().setHorizontalRule().run()
                    }
                    icon={faMinus}
                    title="Insertar regla horizontal"
                />

                <span className="text-gray-400 px-1 text-xl">|</span>

                <ToolbarButton
                    onClick={() =>
                        editor.chain().focus().setTextAlign("left").run()
                    }
                    isActive={editor.isActive({ textAlign: "left" })}
                    icon={faAlignLeft}
                    title="Alinear a la izquierda"
                />
                <ToolbarButton
                    onClick={() =>
                        editor.chain().focus().setTextAlign("center").run()
                    }
                    isActive={editor.isActive({ textAlign: "center" })}
                    icon={faAlignCenter}
                    title="Centrar"
                />
                <ToolbarButton
                    onClick={() =>
                        editor.chain().focus().setTextAlign("right").run()
                    }
                    isActive={editor.isActive({ textAlign: "right" })}
                    icon={faAlignRight}
                    title="Alinear a la derecha"
                />
                <ToolbarButton
                    onClick={() =>
                        editor.chain().focus().setTextAlign("justify").run()
                    }
                    isActive={editor.isActive({ textAlign: "justify" })}
                    icon={faAlignJustify}
                    title="Justificar"
                />

                <ToolbarButton
                    onClick={() => editor.chain().focus().setHardBreak().run()}
                    icon={faArrowTurnDown}
                    title="Insertar salto de línea"
                />

                <span className="text-gray-400 px-1 text-xl">|</span>

                <ToolbarButton
                    onClick={openUploadDialog}
                    icon={faImage}
                    title="Subir imagen"
                />
            </div>
        </div>
    );
};
