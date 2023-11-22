import { AppBar, Switch, Toolbar, Typography } from "@mui/material";

interface Props {
    darkMode: boolean;
    themeChange: () => void
}
export default function TopBar({ themeChange,darkMode }:Props) {
    return (
        <AppBar position="static" sx={{ mb: 4 }}>
            <Toolbar>
             
                <Typography variant="h6">EStore</Typography>
                <Switch checked={darkMode} onChange={themeChange} ></Switch>
            </Toolbar>
        </AppBar>
    )
}