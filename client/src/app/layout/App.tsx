import { Container, CssBaseline, ThemeProvider, createTheme, useStepContext } from "@mui/material";
import TopBar from "./TopBar";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
import { useStoreContext } from "../context/StoreContext";
import { getCookie } from "../util/util";
import agent from "../api/agent";
import LoadingComponent from "./LoadingComponent";

function App() {

    const { setCart } = useStoreContext();
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const customerId = getCookie('customerId');
        if (customerId) {
            agent.Cart.get().then(cart => setCart(cart)).catch(error => console.log(error)).finally(() => setLoading(false))
        } else { setLoading(false) }
    }, [setCart])

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

    if (loading) return <LoadingComponent message='Loading'></LoadingComponent>
    return (
        <>
            <ThemeProvider theme={theme}>
                <ToastContainer position="bottom-right" hideProgressBar theme="colored" />
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
