import { Container, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import TopBar from "./TopBar";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
import { getCookie } from "../util/util";
import agent from "../api/agent";
import LoadingComponent from "./LoadingComponent";
import { useAppDispatch } from "../store/configureStore";
import { setCart } from "../../features/cart/cartSlice";

function App() {

    const dispatch = useAppDispatch()
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const customerId = getCookie('customerId');
        if (customerId) {
            agent.Cart.get().then(cart => dispatch(setCart(cart))).catch(error => console.log(error)).finally(() => setLoading(false))
        } else { setLoading(false) }
    }, [dispatch])

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
