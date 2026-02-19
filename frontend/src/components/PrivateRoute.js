import { Navigate } from "react-router-dom";
import { isLoggedIn } from "../utils/auth";

function PrivateRoute({ children }) {
  if (!isLoggedIn()) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default PrivateRoute;
