import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, type = 'info') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);

        // Auto-dismiss after 3 seconds
        setTimeout(() => {
            setToasts(prev => prev.filter(toast => toast.id !== id));
        }, 3000);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed top-4 right-4 z-50 space-y-2">
                {toasts.map(toast => (
                    <Toast
                        key={toast.id}
                        message={toast.message}
                        type={toast.type}
                        onClose={() => removeToast(toast.id)}
                    />
                ))}
            </div>
        </ToastContext.Provider>
    );
};

const Toast = ({ message, type, onClose }) => {
    const config = {
        success: {
            icon: CheckCircle,
            bgColor: 'bg-green-500/90',
            borderColor: 'border-green-400',
            textColor: 'text-white'
        },
        error: {
            icon: XCircle,
            bgColor: 'bg-red-500/90',
            borderColor: 'border-red-400',
            textColor: 'text-white'
        },
        info: {
            icon: Info,
            bgColor: 'bg-blue-500/90',
            borderColor: 'border-blue-400',
            textColor: 'text-white'
        }
    };

    const { icon: Icon, bgColor, borderColor, textColor } = config[type] || config.info;

    return (
        <div
            className={`${bgColor} ${borderColor} ${textColor} border-2 rounded-lg shadow-2xl backdrop-blur-sm p-4 min-w-[300px] max-w-md animate-slide-in-right flex items-center gap-3`}
            style={{
                animation: 'slideInRight 0.3s ease-out'
            }}
        >
            <Icon className="w-5 h-5 flex-shrink-0" />
            <p className="flex-1 font-medium">{message}</p>
            <button
                onClick={onClose}
                className="flex-shrink-0 hover:bg-white/20 rounded p-1 transition-colors"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};

export default ToastProvider;
