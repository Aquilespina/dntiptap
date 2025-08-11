import { Variable } from "../../../components/Events/EventsDetails/Invitation/Invitation";
import { Mention } from "../../../lib/mention";
import { createMentionExtension } from "../../../lib/mentionExtensions";

export function getMentionExtensions(guestVariables, eventVariables) {
    return [
        Mention, // tu nodo
        createMentionExtension("@", "guest", guestVariables, "mentionGuest"),
        createMentionExtension("#", "event", eventVariables, "mentionEvent"),
    ];
}
