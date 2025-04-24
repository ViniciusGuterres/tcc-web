import { useEffect, useRef } from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    body: React.ReactNode;
}

const Modal = ({ isOpen, onClose, body }: ModalProps) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleOutsideClick);
        }

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
        >
            <div
                ref={modalRef}
                className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 p-6 relative"
                style={{ maxHeight: '90%', overflowY: 'auto' }}
            >
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
                    aria-label="Fechar modal"
                >
                    ×
                </button>

                <div>
                    {body}
                </div>
            </div>
        </div>
    );
};

export default Modal;
