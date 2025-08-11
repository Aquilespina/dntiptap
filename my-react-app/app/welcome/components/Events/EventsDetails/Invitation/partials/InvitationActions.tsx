import { PrimaryButton, SecondaryButton } from "@/components/Button";
import { Dispatch, SetStateAction } from "react";

type LocalStatus = "not_scheduled" | "scheduled" | "editing" | "sent";

interface InvitationActionsProps {
    localStatus: LocalStatus;
    setLocalStatus: Dispatch<SetStateAction<LocalStatus>>;
    isDirty: boolean;
}

export default function InvitationActions({
    localStatus,
    setLocalStatus,
    isDirty,
}: InvitationActionsProps) {
    const handleSchedule = () => setLocalStatus("scheduled");

    return (
        <div className="flex justify-end gap-4 mt-4">
            <SecondaryButton className="px-4 py-2 rounded-sm">
                Previsualizar
            </SecondaryButton>

            {localStatus === "not_scheduled" && (
                <PrimaryButton
                    className="px-4 py-2 rounded-sm"
                    onClick={handleSchedule}
                >
                    Programar envío
                </PrimaryButton>
            )}

            {localStatus === "editing" && isDirty && (
                <PrimaryButton
                    className="px-4 py-2 rounded-sm"
                    onClick={handleSchedule}
                >
                    Guardar cambios
                </PrimaryButton>
            )}
        </div>
    );
}
