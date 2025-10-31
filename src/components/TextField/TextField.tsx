import { Box, IconButton, InputAdornment } from '@mui/material';
import MuiTextField, { TextFieldProps as MuiTextFieldProps } from '@mui/material/TextField';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import { useEffect, useRef, useState } from 'react';
import Typography from '../Typography';
import { useFormContext } from '../Form/Form.context';
import { twMerge } from 'tailwind-merge';

type TextFieldProps = {
  clearable?: boolean;
  description?: string;
} & MuiTextFieldProps;

export default function TextField({
  clearable = false,
  value: _value,

  defaultValue,
  onChange,
  sx = {},

  // incompatible props
  margin,
  onKeyDown,
  onKeyUp,
  onInvalid,

  disabled,
  description,

  ...props
}: TextFieldProps) {
  const ref = useRef(null);
  const [value, setValue] = useState<any>(_value || defaultValue || '');

  const { errors } = useFormContext();

  useEffect(() => {
    if (_value !== undefined && _value !== null && _value != value) {
      setValue(_value);
    }
  }, [_value]);

  return (
    <Box sx={sx}>
      {props.label && (
        <Typography className={twMerge('text-xs font-bold', description ? 'mb-0' : 'mb-0.5')} sx={{ color: disabled ? 'text.disabled' : 'text.primary' }}>{props.label}</Typography>
      )}
      {description && (
        <Typography className={twMerge('text-[11px] mb-1', disabled ? 'text-disabled' : 'text-gray-500')}>{description}</Typography>
      )}
      <MuiTextField
        ref={ref}
        value={value}
        // defaultValue={defaultValue}
        onChange={e => { setValue(e.target.value); onChange?.(e); }}

        {...(props.name && {
          error: !!errors[props.name],
          helperText: errors[props.name],
        })}

        {...props}
        label=""
        variant="filled"
        disabled={disabled}

        sx={{
          width: '100%',
          '& > .MuiFilledInput-root': {
            '&:hover': {
              borderColor: '#9ca3af!important',
            },
            height: '100%',
            borderRadius: 1,
            '&:before': {
              borderBottom: 'none!important',
            },
            '&:after': {
              borderBottom: 'none!important',
            },
          },
          '& > .MuiFormLabel-root': {
            display: 'none',
          },
          '& .MuiInputBase-root.Mui-disabled': {
            backgroundColor: '#f6f6f6',
          },
          '& .MuiInputBase-input.Mui-disabled::-webkit-input-placeholder': {
            '-webkit-text-fill-color': '#00000040!important',
          },
        }}

        InputProps={{
          ...props.InputProps,
          endAdornment: clearable ? (
            <>
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => {
                    setValue('');
                    onChange?.({ target: { value: '' } } as unknown as React.ChangeEvent<HTMLInputElement>);
                  }}
                  className="MuiTextFieldClearButton"
                  sx={{
                    visibility: 'hidden',

                    // TODO: apply this animation in future
                    // transition: 'all .15s ease-in-out',
                    // opacity: props.value ? 1 : 0,
                    // transform: 'scale(.75)',
                  }}
                >
                  <ClearRoundedIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
              {props.InputProps?.endAdornment}
            </>
          ) : props.InputProps?.endAdornment,
        }}
      />
    </Box>
  );
}
