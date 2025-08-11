import Dates from "@/components/Date/Dates";
import ImageUpload from "@/components/Image/ImageUpload";
import { Input } from "@heroui/react";
import { FormEvent, useState, useEffect } from "react";
import { MapWithSearch } from "@/components/utils/map-with-search";
import { combineDateTime } from "@/components/utils/format-time";
import { PrimaryButton, SecondaryButton } from "@/components/Button";
import { useForm } from "@inertiajs/react";
import { Event } from "@/types/entities/event";
import dayjs from 'dayjs';

interface LocationData {
    latitude: number;
    longitude: number;
    address: string;
    locationName: string;
}

interface InformationProps {
    event?: Event | null;
}

export default function Information({ event }: InformationProps) {
    const isEditMode = !!event;

    const parseBackendDate = (dateString: string | null | undefined): Date | null => {
        if (!dateString) return null;
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? null : date;
    };

    const initialStart = parseBackendDate(event?.start_time);
    const initialEnd = parseBackendDate(event?.end_time);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: event?.name || "",
        description: event?.description || '',
        capacity: event?.capacity || 1,
        image: null as File | null,
        location: event?.location || "por definir",
        address: event?.address || "por definir",
        latitude: event?.latitude || "12345",
        longitude: event?.longitude || "12345",
        start_time: initialStart,
        end_time: initialEnd,
    });

    const [startDate, setStartDate] = useState<Date | null>(initialStart);
    const [startTime, setStartTime] = useState<Date | null>(initialStart);
    const [endDate, setEndDate] = useState<Date | null>(initialEnd);
    const [endTime, setEndTime] = useState<Date | null>(initialEnd);

    useEffect(() => {
        if (event) {
            const start = parseBackendDate(event.start_time);
            const end = parseBackendDate(event.end_time);

            setStartDate(start);
            setStartTime(start);
            setEndDate(end);
            setEndTime(end);

            reset();
            setData({
                name: event.name,
                description: event.description ?? "",
                capacity: event.capacity,
                location: event.location,
                address: event.address,
                latitude: event.latitude,
                longitude: event.longitude,
                start_time: start,
                end_time: end,
                image: null,
            });
        }
    }, [event]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (isEditMode && event?.uri_event) {
            post(route("events.update", event.uri_event), {
                onError: (errors) => {
                    console.error("Error al actualizar el evento:", errors);
                },
                forceFormData: true,
            });
        } else {
            post(route("events.store"), {
                onError: (errors) => {
                    console.error("Error al crear el evento:", errors);
                },
                forceFormData: true,
            });
        }
    };

    const handleLocationChange = (location: LocationData) => {
        setData({
            ...data,
            location: location.locationName,
            address: location.address,
            latitude: String(location.latitude),
            longitude: String(location.longitude),
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white">
                <div className="space-y-5">
                    <div className="bg-info-bg rounded-2xl px-8 py-8">
                        <div className="pb-8">
                            <label className="block font-md-base mb-2">
                                Nombre
                            </label>
                            <Input
                                type="text"
                                placeholder="Ingrese el nombre del evento"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                className="block w-full rounded-sm bg-white border border-input-border"
                            />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                        </div>

                        <div className="pb-8">
                            <label className="block font-md-base mb-2">
                                Descripción
                            </label>
                            <textarea
                                className="block w-full rounded-sm bg-white border border-input-border min-h-[160px] max-h-[160px] px-4 py-2 resize-none"
                                placeholder="Escribe la descripción"
                                rows={10}
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                            />
                            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                        </div>

                        <div>
                            <label className="block font-md-base mb-2">
                                Aforo
                            </label>
                            <Input
                                className="block w-full rounded-sm bg-white border border-input-border"
                                placeholder="Ingrese aforo del lugar"
                                type="number"
                                min={0}
                                value={data.capacity.toString()}
                                onChange={e => setData('capacity', Number(e.target.value))}
                            />
                            {errors.capacity && <p className="text-red-500 text-sm mt-1">{errors.capacity}</p>}
                        </div>
                    </div>

                    <div className="bg-info-bg rounded-2xl px-8 py-8">
                        <ImageUpload
                            initialFileName={data.image ? data.image.name : ""}
                            onImageChange={(file) => setData('image', file)}
                        />
                        {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
                    </div>
                </div>
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4 bg-info-bg rounded-2xl px-8 py-8">
                        <Dates
                            type="date"
                            id="initial"
                            label="Fecha de inicio"
                            value={startDate}
                            onChange={(date) => {
                                setStartDate(date);
                                const newDateTime = combineDateTime(date, startTime);
                                setData('start_time', newDateTime);
                            }}
                            minDate={new Date()}
                        />
                        <Dates
                            type="time"
                            id="initial"
                            label="Hora de inicio"
                            value={startTime}
                            onChange={(time) => {
                                setStartTime(time);
                                const newDateTime = combineDateTime(startDate, time);
                                setData('start_time', newDateTime);
                            }}
                        />

                        <Dates
                            type="date"
                            id="end"
                            label="Fecha de fin"
                            value={endDate}
                            onChange={(date) => {
                                setEndDate(date);
                                const newDateTime = combineDateTime(date, endTime);
                                setData('end_time', newDateTime);
                            }}
                            minDate={startDate || new Date()}
                        />
                        <Dates
                            type="time"
                            id="end"
                            label="Hora de fin"
                            value={endTime}
                            onChange={(time) => {
                                setEndTime(time);
                                const newDateTime = combineDateTime(endDate, time);
                                setData('end_time', newDateTime);
                            }}
                        />
                        {(errors.start_time || errors.end_time) && (
                            <p className="text-red-500 text-sm col-span-2">
                                {errors.start_time || errors.end_time}
                            </p>
                        )}
                    </div>

                    <div className="bg-info-bg rounded-2xl px-8 py-8">
                        <label className="block font-md-base mb-2">
                            Ubicación
                        </label>
                        <div className="relative mb-2">
                            <MapWithSearch
                                onLocationChange={handleLocationChange}
                                initialLocation={
                                    data.latitude && data.longitude
                                        ? {
                                            latitude: parseFloat(data.latitude),
                                            longitude: parseFloat(data.longitude),
                                            address: data.address,
                                            locationName: data.location
                                        }
                                        : undefined
                                }
                            />
                        </div>
                        {(errors.location || errors.address || errors.latitude || errors.longitude) && (
                            <p className="text-red-500 text-sm">
                                {errors.location || errors.address || errors.latitude || errors.longitude}
                            </p>
                        )}
                    </div>
                    <div className="flex w-full gap-2">
                        <SecondaryButton
                            className="w-1/2"
                            type="button"
                            href={route('events.index')}
                        >
                            Cancelar
                        </SecondaryButton>
                        <PrimaryButton
                            className="w-1/2"
                            disabled={processing}
                            type="submit"
                        >
                            {processing
                                ? 'Enviando...'
                                : isEditMode
                                    ? 'Actualizar Evento'
                                    : 'Crear Evento'}
                        </PrimaryButton>
                    </div>
                </div>
            </div>
        </form>
    );
}