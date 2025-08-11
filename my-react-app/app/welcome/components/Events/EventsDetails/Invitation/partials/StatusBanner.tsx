import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCircleCheck,
    faPaperPlane,
    faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";

type LocalStatus = "not_scheduled" | "scheduled" | "editing" | "sent";

interface StatusBannerProps {
    localStatus: LocalStatus;
    date?: string;
    time?: string;
}

const formatDate = (iso: string) => new Date(iso).toLocaleDateString("es-MX");

const formatHour = (iso: string) =>
    new Date(iso).toLocaleTimeString("es-MX", {
        hour: "2-digit",
        minute: "2-digit",
    });

export default function StatusBanner({
    localStatus,
    date,
    time,
}: StatusBannerProps) {
    const datetime = date && time ? `${date}T${time}` : null;

    const baseClass =
        "w-full h-[72px] flex items-center gap-4 rounded-lg px-5 font-2xl-regular shadow";

    switch (localStatus) {
        case "not_scheduled":
            return (
                <div className={`${baseClass} bg-pending-bg text-pending-text`}>
                    <FontAwesomeIcon icon={faTriangleExclamation} />
                    <span>El envío de la invitación no ha sido programado</span>
                </div>
            );

        case "scheduled":
        case "editing":
            return (
                <div
                    className={`${baseClass} bg-schedule-bg text-schedule-text`}
                >
                    <FontAwesomeIcon icon={faPaperPlane} />
                    <span>
                        Envío programado el{" "}
                        {datetime ? formatDate(datetime) : "—"} a las{" "}
                        {datetime ? formatHour(datetime) : "—"} hrs
                    </span>
                </div>
            );

        case "sent":
            return (
                <div className={`${baseClass} bg-send-bg text-send-text`}>
                    <FontAwesomeIcon icon={faCircleCheck} />
                    <span>
                        Invitación enviada el{" "}
                        {datetime ? formatDate(datetime) : "—"} a las{" "}
                        {datetime ? formatHour(datetime) : "—"} hrs
                    </span>
                </div>
            );
    }
}
