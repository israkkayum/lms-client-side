import { Navigate, useLocation, useParams } from "react-router-dom";
import useCheckMembership from "../hooks/useCheckMembership";
import useAuth from "../hooks/useAuth";
import Spinner from "../pages/Shared/Spinner/Spinner";

const JoinedRoute = ({ children }) => {
  const location = useLocation();
  const { siteName } = useParams();
  const { user } = useAuth();
  const [isMember, isLoading] = useCheckMembership(siteName, user?.email);

  if (isLoading) return <Spinner></Spinner>;

  if (!isMember) {
    return (
      <Navigate to="/my-institutions" state={{ from: location }} replace />
    );
  }

  return children;
};

export default JoinedRoute;
