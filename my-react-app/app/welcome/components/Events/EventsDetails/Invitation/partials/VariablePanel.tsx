import React, { useState } from "react";
import StatusBanner from "./StatusBanner";
import { Variable } from "../Invitation";
import { SecondaryButton } from "../../../../../components/Button";

type LocalStatus = "not_scheduled" | "scheduled" | "editing" | "sent";

interface VariablePanelProps {
    eventVariables: Variable[];
    defaultGuestVariables: Variable[];
    additionalGuestVariables: Variable[];
    handleDragStart: (
        e: React.DragEvent<HTMLDivElement>,
        variableKey: string,
        type: "guest" | "event",
    ) => void;
    localStatus?: LocalStatus;
    scheduleDate: string;
    scheduleTime: string;
}

const recipientFilters = ["Confirmados", "Rechazados", "Pendientes", "Todos"];

export default function VariablePanel({
    eventVariables,
    defaultGuestVariables,
    additionalGuestVariables,
    handleDragStart,
    localStatus,
    scheduleDate,
    scheduleTime,
}: VariablePanelProps) {
    const [selectedFilter, setSelectedFilter] = useState("Todos");
    return (
        <div className="flex flex-col md:flex-row md:gap-x-8 items-start justify-start w-full">
            {/* EVENT VARIABLES */}
            <div className="w-full md:w-5/12">
                <h2 className="font-semibold font-xl-regular text-event-attribute mb-2">
                    # Información del evento
                </h2>
                <div className="bg-[#7C458512] border-2 border-[#7AB2B20D] rounded-lg p-3 w-full min-h-[135px]">
                    <div className="flex flex-wrap gap-2">
                        {eventVariables.map((item) => (
                            <div
                                key={item.key}
                                draggable
                                onDragStart={(e) =>
                                    handleDragStart(e, item.key, "event")
                                }
                                className="cursor-move px-3 py-1 bg-event-attribute text-white rounded-full font-2xl-regular shadow hover:bg-purple-300"
                            >
                                {item.label}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="mt-2 w-full pt-4">
                    {localStatus ? (
                        <StatusBanner
                            localStatus={localStatus}
                            date={scheduleDate}
                            time={scheduleTime}
                        />
                    ) : (
                        <div className="flex gap-4 flex-wrap">
                            {recipientFilters.map((filter) => (
                                <SecondaryButton
                                    key={filter}
                                    onClick={() => setSelectedFilter(filter)}
                                    className="rounded-full"
                                >
                                    {filter}
                                </SecondaryButton>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* GUEST VARIABLES */}
            <div className="w-full md:w-7/12">
                <h2 className="font-semibold font-xl-regular text-default-attribute mb-2">
                    @ Información del invitado
                </h2>
                <div className="flex flex-col sm:flex-row gap-0">
                    <div className="flex-1 bg-[#27548A1A] border-2 border-[#7AB2B20D] rounded-s-lg min-h-[235px]">
                        <h3 className="font-semibold text-default-attribute pt-2 pl-4 font-2xl-regular">
                            Por defecto
                        </h3>
                        <div className="flex flex-wrap gap-2 p-2">
                            {defaultGuestVariables.map((item) => (
                                <div
                                    key={item.key}
                                    draggable
                                    onDragStart={(e) =>
                                        handleDragStart(e, item.key, "guest")
                                    }
                                    className="cursor-move px-3 py-1 bg-default-attribute text-white rounded-full font-2xl-regular shadow hover:bg-[#0d5c9b]"
                                >
                                    {item.label}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 bg-[#27548A1A] border-2 border-[#357ABD1A] rounded-r-lg">
                        <h3 className="font-semibold text-[#357ABD] pt-2 pl-4 font-2xl-regular">
                            Adicional
                        </h3>
                        <div className="flex flex-wrap gap-2 p-2">
                            {additionalGuestVariables.map((item) => (
                                <div
                                    key={item.key}
                                    draggable
                                    onDragStart={(e) =>
                                        handleDragStart(e, item.key, "guest")
                                    }
                                    className="cursor-move px-3 py-1 bg-[#1676C4] text-white rounded-full font-2xl-regular shadow hover:bg-[#0d5c9b]"
                                >
                                    {item.label}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
