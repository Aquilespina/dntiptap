import { Node, mergeAttributes } from "@tiptap/core";

declare module "@tiptap/core" {
    interface Commands<ReturnType> {
         : {
            setImage: (options: {
                src: string;
                alt?: string;
                title?: string;
                class?: string;
                style?: string;
            }) => ReturnType;
        };
    }
}

export const   = Node.create({
    name: "image",
    group: "block",
    inline: false,
    atom: true,

    addAttributes() {
        return {
            src: { default: null },
            alt: { default: null },
            title: { default: null },
            class: { default: "" },
            style: { default: "" },
        };
    },

    parseHTML() {
        return [{ tag: "img[src]" }];
    },

    renderHTML({ HTMLAttributes }) {
        return ["img", mergeAttributes(HTMLAttributes)];
    },

    addCommands() {
        return {
            setImage:
                (options) =>
                ({ commands }) => {
                    return commands.insertContent({
                        type: this.name,
                        attrs: options,
                    });
                },
        };
    },
});
