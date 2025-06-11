import { Navigate } from "react-router-dom";

const PublicRoute = ({ children, isAuthenticated }) => {
  return isAuthenticated ? <Navigate to="/blog" /> : children;
};

export default PublicRoute;
