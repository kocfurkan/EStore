import { TextField } from "@mui/material";
import { UseControllerProps, useController } from "react-hook-form";
interface Props extends UseControllerProps {
  label: string;
}
export default function AppTextInput(props: Props) {
  const { fieldState, field } = useController({ ...props, defaultValue: "" });
  return (
    // Spreading is used to pass props and properties that are provided at interface and useController
    <TextField
      {...props}
      {...field}
      fullWidth
      variant="outlined"
      error={!!fieldState.error}
      helperText={fieldState.error?.message}
    ></TextField>
  );
}
