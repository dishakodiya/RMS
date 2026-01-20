'use client';

import { useEffect } from 'react';

interface ToastProps {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  show: boolean;
  onClose: () => void;
}

export default function Toast({ id, message, type, show, onClose }: ToastProps) {
  useEffect(() => {
    if (show) {
      const toastElement = document.getElementById(id);
      if (toastElement) {
        const toast = new (window as any).bootstrap.Toast(toastElement);
        toast.show();
        
        toastElement.addEventListener('hidden.bs.toast', onClose);
        return () => {
          toastElement.removeEventListener('hidden.bs.toast', onClose);
        };
      }
    }
  }, [show, id, onClose]);

  const bgColor = {
    success: 'bg-success',
    error: 'bg-danger',
    info: 'bg-info',
    warning: 'bg-warning'
  }[type];

  const icon = {
    success: 'bi-check-circle',
    error: 'bi-x-circle',
    info: 'bi-info-circle',
    warning: 'bi-exclamation-triangle'
  }[type];

  return (
    <div
      className={`toast ${bgColor} text-white`}
      id={id}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 9999 }}
    >
      <div className="toast-header">
        <i className={`bi ${icon} me-2`}></i>
        <strong className="me-auto">Notification</strong>
        <button
          type="button"
          className="btn-close btn-close-white"
          data-bs-dismiss="toast"
          aria-label="Close"
        ></button>
      </div>
      <div className="toast-body">
        {message}
      </div>
    </div>
  );
}
