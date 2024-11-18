import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './Theme/ThemeProvider';
import { DeepPartialTheme } from './Theme/theme';

type UIProviderProps = {
  children: React.ReactNode;
  theme?: DeepPartialTheme;
}

export default function UIProvider({ children, theme }: UIProviderProps) {
  return (
    <>
      <Toaster />
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </>
  );
}
