'use client';

import { useEffect } from 'react';

interface ModalProps {
  id: string;
  title: string;
  children: React.ReactNode;
  show: boolean;
  onClose: () => void;
  size?: 'sm' | 'lg' | 'xl';
}

export default function Modal({ id, title, children, show, onClose, size }: ModalProps) {
  useEffect(() => {
    if (show) {
      const modalElement = document.getElementById(id);
      if (modalElement) {
        const modal = new (window as any).bootstrap.Modal(modalElement);
        modal.show();
        
        modalElement.addEventListener('hidden.bs.modal', onClose);
        return () => {
          modalElement.removeEventListener('hidden.bs.modal', onClose);
        };
      }
    }
  }, [show, id, onClose]);

  const sizeClass = size ? `modal-${size}` : '';

  return (
    <div className="modal fade" id={id} tabIndex={-1} aria-labelledby={`${id}Label`} aria-hidden="true">
      <div className={`modal-dialog ${sizeClass}`}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id={`${id}Label`}>
              {title}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
