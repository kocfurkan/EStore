import { Navigate, createBrowserRouter } from "react-router-dom";
import App from "../layout/App";
import Catalog from "../../features/catalog/Catalog";
import ProductDetails from "../../features/catalog/ProductDetails";
import AboutPage from "../../features/about/AboutPage";
import ServerError from "../errors/ServerError";
import NotFound from "../errors/NotFound";
import CartPage from "../../features/cart/CartPage";
import ContactPage from "../../features/contact/ContactPage";
import Login from "../../features/account/Login";
import Register from "../../features/account/Register";
import RequireAuth from "./RequireAuth";
import Orders from "../../features/orders/Orders";
import CheckoutWrapper from "../../features/checkout/CheckoutWrapper";
import Inventory from "../../features/admin/Inventory";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,

    //UI Auth protected pages
    children: [
      {
        element: <RequireAuth></RequireAuth>,
        children: [
          //Authenticated routes
          { path: "checkout", element: <CheckoutWrapper></CheckoutWrapper> },
          { path: "orders", element: <Orders></Orders> },
          { path: "inventory", element: <Inventory></Inventory> },
        ],
      },
      //Admin routes
      {
        element: <RequireAuth roles={["Admin"]}></RequireAuth>,
        children: [{ path: "inventory", element: <Inventory></Inventory> }],
      },
      { path: "catalog", element: <Catalog></Catalog> },
      { path: "catalog/:id", element: <ProductDetails></ProductDetails> },
      { path: "about", element: <AboutPage></AboutPage> },
      { path: "contact", element: <ContactPage></ContactPage> },
      { path: "server-error", element: <ServerError></ServerError> },
      { path: "not-found", element: <NotFound></NotFound> },
      { path: "cart", element: <CartPage></CartPage> },
      { path: "login", element: <Login></Login> },
      { path: "register", element: <Register></Register> },
      { path: "*", element: <Navigate replace to="/not-found"></Navigate> },
    ],
  },
]);
