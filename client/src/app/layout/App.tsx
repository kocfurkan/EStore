import Catalog from "../../features/catalog/Catalog";
import { Container, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import TopBar from "./TopBar";
import { useState } from "react";

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
                <CssBaseline></CssBaseline>
                <TopBar darkMode={darkMode} themeChange={handleThemeChange}></TopBar>
                <Container>
                    <Catalog></Catalog>
                </Container>
            </ThemeProvider>


        </>
    )
}

export default App
