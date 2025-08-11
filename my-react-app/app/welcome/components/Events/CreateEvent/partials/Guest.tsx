import { useRef, useState, useEffect } from "react";
import { StepComponentProps } from "@/types/step";
import StepNavigation from "../../StepNavigation";
import { PrimaryButton, SecondaryButton } from "@/components/Button";
import InviteTable from "@/components/GuestTable/InviteTable";
import InviteTableImport from "@/components/GuestTable/InviteTableImport";

type Guest = {
    name: string;
    email: string;
    additional_guests: number | string;
    metadata?: Array<{ key: string; value: string }> | null;
};

const emptyGuest = {
    name: "",
    email: "",
    additional_guests: 0,
    metadata: null,
};

export default function Guest({
    formData,
    updateFormData,
    currentStep,
    isFirstStep,
    isLastStep,
    goToPrev,
    handleNext,
}: StepComponentProps) {
    const [inviteMethod, setInviteMethod] = useState<
        "none" | "manual" | "excel"
    >("none");
    const [guests, setGuests] = useState<Guest[]>([]);
    const [isValid, setIsValid] = useState(false);
    const [selectedGuestIndex, setSelectedGuestIndex] = useState<number | null>(
        null,
    );
    const [excelUploadValid, setExcelUploadValid] = useState(false);
    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        let valid = false;

        if (inviteMethod === "manual") {
            valid =
                guests.length > 0 &&
                guests.every((g) => {
                    const name = String(g.name ?? "").trim();
                    const email = String(g.email ?? "").trim();
                    const additional_guests = Number(g.additional_guests ?? 0);

                    return (
                        name.length > 0 &&
                        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
                        !isNaN(additional_guests) &&
                        additional_guests >= 0
                    );
                });
        } else if (inviteMethod === "excel") {
            valid = excelUploadValid;
        }

        setIsValid(valid);
    }, [guests, inviteMethod, excelUploadValid]);

    const handleAddRow = () => {
        setGuests([...guests, emptyGuest]);
    };

    const handleContinueWithoutAdding = () => {
        updateFormData({ invitations: null });
        handleNext();
    };

    const handleRemoveRow = () => {
        if (guests.length === 0 || selectedGuestIndex === null) return;

        const updatedGuests = [...guests];
        updatedGuests.splice(selectedGuestIndex, 1);
        setGuests(updatedGuests);

        if (updatedGuests.length === 0) {
            setSelectedGuestIndex(null);
        } else if (selectedGuestIndex >= updatedGuests.length) {
            setSelectedGuestIndex(updatedGuests.length - 1);
        } else {
            setSelectedGuestIndex(selectedGuestIndex);
        }
    };
    const normalizedInvitations = guests.map((guest) => ({
        email: guest.email,
        name: guest.name.trim() || undefined,
        additional_guests: Number(guest.additional_guests) || undefined,
        metadata:
            guest.metadata && guest.metadata.length > 0
                ? guest.metadata.map(({ key, value }) => ({
                      key: key,
                      value: value || null,
                  }))
                : null,
    }));

    const handleNextStep = () => {
        updateFormData({
            ...formData,
            invitations: normalizedInvitations,
            inviteMethod,
            file: inviteMethod === "excel" ? file : null,
        });
        handleNext();
    };

    useEffect(() => {
        updateFormData({ invitations: normalizedInvitations });
    }, [guests]);

    useEffect(() => {
        if (inviteMethod === "excel" && file) {
            updateFormData({ file: file });
        } else {
            updateFormData({ file: null });
        }
    }, [inviteMethod, file]);
    return (
        <div className="max-w-7xl mx-auto px-6 py-10">
            <div className="space-y-6">
                <p className="text-primary font-semibold font-lg-regular text-center">
                    ¿A quiénes enviaremos la invitación?
                    <span className="text-gray-600">
                        , recuerda que puedes añadir invitados más tarde.
                    </span>
                </p>

                <div className="flex flex-wrap gap-4 justify-center">
                    <span className="font-semibold font-lg-regular">
                        Puedes
                    </span>

                    <PrimaryButton
                        disabled={inviteMethod === "excel"}
                        className={`font-md-regular rounded-lg w-full sm:w-auto sm:min-w-[200px] ${
                            inviteMethod === "excel"
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                        }`}
                        onClick={() => {
                            setInviteMethod("manual");
                            setGuests([
                                { name: "", email: "", additional_guests: 0 },
                            ]);
                        }}
                    >
                        Añadir invitados manualmente
                    </PrimaryButton>

                    <span className="font-semibold font-lg-regular">ó</span>

                    <SecondaryButton
                        disabled={inviteMethod === "manual"}
                        className={`font-md-regular rounded-lg w-full sm:w-auto sm:min-w-[200px] ${
                            inviteMethod === "manual"
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                        }`}
                        onClick={() => {
                            setInviteMethod("excel");
                            setGuests([]);
                        }}
                    >
                        Importar archivo Excel
                    </SecondaryButton>
                </div>

                <div className="bg-info-bg rounded-lg px-6 py-10 text-sm mb-8 transition-all duration-300">
                    {inviteMethod === "manual" && (
                        <>
                            <div className="flex justify-center">
                                <div className="w-full max-w-full">
                                    <InviteTable
                                        guests={guests}
                                        setGuests={setGuests}
                                        isEditable={true}
                                        customFields={formData.customFields}
                                        selectedGuestIndex={selectedGuestIndex}
                                        setSelectedGuestIndex={
                                            setSelectedGuestIndex
                                        }
                                    />
                                </div>
                            </div>
                            <div className="mt-4">
                                <div className="flex justify-end gap-4">
                                    <SecondaryButton
                                        onClick={handleRemoveRow}
                                        className="gap-2 font-md-regular rounded-lg"
                                        disabled={guests.length === 1}
                                    >
                                        Eliminar fila
                                    </SecondaryButton>

                                    <SecondaryButton
                                        onClick={handleAddRow}
                                        className="gap-2 font-md-regular rounded-lg"
                                    >
                                        Añadir fila
                                    </SecondaryButton>
                                </div>
                            </div>
                        </>
                    )}
                    {inviteMethod === "excel" && (
                        <InviteTableImport
                            onValidUpload={setExcelUploadValid}
                            onFileUploaded={setFile}
                        />
                    )}
                    {inviteMethod === "none" && (
                        <p className="text-sm text-gray-500 italic text-right">
                            Podrás añadir más invitados más adelante
                        </p>
                    )}
                </div>
            </div>

            <StepNavigation
                isFirstStep={false}
                isLastStep={true}
                currentStep="Invitados"
                onBack={goToPrev}
                onNext={handleNextStep}
                isFormEnabled={inviteMethod !== "none"}
                hasValidField={isValid}
                onContinueWithoutAdding={handleContinueWithoutAdding}
            />
        </div>
    );
}
