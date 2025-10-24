import { FormControlLabel, Checkbox as MuiCheckbox, CheckboxProps, SxProps } from '@mui/material';

export default function Checkox({ label, sx = {}, labelSx = {}, checkboxSx = {}, ...props }: CheckboxProps & { label?: React.ReactNode, labelSx?: SxProps, checkboxSx?: SxProps }) {
  if (label) {
    return (
      <FormControlLabel
        sx={{ display: 'flex', ml: '-7px', ...sx }}
        label={<div className="flex-1">{label}</div>}
        control={<MuiCheckbox sx={{ height: 32, width: 32, mr: 1, ...checkboxSx }} {...props} />}
      />
    );
  }

  return <MuiCheckbox {...props} />;
}
