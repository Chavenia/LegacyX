import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';

// ─── Context ────────────────────────────────────────────────────────────────
const ToastContext = createContext(null);

const ICONS = {
  success: <CheckCircle2 className="w-4 h-4 text-carbon-green-50 shrink-0" />,
  error:   <XCircle      className="w-4 h-4 text-carbon-red-60 shrink-0" />,
  warning: <AlertTriangle className="w-4 h-4 text-carbon-yellow-30 shrink-0" />,
  info:    <Info          className="w-4 h-4 text-carbon-blue-60 shrink-0" />,
};

const BORDER = {
  success: 'border-carbon-green-50',
  error:   'border-carbon-red-60',
  warning: 'border-carbon-yellow-30',
  info:    'border-carbon-blue-60',
};

// ─── Provider ────────────────────────────────────────────────────────────────
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toast = useCallback(({ type = 'info', title, message, duration = 4500 }) => {
    const id = ++nextId.current;
    setToasts(prev => [...prev.slice(-4), { id, type, title, message }]);
    setTimeout(() => dismiss(id), duration);
    return id;
  }, [dismiss]);

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      {/* Toast Stack — bottom-right */}
      <div
        aria-live="polite"
        className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 items-end pointer-events-none"
        style={{ maxWidth: '22rem' }}
      >
        {toasts.map(t => (
          <div
            key={t.id}
            className={`pointer-events-auto w-full bg-carbon-90 border-l-4 ${BORDER[t.type]} shadow-carbon-lg flex items-start gap-3 p-4 text-xs font-sans animate-fadeIn`}
            style={{ animation: 'toastIn .2s ease-out' }}
          >
            {ICONS[t.type]}
            <div className="flex-1 min-w-0">
              {t.title && <div className="font-semibold text-white mb-0.5">{t.title}</div>}
              {t.message && <div className="text-carbon-30 leading-relaxed">{t.message}</div>}
            </div>
            <button
              onClick={() => dismiss(t.id)}
              className="text-carbon-50 hover:text-white transition cursor-pointer shrink-0 mt-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────────
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}
