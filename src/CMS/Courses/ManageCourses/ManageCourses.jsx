import { NavLink } from "react-router-dom";
import useCourses from "../../../hooks/useCourses";
import Spinner from "../../../pages/Shared/Spinner/Spinner";

const ManageCourses = ({ siteData }) => {
  const [courses, isLoading] = useCourses(siteData?._id);

  return (
    <>
      <div className="max-w-3xl mx-auto px-4 mt-20">
        <div className="items-start justify-between sm:flex">
          <div>
            <h4 className="text-gray-800 text-xl font-semibold">
              Create Courses
            </h4>
            <p className="mt-2 text-gray-600 text-base sm:text-sm">
              Create courses and manage all functionalities.
            </p>
          </div>
          <NavLink
            to="../create-course"
            className="inline-flex items-center justify-center gap-1 py-2 px-3 mt-2 font-medium text-sm text-center text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 rounded-lg sm:mt-0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v12m6-6H6"
              />
            </svg>
            New Courses
          </NavLink>
        </div>
      </div>
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="max-w-screen-xl mx-auto p-5 sm:p-10 md:p-16">
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
                  <a href="#!">
                    <div className="absolute bottom-0 left-0 bg-indigo-600 px-4 py-2 text-white text-sm hover:bg-white hover:text-indigo-600 transition duration-500 ease-in-out">
                      {course.courseCategory}
                    </div>
                  </a>
                </div>
                <div className="px-6 py-4">
                  <NavLink
                    to="../edit-course"
                    className="font-semibold text-lg inline-block hover:text-indigo-600 transition duration-500 ease-in-out"
                  >
                    {course.courseName}
                  </NavLink>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default ManageCourses;
