import { Node, mergeAttributes } from "@tiptap/core";

export interface MentionNodeAttrs {
    id: string;
    label: string;
    type: "guest" | "event";
}

declare module "@tiptap/core" {
    interface Commands<ReturnType> {
        mention: {
            insertMention: (attrs: MentionNodeAttrs) => ReturnType;
        };
    }
}

export const Mention = Node.create({
    name: "mention",
    group: "inline",
    inline: true,
    atom: true,
    selectable: false,

    addAttributes() {
        return {
            id: { default: "" },
            label: { default: "" },
            type: { default: "guest" },
        };
    },

    parseHTML() {
        return [{ tag: "span[data-mention]" }];
    },

    renderHTML({ node, HTMLAttributes }) {
        const prefix = node.attrs.type === "guest" ? "@" : "#";

        const classes =
            node.attrs.type === "guest"
                ? "bg-default-attribute text-white"
                : "bg-event-attribute text-white";

        return [
            "span",
            mergeAttributes(HTMLAttributes, {
                "data-mention": "",
                class: `inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${classes}`,
            }),
            `${prefix}${node.attrs.label}`,
        ];
    },

    addCommands() {
        return {
            insertMention:
                (attrs: MentionNodeAttrs) =>
                ({ chain }) => {
                    return chain()
                        .insertContent({
                            type: this.name,
                            attrs,
                        })
                        .run();
                },
        };
    },
});
