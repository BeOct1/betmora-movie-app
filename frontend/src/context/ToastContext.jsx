import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({ open: false, message: '', type: 'info' });
  const showToast = useCallback((message, type = 'info') => {
    setToast({ open: true, message, type });
    setTimeout(() => setToast(t => ({ ...t, open: false })), 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast.open && (
        <div className={`custom-toast custom-toast-${toast.type}`}>{toast.message}</div>
      )}
    </ToastContext.Provider>
  );
};
