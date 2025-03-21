import { createBrowserRouter } from "react-router-dom";
import Main from "../Layout/Main";
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import SignUp from "../pages/SignUp/SignUp";
import PrivateRoute from "./PrivateRoute";
import SettingsHome from "../pages/Settings/SettingsHome/SettingsHome";
import PageNotFound from "../pages/Shared/PageNotFound/PageNotFound";
import MySites from "../pages/MySites/MySites";
import MyInstitutions from "../pages/MyInstitutions/MyInstitutions";
import TeacherRoute from "./TeacherRoute";
import StudentRoute from "./StudentRoute";
import Site from "../Layout/Site";
import SiteHomeSettings from "../CMS/Settings/SiteHomeSettings/SiteHomeSettings";
import CoursesContainer from "../CMS/Courses/CoursesContainer/CoursesContainer";
import SiteAdminRoute from "./SiteAdminRoute";
import CreateCourse from "../CMS/Courses/CreateCourse/CreateCourse";
import EditCourse from "../CMS/Courses/EditCourse/EditCourse";
import SiteJoinedRoute from "./SiteJoinedRoute";
import Course from "../CMS/Courses/Course/Course";
import MyGrade from "../CMS/MyGrade/MyGrade";
import HomePageContainer from "../CMS/HomePage/HomePageContainer";
import Documentation from "../pages/Documentation/Documentation";
import Forums from "../pages/Forums/Forums";
import Blogs from "../pages/Blogs/Blogs";
import BlogDetails from "../pages/Blogs/BlogDetails";
import CreateBlog from "../pages/Blogs/CreateBlog";
import EditBlog from "../pages/Blogs/EditBlog";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main></Main>,
    errorElement: <PageNotFound />,
    children: [
      {
        path: "/",
        element: <Home></Home>,
      },
      {
        path: "home",
        element: <Home></Home>,
      },
      {
        path: "documentation",
        element: <Documentation />,
      },
      {
        path: "forums",
        element: <Forums />,
      },
      {
        path: "blogs",
        element: <Blogs />,
      },
      {
        path: "blogs/:id",
        element: <BlogDetails />,
      },
      {
        path: "create-blog",
        element: (
          <PrivateRoute>
            <CreateBlog />
          </PrivateRoute>
        ),
      },
      {
        path: "edit-blog/:id",
        element: (
          <PrivateRoute>
            <EditBlog />
          </PrivateRoute>
        ),
      },
      {
        path: "login",
        element: <Login></Login>,
      },
      {
        path: "register",
        element: <SignUp></SignUp>,
      },
      {
        path: "profile-settings",
        element: (
          <PrivateRoute>
            <SettingsHome></SettingsHome>
          </PrivateRoute>
        ),
      },
      {
        path: "my-sites",
        element: (
          <PrivateRoute>
            <TeacherRoute>
              <MySites></MySites>
            </TeacherRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "my-institutions",
        element: (
          <PrivateRoute>
            <StudentRoute>
              <MyInstitutions></MyInstitutions>
            </StudentRoute>
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "/:siteName",
    element: (
      <PrivateRoute>
        <Site></Site>
      </PrivateRoute>
    ),
    errorElement: <PageNotFound />,
    children: [
      {
        path: "",
        element: <HomePageContainer />,
      },
      {
        path: "site-home-settings",
        element: (
          <SiteAdminRoute>
            <SiteHomeSettings></SiteHomeSettings>
          </SiteAdminRoute>
        ),
      },
      {
        path: "my-courses",
        element: <CoursesContainer></CoursesContainer>,
      },
      {
        path: "create-course",
        element: (
          <SiteAdminRoute>
            <CreateCourse></CreateCourse>
          </SiteAdminRoute>
        ),
      },
      {
        path: "edit-course/:courseId",
        element: (
          <SiteAdminRoute>
            <EditCourse />
          </SiteAdminRoute>
        ),
      },
      {
        path: "course/:courseId",
        element: (
          <SiteJoinedRoute>
            <Course />
          </SiteJoinedRoute>
        ),
      },
      {
        path: "my-grade",
        element: (
          <SiteJoinedRoute>
            <MyGrade />
          </SiteJoinedRoute>
        ),
      },
    ],
  },
  // {
  //   path: "*",
  //   element: <PageNotFound></PageNotFound>,
  // },
]);
