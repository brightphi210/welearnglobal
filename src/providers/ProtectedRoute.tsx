import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface ProtectedRouteProps {
  element: React.ReactNode;
  allowedRole: "tutor" | "student";
}

const ProtectedRoute = ({ element, allowedRole }: ProtectedRouteProps) => {
  const navigate = useNavigate();

  const token = localStorage.getItem("welearnToken");
  const role = (localStorage.getItem("welearnRole") as "tutor" | "student") || "student";

  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    if (role !== allowedRole) {
      navigate(
        role === "tutor" ? "/tutor/dashboard/overview" : "/student/dashboard/overview",
        { replace: true }
      );
    }
  }, [token, role, allowedRole, navigate]);

  if (!token || role !== allowedRole) return null;

  return <>{element}</>;
};

export default ProtectedRoute;