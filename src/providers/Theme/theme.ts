export type Theme = {
  components: {
    Button: {
      wrapper: string,
      root: string,
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
  },
}

export type DeepPartial<T> = T extends object ? {
  [P in keyof T]?: DeepPartial<T[P]>;
} : T;

export type DeepPartialTheme = DeepPartial<Theme>;

export const theme: Theme = {
  components: {
    Button: {
      wrapper: 'rounded-md font-semibold duration-75 overflow-hidden inline-flex relative',
      root: 'flex items-center gap-1 hover:bg-black/10 w-full flex justify-center items-center',
      color: {
        default: 'hover:bg-black/10',
        primary: 'bg-primary-dark text-white',
        secondary: 'bg-purple-500 hover:bg-purple-500/80 text-white',
        success: 'bg-green-100 text-green-600 border-[.5px] border-green-300',
        error: 'bg-red-600 text-white',
      },
      size: {
        xs: '',
        sm: 'px-3 py-1',
        md: 'px-4 py-2',
        lg: '',
        xl: '',
      },
      text: {
        xs: 'text-xs',
        sm: 'text-sm',
        md: '',
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
  },
};
