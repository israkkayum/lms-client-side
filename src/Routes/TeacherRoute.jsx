import { Navigate, useLocation } from "react-router-dom";
import Spinner from "../pages/Shared/Spinner/Spinner";
import useProfile from "../hooks/useProfile";

const TeacherRoute = ({ children }) => {
  const [profile, isLoading] = useProfile();
  const location = useLocation();

  if (isLoading) {
    return <Spinner></Spinner>;
  }
  if (profile?.profileType == "teacher") {
    return children;
  }
  return <Navigate to="/" state={{ from: location }} replace></Navigate>;
};

export default TeacherRoute;
