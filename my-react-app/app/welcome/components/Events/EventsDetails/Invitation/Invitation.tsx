import { useEffect, useRef, useState } from "react";
import { Input } from "@heroui/react";
import RichTextEditor from "../../../RichText/RichText";
import InvitationActions from "./partials/InvitationActions";
import Dates from "../../../../components/Date/Dates";
import VariablePanel from "./partials/VariablePanel";
import { parseGuestVariables } from "../../../../components/helpers/parse-guest-variables";
import dayjs from "dayjs";

type Status = "not_scheduled" | "sent" | "scheduled";
type LocalStatus = "not_scheduled" | "scheduled" | "editing" | "sent";

export interface Variable {
    label: string;
    key: string;
}

interface InvitationProps {
    guestVariables: Variable[];
    eventVariables: Variable[];
    status: Status;
    scheduledAt?: string;
}

export default function Invitation({
    guestVariables,
    eventVariables,
    status,
    scheduledAt,
}: InvitationProps) {
    const [subject, setSubject] = useState("Invitación a ");
    const [htmlContent, setHtmlContent] = useState("");
    const [jsonContent, setJsonContent] = useState<object>({});
    const [scheduleDate, setScheduleDate] = useState<Date | null>(null);

    const initializedRef = useRef(false);
    const [localStatus, setLocalStatus] =
        useState<LocalStatus>("not_scheduled");

    const [initialValues, setInitialValues] = useState({
        subject: "Invitación a ",
        htmlContent: "",
        scheduleDate: null as Date | null,
    });

    useEffect(() => {
        if (
            !initializedRef.current &&
            htmlContent.trim() !== "" &&
            subject.trim() !== ""
        ) {
            setInitialValues({
                subject,
                htmlContent,
                scheduleDate,
            });
            initializedRef.current = true;
        }
    }, [htmlContent, subject, scheduleDate]);

    useEffect(() => {
        setLocalStatus(status);
    }, [status]);

    useEffect(() => {
        if (scheduledAt) {
            setScheduleDate(new Date(scheduledAt));
        }
    }, [scheduledAt]);

    const isDirty =
        localStatus === "editing" &&
        (subject !== initialValues.subject ||
            htmlContent !== initialValues.htmlContent ||
            !dayjs(scheduleDate).isSame(initialValues.scheduleDate));

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
        <div className="p-6 space-y-6">
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
                defaultGuestVariables={defaultVariables}
                additionalGuestVariables={additionalVariables}
                handleDragStart={handleDragStart}
                localStatus={localStatus}
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
                        id="invitation_schedule_date"
                        label="Fecha de envío"
                        value={scheduleDate}
                        onChange={handleScheduleDateChange}
                        minDate={new Date()}
                    />
                </div>

                <div className="w-[136px]">
                    <Dates
                        type="time"
                        id="invitation_schedule_date"
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
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        onDrop={(e) => {
                            e.preventDefault();
                            const text = e.dataTransfer.getData("text/plain");
                            setSubject((prev) => prev + " " + text);
                        }}
                        onDragOver={(e) => e.preventDefault()}
                        className="block w-full rounded-sm bg-white border border-input-border"
                    />
                </div>
            </div>

            <div>
                <RichTextEditor
                    content={htmlContent}
                    onChange={(html, json) => {
                        setHtmlContent(html);
                        setJsonContent(json);
                    }}
                    guestVariables={guestVariables}
                    eventVariables={eventVariables}
                />
            </div>

            <InvitationActions
                localStatus={localStatus}
                setLocalStatus={setLocalStatus}
                isDirty={isDirty}
            />
        </div>
    );
}
