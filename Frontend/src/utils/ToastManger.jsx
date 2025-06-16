// ToastManager.jsx
import React, { useState } from 'react';
import Toast from './Toast';

const ToastManager = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Math.random();
    setToasts([...toasts, { id, message, type }]);

    // Auto-remove toast after 3 seconds
    setTimeout(() => removeToast(id), 3000);
  };

  const removeToast = (id) => {
    setToasts(toasts.filter((toast) => toast.id !== id));
  };

  return (
    <div>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
      <button
        className="mt-5 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => addToast('This is a success message!', 'success')}
      >
        Show Success Toast
      </button>
    </div>
  );
};

export default ToastManager;
