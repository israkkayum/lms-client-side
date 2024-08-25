import { Navigate, useLocation } from "react-router-dom";
import Spinner from "../pages/Shared/Spinner/Spinner";
import useProfile from "../hooks/useProfile";

const StudentRoute = ({ children }) => {
  const [profile, isLoading] = useProfile();
  const location = useLocation();

  if (isLoading) {
    return <Spinner></Spinner>;
  }
  if (profile?.profileType == "student") {
    return children;
  }
  return <Navigate to="/" state={{ from: location }} replace></Navigate>;
};

export default StudentRoute;
