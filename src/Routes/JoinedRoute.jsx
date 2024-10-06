import { Navigate, useLocation, useParams } from "react-router-dom";
import Spinner from "../pages/Shared/Spinner/Spinner";
import useSite from "../hooks/useSite";
// import useProfile from "../hooks/useProfile";
import useAuth from "../hooks/useAuth";

const JoinedRoute = ({ children }) => {
  const location = useLocation();
  const { siteName } = useParams();

  const [siteData, isLoading] = useSite(siteName);
  const { user } = useAuth();
  //   const [profile, isLoadingProfile] = useProfile();

  if (isLoading || !user?.email) {
    return <Spinner></Spinner>;
  }

  if (siteData?.createdBy == user?.email) {
    return children;
  }

  return (
    <Navigate to={`/${siteName}`} state={{ from: location }} replace></Navigate>
  );
};

export default JoinedRoute;
