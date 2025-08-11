import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    useDisclosure,
} from "@heroui/react";

export default function ImageViewer({ imageUrl, onRemove }: { imageUrl: string | null, onRemove: () => void }) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    return (
        <>
            <div className="relative w-24 h-24 bg-gray-100 rounded flex items-center justify-center cursor-pointer hover:shadow-md transition ml-6">
                {imageUrl ? (
                    <>
                        <button
                            className="w-full h-full flex items-center justify-center"
                            onClick={() => onOpen()}
                        >
                            <img
                                src={imageUrl}
                                alt="Imagen seleccionada"
                                className="object-cover w-full h-full rounded"
                            />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onRemove();
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                            aria-label="Eliminar imagen"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                    </>
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 520 520"
                            className="w-10 h-10 text-gray-400"
                            fill="currentColor"
                        >
                            <path d="M448 80c8.8 0 16 7.2 16 16l0 319.8-5-6.5-136-176c-4.5-5.9-11.6-9.3-19-9.3s-14.4 3.4-19 9.3L202 340.7l-30.5-42.7C167 291.7 159.8 288 152 288s-15 3.7-19.5 10.1l-80 112L48 416.3l0-.3L48 96c0-8.8 7.2-16 16-16l384 0zM64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32zm80 192a48 48 0 1 0 0-96 48 48 0 1 0 0 96z" />
                        </svg>
                    </div>
                )}
            </div>

            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                size={"5xl"}
                classNames={{
                    backdrop: "bg-black/70 backdrop-blur-md",
                }}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalBody>
                                <img
                                    src={imageUrl ?? ""}
                                    alt="Imagen completa"
                                    className="mt-2 max-w-full max-h-[80vh] object-contain rounded"
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="danger"
                                    onPress={() => {
                                        onRemove();
                                        onClose();
                                    }}
                                >
                                    Eliminar Imagen
                                </Button>
                                <Button onPress={onClose}>Cerrar</Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
