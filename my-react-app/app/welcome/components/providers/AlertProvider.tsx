import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Alert } from '@heroui/react';

type AlertType = 'success' | 'error';

interface AlertMessage {
    id: string;
    type: AlertType;
    title: string;
    message: string;
    timeout?: number;
}

interface AlertContextType {
    showAlert: (type: AlertType, title: string, message: string, timeout?: number) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

interface AlertProviderProps {
    children: React.ReactNode;
    props?: {
        success?: string | null;
        error?: string | null;
    };
}

export const AlertProvider: React.FC<AlertProviderProps> = ({ children, props }) => {
    const [alerts, setAlerts] = useState<AlertMessage[]>([]);

    const showAlert = useCallback(
        (type: AlertType, title: string, message: string, timeout = 5000) => {
            const id = Date.now().toString();
            const newAlert: AlertMessage = { id, type, title, message, timeout };

            setAlerts((prev) => [...prev, newAlert]);

            if (timeout > 0) {
                setTimeout(() => {
                    removeAlert(id);
                }, timeout);
            }
        },
        []
    );

    const alertColors = {
        success: "bg-green-100",
        error: "bg-red-100",
    };

    const removeAlert = useCallback((id: string) => {
        setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    }, []);

    useEffect(() => {
        if (props?.success) {
            showAlert('success', 'Éxito', props.success);
        }
        if (props?.error) {
            showAlert('error', 'Error', props.error);
        }
    }, [props, showAlert]);

    return (
        <AlertContext.Provider value={{ showAlert }}>
            {children}
            <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4">
                {alerts.map((alert) => (
                    <Alert
                        key={alert.id}
                        classNames={{
                            base: alertColors[alert.type],
                        }}
                        title={alert.title}
                        description={alert.message}
                        variant="solid"
                        isVisible={true}
                        onClose={() => removeAlert(alert.id)}
                    />
                ))}
            </div>
        </AlertContext.Provider>
    );
};

export const useAlert = () => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error('useAlert must be used within an AlertProvider');
    }
    return context;
};