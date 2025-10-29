import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './Theme/ThemeProvider';
import { DeepPartialTheme } from './Theme/theme';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV2';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

type UIProviderProps = {
  children: React.ReactNode;
  theme?: DeepPartialTheme;
}

export default function UIProvider({ children, theme }: UIProviderProps) {
  return (
    <>
      <Toaster />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <ThemeProvider theme={theme}>
          {children}
        </ThemeProvider>
      </LocalizationProvider>
    </>
  );
}
