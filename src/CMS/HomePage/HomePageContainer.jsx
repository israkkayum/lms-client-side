
import { useOutletContext } from 'react-router-dom';
import SiteJoinedRoute from '../../Routes/SiteJoinedRoute';
import SiteAdminRoute from '../../Routes/SiteAdminRoute';
import HomePage from './HomePage';
import EditHomePage from './EditHomePage';

const HomePageContainer = () => {
  const { siteData, profile } = useOutletContext();
  return (
    <div>
      {siteData?.createdBy === profile?.email ? (
        // Show the editor version for teachers or course instructors
        <SiteAdminRoute>
          <EditHomePage siteData={siteData} profile={profile} />
        </SiteAdminRoute>
      ) : (
        // Show a read-only version for students
        <SiteJoinedRoute>
          <HomePage siteData={siteData} profile={profile}/>
        </SiteJoinedRoute>
      )}
    </div>
  );
};

export default HomePageContainer;
