import { faFilter } from "@fortawesome/free-solid-svg-icons";
import TabFilters, { TabFilter } from "../../../Tab/tab-filters";
import { Event } from "@/types/entities/event";
import { StatusDot, StatusType } from "../../../Section/Invitation/StatusDots";
import { PrimaryButton, SecondaryButton } from "@/components/Button";
import { useEffect, useState } from "react";
import { ManualInvitationForm } from "./partials/ManualInvitationForm";
import ExcelUpload from "@/components/Dashboard/Guest/Import/Shared/ExcelUpload";
import { Input } from "@heroui/react";
import { useTableData } from "@/hooks/use-table-data";
import { Invitation } from "@/types/entities/invitation";
import { ConfigFormData } from "@/hooks/use-config-form";

type InvitationIndexProps = {
    event: Event;
};

export default function InvitationIndex({ event }: InvitationIndexProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isAgreeModalOpen, setIsAgreeModalOpen] = useState(false);
    const [isAttributeModalOpen, setIsAttributeModalOpen] = useState(false);
    const [addingMode, setAddingMode] = useState<"manual" | "excel" | null>(
        null,
    );
    const [invitations, setInvitations] = useState<Invitation[]>([]);
    const [searchValue, setSearchValue] = useState<string>("");
    const [customFields, setCustomFields] = useState<ConfigFormData>({
        customFields: [],
    });

    const { data, handleSearchChange } = useTableData({
        initialFilters: {
            search: searchValue || "",
            page: 1,
        },
        apiMode: true,
        apiUrl: event ? route("api.events.invitations.index", event.uri_event) : "",
        onApiResponse: (data) => {
            setInvitations(data.data.data || []);
        },
    });

    const allInvitations = invitations || [];
    const accepted = allInvitations.filter((i) => i.response === 1);
    const rejected = allInvitations.filter((i) => i.response === -1);
    const pending = allInvitations.filter(
        (i) => i.response === 0 || i.response === null,
    );

    const configFields = Array.isArray(event.config) ? event.config : [];
    const defaultKeys = ["name", "email", "additional_guests"];
    const defaultFields = configFields.filter((f) =>
        defaultKeys.includes(f.key),
    );
    const metadataFields = configFields.filter(
        (f) => !defaultKeys.includes(f.key),
    );

    const getFieldValue = (inv: any, key: string) => {
        if (key === "name") return inv.name;
        if (key === "email") return inv.email;
        if (key === "additional_guests") return inv.additional_guests;
        const meta = inv.metadata?.find((m) => m.key === key);
        return meta?.value || "-";
    };

    const mapResponseToStatus = (response: number | null): StatusType => {
        if (response === 1) return "confirmado";
        if (response === -1) return "rechazado";
        return "pendiente";
    };

    const renderTable = (invitations: typeof allInvitations) => (
        <div className="relative overflow-x-auto rounded-xl shadow-md w-full">
            <table className="w-full min-w-[600px] border-collapse table-auto border-spacing-0 whitespace-nowrap bg-transparent">
                <thead className="sticky top-0 z-10">
                    <tr>
                        <th
                            colSpan={defaultFields.length}
                            className="px-4 py-3 text-left bg-default-info-import text-[#27548A] rounded-tl-xl"
                        >
                            Información de invitados por defecto
                        </th>
                        <th
                            colSpan={metadataFields.length}
                            className="px-4 py-3 text-left bg-new-info-import text-[#357ABD] rounded-tr-xl"
                        >
                            Información adicional
                        </th>
                    </tr>
                    <tr>
                        {defaultFields.map((field) => (
                            <th
                                key={field.key}
                                className="px-4 py-2 text-left bg-default-info-import text-sm text-[#27548A]"
                            >
                                {field.label}
                            </th>
                        ))}
                        {metadataFields.map((field) => (
                            <th
                                key={field.key}
                                className="px-4 py-2 text-left bg-new-info-import text-sm text-[#357ABD]"
                            >
                                {field.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {invitations.map((inv) => (
                        <tr
                            key={inv.uri_invitation}
                            className="last:[&>td:first-child]:rounded-bl-xl last:[&>td:last-child]:rounded-br-xl"
                        >
                            {defaultFields.map((field) => (
                                <td
                                    key={field.key}
                                    className="px-4 py-2 bg-default-info-import text-sm"
                                >
                                    {field.key === "name" ? (
                                        <div className="flex items-center gap-2">
                                            <StatusDot
                                                status={mapResponseToStatus(
                                                    inv.response,
                                                )}
                                            />
                                            {isEditing ? (
                                                <Input
                                                    defaultValue={inv.name}
                                                    className="rounded border bg-white border-input-border px-2 py-1"
                                                />
                                            ) : (
                                                <span>{inv.name}</span>
                                            )}
                                        </div>
                                    ) : field.key === "email" ? (
                                        isEditing ? (
                                            <Input
                                                defaultValue={inv.email}
                                                type="email"
                                                className="rounded border bg-white border-input-border px-2 py-1"
                                            />
                                        ) : (
                                            <span>{inv.email}</span>
                                        )
                                    ) : field.key === "additional_guests" ? (
                                        isEditing ? (
                                            <Input
                                                defaultValue={
                                                    inv.additional_guests
                                                }
                                                type="number"
                                                className="rounded border bg-white border-input-border px-2 py-1"
                                            />
                                        ) : (
                                            <span>{inv.additional_guests}</span>
                                        )
                                    ) : null}
                                </td>
                            ))}
                            {metadataFields.map((field) => (
                                <td
                                    key={field.key}
                                    className="px-4 py-2 bg-new-info-import text-sm"
                                >
                                    {isEditing ? (
                                        <Input
                                            defaultValue={getFieldValue(
                                                inv,
                                                field.key,
                                            )}
                                            className="rounded border bg-white border-input-border px-2 py-1"
                                        />
                                    ) : (
                                        <span>
                                            {getFieldValue(inv, field.key)}
                                        </span>
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const tabContents: TabFilter[] = [
        { key: "all", title: "Todos", content: renderTable(allInvitations) },
        {
            key: "accepted",
            title: "Confirmados",
            content: renderTable(accepted),
        },
        {
            key: "rejected",
            title: "Rechazados",
            content: renderTable(rejected),
        },
        { key: "pending", title: "Pendientes", content: renderTable(pending) },
    ];

    return (
        <div className="w-full h-full">
            {addingMode === "manual" && (
                <ManualInvitationForm
                    event={event}
                    onCancel={() => setAddingMode(null)}
                />
            )}

            {addingMode === "excel" && (
                <ExcelUpload
                    onCancel={() => setAddingMode(null)}
                    endpoint={route("events.import", { event })}
                    event={event}
                />
            )}

            {!addingMode && (
                <div className="rounded-sm">
                    <TabFilters
                        tabContents={tabContents}
                        icon={faFilter}
                        handleSearchingBar={handleSearchChange}
                    />

                    <div className="mt-8 flex justify-end gap-4">
                        <PrimaryButton
                            onClick={() => setIsAttributeModalOpen(true)}
                            className="rounded-sm"
                        >
                            Añadir información
                        </PrimaryButton>
                        <SecondaryButton
                            onClick={() => setIsEditing((prev) => !prev)}
                            className="rounded-sm"
                        >
                            {isEditing ? "Cancelar edición" : "Editar"}
                        </SecondaryButton>
                        <PrimaryButton
                            onClick={() => setIsAgreeModalOpen(true)}
                            className="rounded-sm"
                        >
                            Añadir invitados
                        </PrimaryButton>
                    </div>
                </div>
            )}

            {/* <ModalAgreeInvitation
                open={isAgreeModalOpen}
                onClose={() => setIsAgreeModalOpen(false)}
                setAddingMode={(mode: "manual" | "excel") => {
                    setAddingMode(mode);
                    setIsAgreeModalOpen(false);
                }}
            />

            <AddAttributeModal
                isOpen={isAttributeModalOpen}
                onClose={() => setIsAttributeModalOpen(false)}
                uri_event={event.uri_event}
                formData={customFields}
            /> */}
        </div>
    );
}
