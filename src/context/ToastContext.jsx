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

        // Auto-dismiss after 4 seconds
        setTimeout(() => {
            setToasts(prev => prev.filter(toast => toast.id !== id));
        }, 4000);
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
            bgColor: 'from-green-600 to-green-700',
            iconColor: 'text-white'
        },
        error: {
            icon: XCircle,
            bgColor: 'from-red-600 to-red-700',
            iconColor: 'text-white'
        },
        info: {
            icon: Info,
            bgColor: 'from-cyan-600 to-blue-600',
            iconColor: 'text-white'
        }
    };

    const { icon: Icon, bgColor, iconColor } = config[type] || config.info;

    return (
        <div
            className={`bg-gradient-to-r ${bgColor} text-white rounded-xl shadow-2xl backdrop-blur-sm p-4 min-w-[320px] max-w-md border border-white/20 flex items-start gap-3 animate-slide-in-left`}
            style={{
                animation: 'slideInLeft 0.3s ease-out'
            }}
        >
            <div className={`${iconColor} mt-0.5`}>
                <Icon className="w-5 h-5 flex-shrink-0" />
            </div>
            <p className="flex-1 font-medium text-sm leading-relaxed">{message}</p>
            <button
                onClick={onClose}
                className="flex-shrink-0 hover:bg-white/20 rounded-lg p-1.5 transition-colors"
                aria-label="Close notification"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};

export default ToastProvider;
