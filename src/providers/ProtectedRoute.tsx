import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ element }: any) => {
  const navigate = useNavigate();
  // const isAuthenticated = localStorage.getItem("betamindToken");
  const isAuthenticated = 'welearngABC'
  const isTutor = false

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
    // else if (isAuthenticated && isTutor) {
    //   navigate("/tutor/dashboard/overview");
    // }

    // else if (isAuthenticated && !isTutor) {
    //   navigate("/student/dashboard/overview");
    // }
  }, [isAuthenticated, navigate, isTutor]);

  return isAuthenticated ? element : null;
};

export default ProtectedRoute;
