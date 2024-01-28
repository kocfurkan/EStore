import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../store/configureStore";
import { toast } from "react-toastify";
/**
 * Only for navigating and authenticating in UI not a real page.
 */

interface Props {
  roles?: string[];
}

export default function RequireAuth({ roles }: Props) {
  const { user } = useAppSelector((state) => state.account);
  //Current location
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }}></Navigate>;
  }

  if (roles && !roles.some((r) => user.roles?.includes(r))) {
    toast.error("Unauthorized Action");
    return <Navigate to="/catalog" />;
  }
  return <Outlet></Outlet>;
}
