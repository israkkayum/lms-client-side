import { Outlet, useParams } from "react-router-dom";
import useSite from "../hooks/useSite";
import PageNotFound from "../pages/Shared/PageNotFound/PageNotFound";
import Spinner from "../pages/Shared/Spinner/Spinner";
import NavbarContainer from "../CMS/Navbar/NavbarContainer/NavbarContainer";
import useProfile from "../hooks/useProfile";

const Site = () => {
  const { siteName } = useParams();
  const [siteData, isLoadingSite] = useSite(siteName);
  const [profile, isLoadingProfile] = useProfile();

  if (isLoadingSite || isLoadingProfile) {
    return <Spinner />;
  }

  if (!siteData?._id) {
    return <PageNotFound />;
  }

  return (
    <div>
      <NavbarContainer siteData={siteData} profile={profile}></NavbarContainer>
      <Outlet></Outlet>
    </div>
  );
};

export default Site;
