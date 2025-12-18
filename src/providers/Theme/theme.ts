export type Color = 'default' | 'primary' | 'secondary' | 'success' | 'error';

export type ThemeComponentSize = {
  xs: string,
  sm: string,
  md: string,
  lg: string,
  xl: string,
}

export type Theme = {
  components: {
    Button: {
      wrapper: string,
      root: string,
      variant: {
        default: Partial<Record<Color, string>>,
        outline: Partial<Record<Color, string>>,
        text: Partial<Record<Color, string>>,
      },
      color: {
        default: string,
        primary: string,
        secondary: string,
        success: string,
        error: string,
      },
      size: {
        xs: string,
        sm: string,
        md: string,
        lg: string,
        xl: string,
      },
      text: {
        xs: string,
        sm: string,
        md: string,
        lg: string,
        xl: string,
      },
      icon: {
        xs: string,
        sm: string,
        md: string,
        lg: string,
        xl: string,
      },
    },

    SegmentedButton: {
      size: ThemeComponentSize;
      text: ThemeComponentSize;
    }
  },
}

export type DeepPartial<T> = T extends object ? {
  [P in keyof T]?: DeepPartial<T[P]>;
} : T;

export type DeepPartialTheme = DeepPartial<Theme>;

export const theme: Theme = {
  components: {
    Button: {
      wrapper: 'rounded-md font-semibold duration-75 overflow-hidden block relative',
      root: 'flex justify-center items-center gap-1 w-full h-full',
      variant: {
        default: {
          default: '',
          primary: 'bg-primary text-white hover:bg-primary-dark',
          secondary: 'bg-purple-500 hover:bg-purple-500/80 text-white',
          success: 'bg-green-100 text-green-600 border-[.5px] border-green-300',
          error: 'bg-red-600 text-white',
        },
        text: {
          default: '',
          primary: 'text-primary',
          secondary: 'text-purple-500',
          success: 'text-green-600',
          error: 'text-red-600',
        },
        outline: {
          default: 'border border-divider',
          primary: 'text-primary border border-primary hover:bg-primary/10',
          secondary: 'bg-purple-500 hover:bg-purple-500/80 text-white',
          success: 'bg-green-100 text-green-600 border-[.5px] border-green-300',
          error: 'text-red-600 border border-red-600 hover:bg-red-600/10',
        },
      },
      color: {
        default: '',
        primary: 'bg-primary text-white',
        secondary: 'bg-purple-500 hover:bg-purple-500/80 text-white',
        success: 'bg-green-100 text-green-600 border-[.5px] border-green-300',
        error: 'bg-red-600 text-white',
      },
      size: {
        xs: 'px-2 h-8 sm:h-7',
        sm: 'px-3 h-10 sm:h-9',
        md: 'px-6 h-12 sm:h-11',
        lg: '',
        xl: '',
      },
      text: {
        xs: 'text-xs',
        sm: 'text-sm',
        md: 'text-md',
        lg: 'text-lg',
        xl: 'text-xl',
      },
      icon: {
        xs: '*:!text-md',
        sm: '*:!text-lg',
        md: '*:!text-xl',
        lg: '*:!text-2xl',
        xl: '*:!text-3xl',
      },
    },

    SegmentedButton: {
      size: {
        xs: '',
        sm: 'h-8',
        md: 'h-[42px]', // match inputs height
        lg: '',
        xl: '',
      },
      text: {
        xs: 'text-xs',
        sm: 'text-sm',
        md: 'text-md',
        lg: 'text-lg',
        xl: 'text-xl',
      },
    },
  },
};
