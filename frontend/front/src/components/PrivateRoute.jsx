import { Navigate, Outlet } from "react-router-dom";
import { getUser, isLoggedIn } from "../services/auth";

function PrivateRoute({ roles }) {
  const user = getUser();

  if (!isLoggedIn()) {
    return <Navigate to="/login" />;
  }

  if (roles && !roles.includes(user?.role)) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
}

export default PrivateRoute;