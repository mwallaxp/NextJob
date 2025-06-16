import React, { createContext, useContext, useState } from "react";
import Toast from "./Toast";

const ToastContext = createContext();

export const useToast = () => {
  return useContext(ToastContext);
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts([...toasts, { id, message, type }]);

    setTimeout(() => {
      setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id));
    }, 3000); // Remove toast after 3 seconds
  };

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div className="fixed top-0 right-0 z-50 space-y-2">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() =>
              setToasts((currentToasts) =>
                currentToasts.filter((t) => t.id !== toast.id)
              )
            }
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};
export default ToastProvider;