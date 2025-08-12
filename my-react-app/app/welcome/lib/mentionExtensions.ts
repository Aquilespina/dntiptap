import { Extension } from "@tiptap/core";
import { PluginKey } from "prosemirror-state";
import type { SuggestionOptions, SuggestionProps } from "@tiptap/suggestion";
import suggestion from "@tiptap/suggestion";
// import {  NodeAttrs } from "./ ";

export function createExtension(
    char: "@" | "#",
    type: "guest" | "event",
    variables: { id: string; label: string }[],
    key: string
): Extension {
    return Extension.create({
        name: `Suggestion${type}`,

        addProseMirrorPlugins() {
            return [
                suggestion({
                    editor: this.editor, // <--- esta línea es la que faltaba
                    char,
                    pluginKey: new PluginKey(key),
                    items: ({ query }) =>
                        variables
                            .filter((v) =>
                                v.label
                                    .toLowerCase()
                                    .includes(query.toLowerCase()),
                            )
                            .map((v) => ({
                                id: v.id,
                                label: v.label,
                                type,
                            })),
                    render: () => {
                        let component: HTMLDivElement;
                        let popup: HTMLDivElement;

                        return {
                            onStart: (props) => {
                                component = document.createElement("div");
                                component.className =
                                    "border p-2 shadow rounded bg-white text-sm z-50";
                                update(props);

                                popup = document.createElement("div");
                                popup.appendChild(component);
                                document.body.appendChild(popup);

                                const rect = props.clientRect?.();
                                if (!rect) return;
                                popup.style.position = "absolute";
                                popup.style.top = `${rect.top + 30}px`;
                                popup.style.left = `${rect.left}px`;
                            },
                            onUpdate(props) {
                                update(props);
                            },
                            onKeyDown({ event }) {
                                if (event.key === "Escape") {
                                    popup?.remove();
                                    return true;
                                }
                                return false;
                            },
                            onExit() {
                                popup?.remove();
                            },
                        };

                        function update({ items, command }) {
                            if (!component) return;
                            component.innerHTML = "";

                            items.forEach((item) => {
                                const div = document.createElement("div");
                                div.className =
                                    "cursor-pointer hover:bg-gray-100 px-2 py-1";
                                div.textContent = item.label;
                                div.onclick = () => command(item);
                                component.appendChild(div);
                            });
                        }
                    },
                    command: ({ editor, range, props }) => {
                        editor
                            .chain()
                            .focus()
                            .deleteRange(range)
                            .insertContent({
                                type: type,
                                attrs: props,
                            })
                            .run();
                    },
                }),
            ];
        },
    });
}
