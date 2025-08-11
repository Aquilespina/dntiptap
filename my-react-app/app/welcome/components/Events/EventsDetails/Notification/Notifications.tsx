import { useState } from "react";
import { Variable } from "../Invitation/Invitation";
import RichTextEditor from "@/components/RichText/RichText";
import { Button, Input } from "@heroui/react";
import Dates from "@/components/Date/Dates";
import { PrimaryButton, SecondaryButton } from "@/components/Button";
import VariablePanel from "../Invitation/partials/VariablePanel";
import dayjs from "dayjs";
import { Event } from "@/types/entities/event";
import { parseGuestVariables } from "@/components/helpers/parse-guest-variables";

interface NotificationsProps {
    guestVariables: Variable[];
    eventVariables: Variable[];
}

export default function Notifications({
    guestVariables,
    eventVariables,
}: NotificationsProps) {
    const [scheduleDate, setScheduleDate] = useState<Date | null>(null);
    const [sendNow, setSendNow] = useState(false);
    const [subject, setSubject] = useState("");
    const [htmlContent, setHtmlContent] = useState("");
    const [jsonContent, setJsonContent] = useState({});

    const guestConfigString = JSON.stringify(
        guestVariables.map((item) => ({
            key: item.key.replace(/^@/, ""),
            label: item.label,
        })),
    );

    const { defaultVariables, additionalVariables } =
        parseGuestVariables(guestConfigString);

    const handleDragStart = (
        e: React.DragEvent<HTMLDivElement>,
        variableKey: string,
        type: "guest" | "event",
    ) => {
        const prefix = type === "guest" ? "@" : "#";
        e.dataTransfer.setData("text/plain", `${prefix}${variableKey}`);
        e.dataTransfer.effectAllowed = "copy";
    };

    const handleScheduleDateChange = (date: Date | null) => {
        setScheduleDate(date);
    };

    const handleScheduleTimeChange = (time: Date | null) => {
        if (time && scheduleDate) {
            const updated = new Date(scheduleDate);
            updated.setHours(time.getHours());
            updated.setMinutes(time.getMinutes());
            setScheduleDate(updated);
        }
    };

    return (
        <div className="p-6 space-y-4">
            <p className=" mb-6 font-lg-regular">
                Teclea{" "}
                <span className="text-event-attribute font-semibold font-2xl-regular">
                    # para añadir información del evento
                </span>{" "}
                y{" "}
                <span className="text-default-attribute font-semibold font-2xl-regular">
                    @ para información del invitado
                </span>
            </p>

            <VariablePanel
                eventVariables={eventVariables}
                defaultGuestVariables={guestVariables.slice(0, 3)}
                additionalGuestVariables={guestVariables.slice(3)}
                handleDragStart={(e, key) => {
                    e.dataTransfer.setData("text/plain", key);
                }}
                scheduleDate={
                    scheduleDate ? dayjs(scheduleDate).format("YYYY-MM-DD") : ""
                }
                scheduleTime={
                    scheduleDate ? dayjs(scheduleDate).format("HH:mm") : ""
                }
            />

            <div className="flex flex-wrap gap-10 items-end">
                <div className="w-[296px]">
                    <Dates
                        type="date"
                        id="invitation_schedule_date" //cambiar a notification
                        label="Fecha de envío"
                        value={scheduleDate}
                        onChange={handleScheduleDateChange}
                        minDate={new Date()}
                    />
                </div>
                <div className="w-[136px]">
                    <Dates
                        type="time"
                        id="invitation_schedule_date" //cambiar a notification
                        label="Hora de envío"
                        value={scheduleDate}
                        onChange={handleScheduleTimeChange}
                        startDate={scheduleDate}
                    />
                </div>
                <div className="flex-1 min-w-[544px]">
                    <label className="block font-md-regular text-gray-700 mb-1">
                        Asunto
                    </label>
                    <Input
                        placeholder="Escriba el asunto que aparecera en el correo"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="block w-full rounded-sm bg-white border border-input-border"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2 mt-2">
                <input
                    id="send_now"
                    type="checkbox"
                    checked={sendNow}
                    onChange={() => setSendNow(!sendNow)}
                />
                <label htmlFor="send_now" className="font-md-regular">
                    Enviar correo inmediatamente
                </label>
            </div>

            <RichTextEditor
                content={htmlContent}
                onChange={(html, json) => {
                    setHtmlContent(html);
                    setJsonContent(json);
                }}
                guestVariables={guestVariables}
                eventVariables={eventVariables}
            />

            <div className="flex justify-end gap-4 mt-4">
                <SecondaryButton className="px-4 py-2 rounded-sm">
                    Previsualizar
                </SecondaryButton>
                <PrimaryButton className="px-4 py-2 rounded-sm">
                    Programar envío
                </PrimaryButton>
            </div>
        </div>
    );
}
