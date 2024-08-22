import { createBrowserRouter } from "react-router-dom";
import Main from "../Layout/Main";
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import SignUp from "../pages/SignUp/SignUp";
import PrivateRoute from "./PrivateRoute";
import MyLearning from "../Layout/MyLearning";
import SettingsHome from "../pages/Settings/SettingsHome/SettingsHome";
import PageNotFound from "../pages/Shared/PageNotFound/PageNotFound";

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
        path: "login",
        element: <Login></Login>,
      },
      {
        path: "register",
        element: <SignUp></SignUp>,
      },
      {
        path: "profile-settings",
        element: <PrivateRoute>{<SettingsHome></SettingsHome>}</PrivateRoute>,
      },
    ],
  },
  {
    path: "my-learning",
    element: <MyLearning></MyLearning>,
    children: [],
  },
  // {
  //   path: "*",
  //   element: <PageNotFound></PageNotFound>,
  // },
]);
