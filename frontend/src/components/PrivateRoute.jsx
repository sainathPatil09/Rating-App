import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PrivateRoute = ({ children, roles }) => {
    // console.log(roles)
  const { authUser, loading } = useContext(AuthContext);
 console.log(authUser)
    if (loading) return <div>Loading...</div>;
  if (!authUser) return <Navigate to="/login" />; // Not logged in

  if (roles && !roles.includes(authUser.role)) {
    return <Navigate to="/login" />; // Role not allowed
  }

  return children; // Authorized
};

export default PrivateRoute;
