// import { Variable } from "@/welcome/components/Events/EventsDetails/Invitation/Invitation";
import {   } from "app/welcome/lib/ ";
import { create Extension } from "app/welcome/lib/ Extension";

export function get  (guestVariables, eventVariables) {
    return [
         , // tu nodo
        create Extension("@", "guest", guestVariables, " Guest"),
        create Extension("#", "event", eventVariables, " Event"),
    ];
}
