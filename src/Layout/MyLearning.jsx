import { NavLink, Outlet } from "react-router-dom";

const MyLearning = () => {
  return (
    <div>
      <div className="w-64 min-h-full bg-orange-400">
        <ul className="menu">
          {" "}
          <li>
            <NavLink to="/my-learning/my-courses">My Courses</NavLink>
          </li>
        </ul>
      </div>
      <div>
        <Outlet></Outlet>
      </div>
    </div>
  );
};

export default MyLearning;
