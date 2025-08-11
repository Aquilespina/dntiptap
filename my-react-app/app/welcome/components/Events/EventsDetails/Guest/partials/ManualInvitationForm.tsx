import { PrimaryButton, SecondaryButton } from "@/components/Button";
import { StatusDot } from "@/components/Section/Invitation/StatusDots";
import { Event } from "@/types/entities/event";
import { Input } from "@heroui/react";
import { useForm } from "@inertiajs/react";
import { randomUUID } from "node:crypto";
import { useEffect, useState } from "react";

type ManualInvitationFormProps = {
    onCancel: () => void;
};

type Field = {
    key: string;
    label: string;
    fieldType: string;
    placeholder: string;
    order: number;
    value?: string | number;
};

export const ManualInvitationForm = ({
    onCancel,
}: ManualInvitationFormProps) => {
    const [newInvitations, setNewInvitations] = useState<Field[][]>([]);
    const [selectedRow, setSelectedRow] = useState<number | null>(null);

    const { data, setData, post } = useForm({
        invitations: {},
    });

    useEffect(() => {
        setData("invitations", serializeInvitations());
    }, [newInvitations]);

    const handleSubmit = () => {
        console.log("Enviando...");
    };

    const serializeInvitations = (): Record<string, any>[] => {
        return newInvitations.map((invitation) => {
            const result: Record<string, any> = {};

            result.name = invitation[0].value ?? "";
            result.email = invitation[1].value ?? "";
            result.additional_guests = invitation[2].value ?? "";

            result.metadata = invitation.slice(3).map((field) => ({
                key: field.key,
                value: field.value ?? "",
            }));

            return result;
        });
    };

    // const handleAddRow = () => {
    //     setNewInvitations((prev) => [...prev, [...config]]);
    // };

    const updateInvitationField = (
        rowIndex: number,
        fieldKey: string,
        newValue: string | number,
    ) => {
        setNewInvitations((prevInvitations) => {
            const updated = [...prevInvitations];

            updated[rowIndex] = updated[rowIndex].map((field) =>
                field.key === fieldKey ? { ...field, value: newValue } : field,
            );

            return updated;
        });
    };

    const removeInvitationRow = (rowIndex: number) => {
        setNewInvitations((prev) =>
            prev.filter((_, index) => index !== rowIndex),
        );
    };

    return (
        <div className="relative overflow-x-auto rounded-xl shadow-md">
            <h2 className="text-default-attribute font-semibold font-xl-regular mb-8">
                Añadir invitados manualmente
            </h2>
            <table className="w-full min-w-[600px] border-collapse table-auto border-spacing-0 whitespace-nowrap bg-transparent">
                <thead className="sticky top-0 z-10">
                    <tr>
                        {Object(event.config).map((field, index) => (
                            <th
                                key={crypto.randomUUID()}
                                className="px-4 py-3 text-left bg-default-info-import font-medium font-md-regular"
                            >
                                {field.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {newInvitations.map((invitation, rowIndex) => (
                        <tr
                            key={`row-${rowIndex}`}
                            onClick={() => setSelectedRow(rowIndex)}
                        >
                            {invitation.map((field) => (
                                <th
                                    key={`row-${rowIndex}-field-${field.key}`}
                                    className={
                                        rowIndex === selectedRow
                                            ? ""
                                            : "px-4 py-3 bg-default-info-import"
                                    }
                                >
                                    <Input
                                        type={field.fieldType}
                                        placeholder={field.placeholder}
                                        value={field.value ?? ""}
                                        onChange={(e) =>
                                            updateInvitationField(
                                                rowIndex,
                                                field.key,
                                                e.target.value,
                                            )
                                        }
                                        className="rounded border bg-white border-input-border px-2 py-1 "
                                    />
                                </th>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex justify-center gap-4 mt-4 mb-5">
                <SecondaryButton
                    className="rounded-lg"
                    onClick={() => removeInvitationRow(selectedRow)}
                >
                    Eliminar fila
                </SecondaryButton>
                <SecondaryButton
                    className="rounded-lg"
                    onClick={() => handleAddRow()}
                >
                    Añadir fila
                </SecondaryButton>
            </div>
            <div className="flex justify-end m-5 gap-4">
                <SecondaryButton onClick={onCancel} className="rounded-lg">
                    Cancelar
                </SecondaryButton>
                <PrimaryButton onClick={handleSubmit} className="rounded-lg">
                    Continuar
                </PrimaryButton>
            </div>
        </div>
    );
};
