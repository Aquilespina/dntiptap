import { Button } from "@heroui/react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import ImageViewer from "./ImageViewer";

interface ImageUploadProps {
    onImageChange: (file: File | null, imageUrl: string | null) => void;
    initialImageUrl?: string | null;
    initialFileName?: string; // Nueva prop para el nombre del archivo inicial
}

export default function ImageUpload({ 
    onImageChange, 
    initialImageUrl, 
    initialFileName 
}: ImageUploadProps) {
    const [imageUrl, setImageUrl] = useState<string | null>(initialImageUrl || null);
    const [fileName, setFileName] = useState<string>(initialFileName || "Seleccionar archivo");
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (initialImageUrl && !initialFileName) {
            setFileName("imagen-cargada.jpg");
        }
    }, [initialImageUrl, initialFileName]);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setImageUrl(url);
            setFileName(
                file.name.length > 25
                    ? file.name.slice(0, 25) + "..."
                    : file.name,
            );
            onImageChange(file, url);
        } else {
            setFileName(initialFileName || "Seleccionar archivo");
            setImageUrl(initialImageUrl || null);
            onImageChange(null, initialImageUrl || null);
        }
    };

    const handleRemoveImage = () => {
        setImageUrl(null);
        setFileName("Seleccionar archivo");
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        onImageChange(null, null);
    };

    return (
        <>
            <label className="block font-md-base mb-2">Imagen*</label>
            <div className="flex items-start mt-2">
                <div className="flex flex-col w-95">
                    <div className="flex items-center overflow-hidden rounded-sm bg-white border border-input-border w-95">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                        />
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="flex-1 px-3 py-2 text-sm text-gray-500 truncate cursor-pointer"
                            title={fileName}
                        >
                            {fileName}
                        </div>
                        <Button
                            type="button"
                            onPress={() => fileInputRef.current?.click()}
                            className="bg-primary px-3 py-2 hover:bg-primary/90 transition text-white"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M12 3v12" />
                                <path d="m17 8-5-5-5 5" />
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            </svg>
                        </Button>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                        *Se utilizará en la invitación y en los correos enviados
                        a los invitados posteriormente.
                    </p>
                </div>
                <ImageViewer imageUrl={imageUrl} onRemove={handleRemoveImage} />
            </div>
        </>
    );
}