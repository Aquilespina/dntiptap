import { cn } from "@/lib/utils";
import { UserControls } from "./UserControls/UserControls";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCircleCheck,
    faPaperPlane,
    faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import Attendees from "../Events/EventsDetails/Attendees/Attendes";
import Invitation from "../Events/EventsDetails/Invitation/Invitation";
import CheckIn from "../Events/EventsDetails/CheckIn/CheckIn";
import Tickets from "../Events/EventsDetails/Tickets/Tickets";
import Notifications from "../Events/EventsDetails/Notification/Notifications";
import InvitationIndex from "../Events/EventsDetails/Guest/InvitationIndex";
import { Event } from "@/types/entities/event";
import { parseGuestVariables } from "../helpers/parse-guest-variables";

interface NavDetailsProps {
    event: Event;
}

export function NavDetails({ event }: NavDetailsProps) {
    const [activeTab, setActiveTab] = useState("Invitación");

    let invitationStatus: "not_scheduled" | "scheduled" | "sent" =
        "not_scheduled";

    if (event.invitation_scheduled_date) {
        const scheduledDate = new Date(event.invitation_scheduled_date);
        const now = new Date();

        invitationStatus = scheduledDate <= now ? "sent" : "scheduled";
    }

    const renderInvitationIcon = () => {
        switch (invitationStatus) {
            case "sent":
                return (
                    <FontAwesomeIcon
                        icon={faCircleCheck}
                        className="text-send-text"
                    />
                );
            case "scheduled":
                return (
                    <FontAwesomeIcon
                        icon={faPaperPlane}
                        className="text-schedule-text"
                    />
                );
            default:
                return (
                    <FontAwesomeIcon
                        icon={faTriangleExclamation}
                        className="text-pending-text"
                    />
                );
        }
    };

    const invitationTextColor = () => {
        switch (invitationStatus) {
            case "sent":
                return "text-send-text";
            case "scheduled":
                return "text-schedule-text";
            default:
                return "text-pending-text";
        }
    };

    const eventVariables = [
        { label: "Nombre del evento", key: "#name" },
        { label: "Descripción", key: "#description" },
        { label: "Ubicación", key: "#location" },
        { label: "Fecha de inicio", key: "#start_time" },
        { label: "Fecha de fin", key: "#end_time" },
    ];

    const configString =
        typeof event.config === "string"
            ? event.config
            : JSON.stringify(event.config ?? []);

    const { defaultVariables, additionalVariables } =
        parseGuestVariables(configString);

    const navItems = [
        {
            label: "Invitación",
            render: () => (
                <Invitation
                    guestVariables={[
                        ...defaultVariables,
                        ...additionalVariables,
                    ]}
                    eventVariables={eventVariables}
                    status={invitationStatus}
                    scheduledAt={event.invitation_scheduled_date}
                />
            ),
        },
        {
            label: "Invitados",
            render: () => <InvitationIndex event={event} />,
        },
        {
            label: "Notificaciones",
            render: () => (
                <Notifications
                    guestVariables={[
                        ...defaultVariables,
                        ...additionalVariables,
                    ]}
                    eventVariables={eventVariables}
                />
            ),
        },
        {
            label: "Boletos QR",
            render: () => <Tickets />,
        },
        {
            label: "Asistentes",
            render: () => <Attendees />,
        },
        {
            label: "Check in",
            render: () => <CheckIn />,
        },
    ];

    const ActiveRender = navItems.find(
        (item) => item.label === activeTab,
    )?.render;

    return (
        <div className="flex flex-col gap-4">
            <nav className="bg-secondary h-20 flex items-center justify-between px-6">
                <ul className="flex gap-4 font-xl-regular font-semibold text-primary">
                    {navItems.map((item) => {
                        const isInvitation = item.label === "Invitación";
                        const isActive = activeTab === item.label;

                        return (
                            <li
                                key={item.label}
                                onClick={() => setActiveTab(item.label)}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer transition-colors duration-200",
                                    isActive
                                        ? "bg-white shadow text-primary"
                                        : "hover:bg-primary/10 text-primary",
                                    isInvitation && invitationTextColor(),
                                )}
                            >
                                {isInvitation && renderInvitationIcon()}
                                <span>{item.label}</span>
                            </li>
                        );
                    })}
                </ul>
                <UserControls showHomeButton={true} showUserDropdown={true} />
            </nav>
            <div>{ActiveRender && <ActiveRender />}</div>
        </div>
    );
}
