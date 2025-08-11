import { Node, mergeAttributes } from "@tiptap/core";

export interface  NodeAttrs {
    id: string;
    label: string;
    type: "guest" | "event";
}

declare module "@tiptap/core" {
    interface Commands<ReturnType> {
         : {
            insert : (attrs:  NodeAttrs) => ReturnType;
        };
    }
}

export const   = Node.create({
    name: " ",
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
        return [{ tag: "span[data- ]" }];
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
                "data- ": "",
                class: `inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${classes}`,
            }),
            `${prefix}${node.attrs.label}`,
        ];
    },

    addCommands() {
        return {
            insert :
                (attrs:  NodeAttrs) =>
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
