import { StepComponentProps } from "@/types/step";
import { useEffect, useState } from "react";
import {
    ButtonSection,
    SecondaryButton,
} from "@/components/Button";
import StepNavigation from "../../StepNavigation";
import Attribute from "@/components/ConfigurationAttribute/Attribute";
import { Checkbox, Input } from "@heroui/react";
import Dates from "@/components/Date/Dates";
import dayjs from "dayjs";

export default function Invitation({
    formData,
    updateFormData,
    currentStep,
    isFirstStep,
    isLastStep,
    goToPrev,
    handleNext,
}: StepComponentProps) {
    const [sendDate, setSendDate] = useState<Date | null>(null);
    const [sendTime, setSendTime] = useState<Date | null>(null);
    const [scheduleLater, setScheduleLater] = useState(false);


    const getInitialDate = (dateString?: string) => {
        if (!dateString) return null;
        try {
            return new Date(dateString);
        } catch {
            return null;
        }
    };

    const [InvitationScheduleDate, setInvitationScheduleDate] = useState<Date | null>(getInitialDate(formData.dt_invitation_send));

    const isDateTimeComplete = InvitationScheduleDate !== null &&
        InvitationScheduleDate instanceof Date &&
        !isNaN(InvitationScheduleDate.getTime());

    const hasValidSchedule = scheduleLater || isDateTimeComplete;

    const isCheckboxDisabled = sendDate !== null && sendTime !== null;

    useEffect(() => {
        updateFormData({
            dt_invitation_send: InvitationScheduleDate
                ? dayjs(InvitationScheduleDate).format('YYYY-MM-DD HH:mm:ss')
                : null
        });
    }, [scheduleLater, InvitationScheduleDate]);

    return (
        <div className="max-w-7xl mx-auto px-6 py-10">
            <p className="text-justify mb-6 font-lg-regular">
                Hemos creado una{" "}
                <span className="text-primary font-semibold font-2xl-regular">
                    invitación para el evento
                </span>
                , utilizando la información de los invitados por defecto,
                recuerda que puedes{" "}
                <span className="text-primary font-semibold font-2xl-regular">
                    editar la invitación para el evento
                </span>
                , más tarde
            </p>

            <div className="bg-info-bg p-6 rounded-md font-sm-base leading-relaxed space-y-4">
                <p className="flex flex-wrap items-center gap-6 mb-8">
                    Enviar a <Attribute label="Correo" />
                </p>
                <p className="flex flex-wrap items-center gap-6 mb-8">
                    Estimado <Attribute label="Nombre del invitado" />, tenemos
                    el gusto de invitarlo a{" "}
                    <Attribute label="Nombre del evento" /> el día{" "}
                    <Attribute label="Fecha del evento" />.
                </p>
                <p className="flex flex-wrap items-center gap-6 mb-8">
                    Se llevará a cabo en <Attribute label="Lugar del evento" />{" "}
                    a las <Attribute label="Hora del evento" />.
                </p>
                <p className="flex flex-wrap items-center gap-6 mb-8">
                    Además cuentas con{" "}
                    <Attribute label="Número de acompañantes" /> boletos
                    adicionales.
                </p>
                <p>Favor de confirmar asistencia por este medio.</p>
            </div>

            <div>
                <ButtonSection className="mb-8">
                    <div className="flex flex-wrap gap-8 items-center mb-4">
                        <div className="flex-1 min-w-[325px] ">

                            <Dates
                                type="date"
                                id="invitation_schedule_date"
                                label="Programar fecha de envío de invitación"
                                value={InvitationScheduleDate}
                                onChange={(date) => {
                                    setInvitationScheduleDate(date || null);
                                }}
                                minDate={new Date()}
                                disabled={scheduleLater}
                            />
                        </div>
                        <div className="flex-1 min-w-[200px]">

                            <Dates
                                type="time"
                                id="invitation_schedule_date"
                                label="Programar hora de envío de invitación"
                                value={InvitationScheduleDate}
                                onChange={(time) => {
                                    if (time && InvitationScheduleDate) {
                                        const newDate = new Date(InvitationScheduleDate);
                                        newDate.setHours(time.getHours());
                                        newDate.setMinutes(time.getMinutes());
                                        setInvitationScheduleDate(newDate);
                                    }
                                }}
                                startDate={InvitationScheduleDate}
                                disabled={scheduleLater}
                            />

                        </div>

                        <div className="flex items-center gap-4 mt-8">
                            <Checkbox
                                isSelected={scheduleLater}
                                onValueChange={(val) => {
                                    if (!isCheckboxDisabled) {
                                        setScheduleLater(val);
                                    }
                                }}
                                isDisabled={isCheckboxDisabled}
                                radius="sm"
                                size="sm"
                                classNames={{
                                    base: "rounded-sm w-4 h-4",
                                    icon: "text-white",
                                }}
                            />
                            <label
                                className={`font-sm-base ${isCheckboxDisabled
                                    ? "text-gray-400"
                                    : "text-gray-700"
                                    }`}
                            >
                                Programar más tarde
                            </label>
                        </div>

                    </div>
                </ButtonSection>
            </div>

            <StepNavigation
                isFirstStep={isFirstStep}
                isLastStep={isLastStep}
                onBack={goToPrev}
                onNext={() => {
                    handleNext();
                }}
                currentStep={"Invitación"}
                hasValidField={hasValidSchedule}
            />
        </div>
    );
}
