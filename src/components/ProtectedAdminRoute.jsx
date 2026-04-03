import { Navigate } from "react-router-dom";
import { getAdminSession } from "../utils/storage";

export default function ProtectedAdminRoute({ children }) {
  const session = getAdminSession();
  if (!session) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}
