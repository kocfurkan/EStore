import { FormControl, FormControlLabel, Radio, RadioGroup } from "@mui/material";


interface Props {
    sortOptions: any[];
    onChange: (event: any) => void;
    selectedValue: string
}
export default function RadioButtonGroup({sortOptions,onChange,selectedValue } :Props) {


    return (
        <FormControl>
            <RadioGroup onChange={onChange} value={selectedValue }>
                {sortOptions.map(({ value, label }) => (
                    <FormControlLabel value={value} control={<Radio />} label={label} key={value} />
                ))}
            </RadioGroup>
        </FormControl>
    )
}