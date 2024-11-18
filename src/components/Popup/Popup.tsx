import clsx from 'clsx';
import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

type PopupProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  rootClassName?: string;
}

export default function Popup({ open, onClose, children, className, rootClassName }: PopupProps) {
  const [isOpen, setIsOpen] = useState(open);
  const [isOpen2, setIsOpen2] = useState(open);

  useEffect(() => {
    if (open) {
      setIsOpen(true);
      setIsOpen2(true);
    } else {
      setIsOpen(false);
      setTimeout(() => setIsOpen2(false), 270);
    }
  }, [open]);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => setIsOpen2(false), 270);
    setTimeout(() => onClose(), 270);
  };

  if (!isOpen2) return null;

  return ReactDOM.createPortal(
    <div className={clsx('fixed inset-0 flex items-center justify-center px-4 py-safe-offset-4 h-full overflow-y-scroll z-[99999]', rootClassName)} onClick={handleClose}>
      <div className={clsx('absolute top-0 left-0 w-full h-full bg-black/60 backdrop-blur-sm z-[99999]', isOpen ? 'animate-fade-in' : 'animate-fade-out')} />
      <div className={clsx('max-w-[calc(100vw-2rem)] md:max-w-[450px] 2xl:max-w-[550px] max-h-[1200px] w-full z-[99999]', isOpen ? 'animate-scale-up' : 'animate-scale-down', className)} onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.body,
  );
}
