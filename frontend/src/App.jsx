import { Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Upload from "./pages/Upload";
import ViewImage from "./pages/ViewImage";


function HomeRedirect() {
  const { isAuthenticated, isReady } = useAuth();

  if (!isReady) {
    return null;
  }

  return (
    <Navigate
      replace
      to={isAuthenticated ? "/dashboard" : "/login"}
    />
  );
}


function MissingRoute() {
  return <Navigate replace to="/" />;
}


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/view/:imageId" element={<ViewImage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/upload"
        element={
          <ProtectedRoute>
            <Upload />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<MissingRoute />} />
    </Routes>
  );
}

