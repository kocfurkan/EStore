import { createBrowserRouter } from "react-router-dom";
import App from "../layout/App";
import HomePage from "../../features/home/HomePage";
import Catalog from "../../features/catalog/Catalog";
import ProductDetails from "../../features/catalog/ProductDetails";
import AboutPage from "../../features/about/AboutPage";
import { ContactPage } from "@mui/icons-material";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            { path: '', element: <HomePage></HomePage> },
            { path: 'catalog', element: <Catalog></Catalog> },
            { path: 'catalog/:id', element:<ProductDetails></ProductDetails> },
            { path: 'about', element: <AboutPage></AboutPage> },
            { path: 'contact', element: <ContactPage></ContactPage> },
        ]

    }
])