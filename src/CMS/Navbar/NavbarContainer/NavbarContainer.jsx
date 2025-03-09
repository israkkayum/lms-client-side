// import { Navigate, useLocation } from "react-router-dom";
import SiteAdminRoute from "../../../Routes/SiteAdminRoute";
import SiteJoinedRoute from "../../../Routes/SiteJoinedRoute";
import Navbar from "../Navbar/Navbar";
import NavbarEditor from "../NavbarEditor/NavbarEditor";

const NavbarContainer = ({ siteData, profile }) => {
  // const siteId = siteData?._id;

  return (
    <div>
      {siteData?.createdBy === profile?.email ? (
        // Show the editor version for teachers or course instructors
        <SiteAdminRoute>
          <NavbarEditor siteData={siteData} profile={profile} />
        </SiteAdminRoute>
      ) : (
        // Show a read-only version for students
        <SiteJoinedRoute>
          <Navbar siteData={siteData} profile={profile} />
        </SiteJoinedRoute>
      )}
    </div>
  );
};

export default NavbarContainer;
