import {
  Container,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import TopBar from "./TopBar";
import { useCallback, useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import LoadingComponent from "./LoadingComponent";
import { useAppDispatch } from "../store/configureStore";
import { getCartAsync } from "../../features/cart/cartSlice";
import { getCurrentUser } from "../../features/account/accountSlice";
import HomePage from "../../features/home/HomePage";

function App() {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);

  const initApp = useCallback(async () => {
    try {
      await dispatch(getCurrentUser());
      await dispatch(getCartAsync());
    } catch (error) {
      console.log(error);
    }
  }, [dispatch]);

  useEffect(() => {
    initApp().then(() => setLoading(false));
  }, [initApp]);

  const [darkMode, setDarkMode] = useState(false);
  const paletteType = darkMode ? "dark" : "light";
  const theme = createTheme({
    palette: {
      mode: paletteType,
      background: {
        default: paletteType === "light" ? "#eaeaea" : "#121212",
      },
    },
  });
  function handleThemeChange() {
    setDarkMode(!darkMode);
  }

  return (
    <>
      <ThemeProvider theme={theme}>
        <ToastContainer
          position="bottom-right"
          hideProgressBar
          theme="colored"
        />
        <CssBaseline></CssBaseline>
        <TopBar darkMode={darkMode} themeChange={handleThemeChange}></TopBar>
        {loading ? (
          <LoadingComponent message="Loading"></LoadingComponent>
        ) : location.pathname === "/" ? (
          <HomePage />
        ) : (
          <Container sx={{ mt: 4 }}>
            <Outlet></Outlet>
          </Container>
        )}
      </ThemeProvider>
    </>
  );
}

export default App;
