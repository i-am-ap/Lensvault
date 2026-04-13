import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import Loader from "./Loader";


export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isReady } = useAuth();
  const location = useLocation();

  if (!isReady) {
    return (
      <div className="page-shell flex min-h-screen items-center justify-center px-6">
        <Loader label="Restoring session..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        replace
        state={{ from: location.pathname }}
        to="/login"
      />
    );
  }

  return children;
}
