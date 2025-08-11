import { Event } from "@/types/entities/event";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { EventChartSidebar } from "../Graph/event-chart-sidear";

type SidebarDetailsProps = {
    event: Event;
};

export default function SidebarDetails({ event }: SidebarDetailsProps) {
    const accepted = event.accepted ?? 0;
    const rejected = event.rejected ?? 0;
    const pending = event.pending ?? 0;
    const capacity = event.capacity ?? 0;

    const free = capacity > 0 ? capacity - accepted - rejected - pending : 0;

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return "-";
        const date = new Date(dateStr);
        return date.toLocaleDateString("es-MX", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
        });
    };

    const formatTime = (dateStr?: string) => {
        if (!dateStr) return "-";
        const date = new Date(dateStr);
        return date.toLocaleTimeString("es-MX", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });
    };

    return (
        <aside>
            <div className="bg-primary h-20 relative flex items-center justify-center px-6">
                <div className="absolute left-6">
                    <FontAwesomeIcon
                        icon={faArrowLeft}
                        size="xl"
                        className="text-white cursor-pointer"
                        onClick={() => (window.location.href = route("events.index"))}
                    />
                </div>
                <div className="w-full text-center ml-8">
                    <h2 className="font-xl-regular font-bold text-white break-words">
                        {event.name}
                    </h2>
                </div>
            </div>

            <div className="px-8 py-4 font-md-regular">
                <div className="pb-4">
                    <p className="font-md-regular text-primary pb-2">
                        {event.location ?? "Lugar sin nombre"}
                    </p>
                    <p className="font-sm-regular">Dirección:</p>
                    <p className="pb-4">{event.address ?? "No especificada"}</p>
                </div>
                <div className="pb-4">
                    <p className="font-sm-regular">Inicia: </p>
                    <p className="font-md-regular pb-4">
                        {new Date(event.start_time).toLocaleString("es-MX")}
                    </p>
                    <p className="font-sm-regular">Finaliza:</p>
                    <p className="font-md-regular pb-4">
                        {new Date(event.end_time).toLocaleString("es-MX")}
                    </p>
                    <p className="font-sm-regular">Invitaciones:</p>
                    <p className="font-md-regular pb-4">
                        {event.invitation_scheduled_date
                            ? new Date(event.invitation_scheduled_date) >
                              new Date()
                                ? `Programada para: ${new Date(event.invitation_scheduled_date).toLocaleString("es-MX")}`
                                : `Enviadas el ${new Date(event.invitation_scheduled_date).toLocaleString("es-MX")}`
                            : "No programadas"}
                    </p>
                </div>
                <div className="font-md-regular pb-4">
                    <p className="pb-2">Aforo permitido: {event.capacity}</p>
                    <p className="pb-2">Aforo total: {event.tolerance_quota}</p>
                    <p className="pb-2">Invitaciones: </p>
                    <p className="pb-2">Invitados: </p>
                </div>
                <div className="flex flex-col gap-3 text-black font-md-regular w-full">
                    <div className="flex flex-col items-start">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-[#28CC8B]" />
                            <span>Confirmado</span>
                        </div>
                        <span className="pl-5 font-bold">{accepted}</span>
                    </div>

                    <div className="flex flex-col items-start">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-[#D9534F]" />
                            <span>Rechazado</span>
                        </div>
                        <span className="pl-5 font-bold">{rejected}</span>
                    </div>

                    <div className="flex flex-col items-start">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-[#FFD966]" />
                            <span>Pendiente</span>
                        </div>
                        <span className="pl-5 font-bold">{pending}</span>
                    </div>

                    <div className="flex flex-col items-start">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-[#005AA7]" />
                            <span>Libre</span>
                        </div>
                        <span className="pl-5 font-bold">{free}</span>
                    </div>
                </div>
                <div className="pt-2">
                    <EventChartSidebar
                        accepted={accepted}
                        rejected={rejected}
                        pending={pending}
                        free={free}
                    />
                </div>
            </div>
        </aside>
    );
}
