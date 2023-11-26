import { Container, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import TopBar from "./TopBar";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'

function App() {
    const [darkMode, setDarkMode] = useState(false)
    const paletteType = darkMode ? 'dark' : 'light'
    const theme = createTheme({
        palette: {
            mode: paletteType,
            background: {
                default: paletteType === 'light' ? "#eaeaea" : "#121212"
            }
        }
    })
    function handleThemeChange() {
        setDarkMode(!darkMode);
    }
    return (
        <>
            <ThemeProvider theme={theme}>
            <ToastContainer position="bottom-right" hideProgressBar theme="colored"/>
                <CssBaseline></CssBaseline>
                <TopBar darkMode={darkMode} themeChange={handleThemeChange}></TopBar>
                <Container>
                    <Outlet></Outlet>
                </Container>
            </ThemeProvider>
        </>
    )
}

export default App
