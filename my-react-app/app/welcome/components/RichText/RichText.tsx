import { useEffect, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Color from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import { MenuBar } from "./MenuBar";
import ImageFloatMenu from "../../partials/ImageFloatMenu";
import { CustomImage } from "../../lib/customImage";
import { Variable } from "../Events/EventsDetails/Invitation/Invitation";
import { getMentionExtensions } from "./partials/Mentions";
import { Mention } from "../../lib/mention";

interface RichTextBlockProps {
    content: string;
    onChange: (html: string, json: object) => void;
    guestVariables: Variable[];
    eventVariables: Variable[];
}

export default function RichTextEditor({
    content,
    onChange,
    guestVariables,
    eventVariables,
}: RichTextBlockProps) {
    const [showImageMenu, setShowImageMenu] = useState(false);
    const [htmlContent, setHtmlContent] = useState(content);

    const editor = useEditor({
        extensions: [
            Color.configure({ types: [TextStyle.name, ListItem.name] }),
            TextStyle,
            StarterKit.configure({
                bulletList: { keepMarks: true, keepAttributes: false },
                orderedList: { keepMarks: true, keepAttributes: false },
                underline: false,
                link: false,
                immediatelyRender: false,
            }),
            Underline,
            CustomImage,
            TextAlign.configure({ types: ["heading", "paragraph"] }),
            Link.configure({ openOnClick: false }),
            Mention,
            ...getMentionExtensions(guestVariables, eventVariables),
        ],
        content: htmlContent,
        editorProps: {
            attributes: {
                class: "focus:outline-none prose whitespace-pre-wrap",
            },
        },
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            const json = editor.getJSON();
            setHtmlContent(html);
            onChange(html, json);
        },
    });

    useEffect(() => {
        if (!editor) return;
        const handleUpdate = () => {
            setShowImageMenu(editor.isActive("customImage"));
        };

        editor.on("selectionUpdate", handleUpdate);
        editor.on("transaction", handleUpdate);

        return () => {
            editor.off("selectionUpdate", handleUpdate);
            editor.off("transaction", handleUpdate);
        };
    }, [editor]);

    return (
        <div className="rounded border-4 border-wysiwyg-border bg-white">
            <MenuBar
                editor={editor}
                insertImage={(url) => {
                    editor?.commands.setImage({
                        src: url,
                        class: "mx-auto block",
                        style: "max-width: 100%",
                    });
                }}
                openUploadDialog={() => { }}
            />

            <div className="max-h-[600px] min-h-[200px] overflow-y-auto rounded bg-card p-4 text-base shadow-inner">
                <EditorContent
                    editor={editor}
                    onDrop={(e) => {
                        const text = e.dataTransfer.getData("text/plain");
                        e.preventDefault();
                        const pos = editor?.view.posAtCoords({
                            left: e.clientX,
                            top: e.clientY,
                        });

                        if (!pos || !text) return;

                        const type = text.startsWith("@") ? "guest" : "event";
                        const cleanKey = text.replace(/^[@#]/, "");

                        const variable =
                            type === "guest"
                                ? guestVariables.find((v) => v.key === cleanKey)
                                : eventVariables.find(
                                    (v) => v.key === cleanKey,
                                );

                        if (!variable) return;
                        editor
                            .chain()
                            .focus()
                            .insertContentAt(pos.pos, {
                                type: "mention",
                                attrs: {
                                    id: cleanKey,
                                    label: variable.label,
                                    type,
                                },
                            })
                            .run();
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    className="prose prose-sm prose-p:my-1 prose-ul:my-1 prose-li:my-0 list-inside min-h-[150px] focus:outline-none border-none ring-0 focus:ring-0 focus:border-transparent whitespace-pre-wrap"
                />
                {editor && showImageMenu && <ImageFloatMenu editor={editor} />}
            </div>
        </div>
    );
}
