import { StatusDot } from "@/components/Section/Invitation/StatusDots";
import { Guest } from "@/types/entities/guest";
import { useEffect, useState } from "react";

export type StatusType = "confirmado" | "pendiente" | "rechazado" | "libre";

const getStatus = (attendance: number): StatusType => {
    switch (attendance) {
        case 1:
            return "confirmado";
        case 2:
            return "rechazado";
        case 0:
            return "pendiente";
        default:
            return "libre";
    }
};

export default function Attendees({ eventId }: { eventId: string }) {
    const [guests, setGuests] = useState<Guest[]>([]);

    useEffect(() => {
        fetch(`/events/${eventId}/guests`)
            .then((res) => res.json())
            .then((data) => setGuests(data));
    }, [eventId]);

    return (
        <div className="bg-info-bg rounded-xl p-4 w-full overflow-x-auto">
            <h2 className="font-lg-regular font-semibold mb-4 text-primary">
                Información de invitados por defecto
            </h2>
            <table className="w-full table-auto text-left font-md-regular rounded-lg">
                <thead>
                    <tr className="bg-secondary font-medium">
                        <th className="px-4 py-2">Estado</th>
                        <th className="px-4 py-2">Nombre del invitado</th>
                        <th className="px-4 py-2">Correo electrónico</th>
                    </tr>
                </thead>
                <tbody>
                    {guests.map((guest) => (
                        <tr
                            key={guest.uri_guest}
                            className="border border-primary-500"
                        >
                            <td className="py-2 px-2">
                                <StatusDot
                                    status={getStatus(guest.attendance)}
                                />
                            </td>
                            <td className="py-2 px-2 font-sm-regular">
                                {guest.name}
                            </td>
                            <td className="py-2 px-2">{guest.email}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
