import clsx from 'clsx';
import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

type PopupProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export default function Popup({ open, onClose, children, className }: PopupProps) {
  const [isOpen, setIsOpen] = useState(open);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => onClose(), 230);
  };

  if (!open) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 flex items-center justify-center px-4 py-safe-offset-4 h-full overflow-y-scroll" onClick={handleClose}>
      <div className={clsx('absolute top-0 left-0 w-full h-full bg-black/60', isOpen ? 'animate-fade-in' : 'animate-fade-out')} />
      <div className={clsx('max-w-[calc(100vw-2rem)] w-full z-10', isOpen ? 'animate-scale-up' : 'animate-scale-down', className)} onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.body,
  );
}
