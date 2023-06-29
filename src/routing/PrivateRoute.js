import { Route, Navigate } from "react-router-dom";

const PrivateRoute = ({ path, element: Element }) => {
  const isAuthenticated = localStorage.getItem("authToken");

  return (
    <Route
      path={path}
      element={isAuthenticated ? <Element /> : <Navigate to="/login" replace />}
    />
  );
};

export default PrivateRoute;
