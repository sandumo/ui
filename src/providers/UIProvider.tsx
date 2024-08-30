import { Toaster } from 'react-hot-toast';

export default function UIProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Toaster />
      {children}
    </>
  );
}
