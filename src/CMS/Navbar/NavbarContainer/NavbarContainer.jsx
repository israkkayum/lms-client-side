// import { Navigate, useLocation } from "react-router-dom";
import AdministratorRoute from "../../../Routes/AdministratorRoute";
import JoinedRoute from "../../../Routes/JoinedRoute";
import Navbar from "../Navbar/Navbar";
import NavbarEditor from "../NavbarEditor/NavbarEditor";

const NavbarContainer = ({ siteData, profile }) => {
  const siteId = siteData?._id;

  return (
    <div>
      {siteData?.createdBy === profile?.email ? (
        // Show the editor version for teachers or course instructors
        <AdministratorRoute>
          <NavbarEditor siteId={siteId} />
        </AdministratorRoute>
      ) : (
        // Show a read-only version for students
        <JoinedRoute>
          <Navbar siteId={siteId} />
        </JoinedRoute>
      )}
    </div>
  );
};

export default NavbarContainer;
