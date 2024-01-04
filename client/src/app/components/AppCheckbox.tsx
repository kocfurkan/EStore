import { Checkbox, FormControlLabel } from "@mui/material";
import { UseControllerProps, useController } from "react-hook-form";

interface Props extends UseControllerProps {
  label: string;
  disabled: boolean;
}

export default function AppCheckbox(props: Props) {
  const { field } = useController({ ...props, defaultValue: false });
  return (
    //The Checkbox is the actual input control.
    //The FormControlLabel is used to associate a label (props.label) with the checkbox and provides additional styling options.
    <FormControlLabel
      control={
        <Checkbox
          {...field}
          checked={field.value}
          color="secondary"
          disabled={props.disabled}
        ></Checkbox>
      }
      label={props.label}
    ></FormControlLabel>
  );
}
