import { useOutletContext } from "react-router-dom";
import SiteAdminRoute from "../../../Routes/SiteAdminRoute";
import SiteJoinedRoute from "../../../Routes/SiteJoinedRoute";
import ManageCourses from "../ManageCourses/ManageCourses";
import Courses from "../Courses/Courses";

const CoursesContainer = () => {
  const { siteData, profile } = useOutletContext();
  return (
    <div>
      {siteData?.createdBy === profile?.email ? (
        // Show the editor version for teachers or course instructors
        <SiteAdminRoute>
          <ManageCourses siteData={siteData} profile={profile} />
        </SiteAdminRoute>
      ) : (
        // Show a read-only version for students
        <SiteJoinedRoute>
          <Courses siteData={siteData} />
        </SiteJoinedRoute>
      )}
    </div>
  );
};

export default CoursesContainer;
