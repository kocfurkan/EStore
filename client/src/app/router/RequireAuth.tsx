import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../store/configureStore";
/**
 * Only for navigating and authenticating in UI not a real page.
 */
export default function RequireAuth() {
  const { user } = useAppSelector((state) => state.account);
  //Current location
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }}></Navigate>;
  }

  return <Outlet></Outlet>;
}
