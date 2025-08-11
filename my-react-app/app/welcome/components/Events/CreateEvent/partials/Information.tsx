import Dates from "@/components/Date/Dates";
import ImageUpload from "@/components/Image/ImageUpload";
import { StepComponentProps } from "@/types/step";
import { Input } from "@heroui/react";
import StepNavigation from "../../StepNavigation";
import { useState } from "react";
import { MapWithSearch } from "@/components/utils/map-with-search";

export default function Information({
    formData,
    updateFormData,
    currentStep,
    isFirstStep,
    isLastStep,
    goToPrev,
    handleNext,
}: StepComponentProps) {


    const handleUpdate = (
        field: string,
        value: string | number | File | null,
    ) => {
        updateFormData({ [field]: value });
    };
    const getInitialDate = (dateString?: string) => {
        if (!dateString) return null;
        try {
            return new Date(dateString);
        } catch {
            return null;
        }
    };
    const [startDate, setStartDate] = useState<Date | null>(getInitialDate(formData.start_time));
    const [endDate, setEndDate] = useState<Date | null>(getInitialDate(formData.end_time));

    const handleImageChange = (file: File | null, imageUrl: string | null) => {
        updateFormData({
            image: file,
            imageUrl: imageUrl
        });
    };

    return (
        <>
            <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white">
                <div className="space-y-5">
                    <div className="bg-info-bg rounded-2xl px-8 py-8">
                        <div className="pb-8">
                            <label className="block font-md-base mb-2">
                                Nombre
                            </label>
                            <Input
                                type="text"
                                value={formData.name}
                                placeholder="Ingrese el nombre del evento"
                                onChange={(e) =>
                                    handleUpdate("name", e.target.value)
                                }
                                className="block w-full rounded-sm bg-white border border-input-border"
                            />
                        </div>

                        <div className="pb-8">
                            <label className="block font-md-base mb-2">
                                Descripción
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) =>
                                    handleUpdate("description", e.target.value)
                                }
                                className="block w-full rounded-sm bg-white border border-input-border min-h-[160px] max-h-[160px] px-4 py-2 resize-none"
                                placeholder="Escribe la descripción"
                                rows={10}
                            />
                        </div>

                        <div>
                            <label className="block font-md-base mb-2">
                                Aforo
                            </label>
                            <Input
                                className="block w-full rounded-sm bg-white border border-input-border"
                                placeholder="Ingrese aforo del lugar"
                                type="number"
                                value={formData.capacity}
                                min={1}
                                onChange={(e) =>
                                    handleUpdate("capacity", parseInt(e.target.value))
                                }
                            />
                        </div>
                    </div>

                    <div className="bg-info-bg rounded-2xl px-8 py-8">
                        <ImageUpload
                            onImageChange={handleImageChange}
                            initialImageUrl={formData.imageUrl}
                            initialFileName={formData.image ? formData.image.name : ""}
                        />
                    </div>
                </div>
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4 bg-info-bg rounded-2xl px-8 py-8 w-">
                        <Dates
                            type="date"
                            id="initial"
                            label="Fecha de inicio"
                            value={startDate}
                            onChange={(date) => {
                                setStartDate(date || null);
                            }}
                            minDate={new Date()}
                        />
                        <Dates
                            type="time"
                            id="initial"
                            label="Hora de inicio"
                            value={startDate}
                            onChange={(time) => {
                                if (time && startDate) {
                                    const newDate = new Date(startDate);
                                    newDate.setHours(time.getHours());
                                    newDate.setMinutes(time.getMinutes());
                                    setStartDate(newDate);
                                }
                            }}
                        />

                        <Dates
                            type="date"
                            id="end"
                            label="Fecha de fin"
                            value={endDate}
                            onChange={
                                (date) => {
                                    setEndDate(date || null);
                                }
                            }
                        />
                        <Dates
                            type="time"
                            id="end"
                            label="Hora de fin"
                            value={endDate}
                            onChange={
                                (time) => {
                                    if (time && endDate) {
                                        const newDate = new Date(endDate);
                                        newDate.setHours(time.getHours());
                                        newDate.setMinutes(time.getMinutes());
                                        setEndDate(newDate);
                                    }
                                }
                            }
                        />
                    </div>

                    <div className="bg-info-bg rounded-2xl px-8 py-8">
                        <label className="block font-md-base mb-2">
                            Ubicación
                        </label>
                        <div className="relative mb-2">
                            <MapWithSearch handleChange={handleUpdate}/>
                        </div>

                    </div>
                    <StepNavigation
                        isFirstStep={true}
                        isLastStep={false}
                        currentStep="Información"
                        onBack={goToPrev}
                        onNext={() => {
                            if (startDate) {
                                handleUpdate("start_time", startDate.toISOString());

                            }
                            if (endDate) {
                                handleUpdate("end_time", endDate.toISOString());
                            }
                            handleNext();
                        }}
                    />
                </div>
            </div>
        </>
    );
}
