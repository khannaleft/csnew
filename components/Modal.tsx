import React, { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 z-50 flex justify-center items-center p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white/80 dark:bg-slate-800/70 border border-slate-300/70 dark:border-white/10 backdrop-blur-2xl rounded-4xl shadow-2xl w-full max-w-lg relative" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-5 border-b border-slate-200 dark:border-white/10">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">{title}</h2>
          <button onClick={onClose} className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/10 dark:hover:bg-white/10">
            &#x2715;
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;