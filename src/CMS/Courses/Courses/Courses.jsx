import { NavLink } from "react-router-dom";
import useCourses from "../../../hooks/useCourses";
import Spinner from "../../../pages/Shared/Spinner/Spinner";

const Courses = ({ siteData }) => {
  const [courses, isLoading] = useCourses(siteData?._id);

  return (
    <div className="max-w-screen-xl mx-auto p-5 sm:p-10 md:p-16">
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 gap-10">
          {courses.map((course, index) => (
            <div key={index} className="rounded overflow-hidden shadow-lg">
              <div className="relative">
                <a href="#">
                  <img
                    className="w-full"
                    src={`data:image/png;base64,${course?.thumbnail}`}
                    alt={course.courseName}
                  />
                  <div className="hover:bg-transparent transition duration-300 absolute bottom-0 top-0 right-0 left-0 bg-gray-900 opacity-25"></div>
                </a>
                <div className="absolute bottom-0 left-0 bg-indigo-600 px-4 py-2 text-white text-sm">
                  {course.courseCategory}
                </div>
              </div>
              <div className="px-6 py-4">
                <NavLink
                  to={`../course/${course._id}`}
                  className="font-semibold text-lg inline-block hover:text-indigo-600 transition duration-500 ease-in-out"
                >
                  {course.courseName}
                </NavLink>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Courses;
