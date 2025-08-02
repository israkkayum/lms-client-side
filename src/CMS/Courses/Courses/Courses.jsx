import { NavLink } from "react-router-dom";
import useCourses from "../../../hooks/useCourses";
import Spinner from "../../../pages/Shared/Spinner/Spinner";
import { createSafeImageUrl } from "../../../utils/helpers";
import LoadingSpinner from "../../../components/ui/LoadingSpinner/LoadingSpinner";

const Courses = ({ siteData }) => {
  const { courses, isLoading, error } = useCourses(siteData?._id);

  if (isLoading) return <LoadingSpinner size="lg" className="mt-20" />;
  
  if (error) {
    return (
      <div className="max-w-screen-xl mx-auto p-5">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error loading courses: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto p-5 sm:p-10 md:p-16">
      {courses.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No courses available</h3>
          <p className="mt-2 text-gray-500">Check back later for new courses.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 gap-8">
          {courses.map((course) => (
            <div 
              key={course._id} 
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative">
                <img
                  className="w-full h-48 object-cover"
                  src={createSafeImageUrl(course?.thumbnail)}
                  alt={course.courseName}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-4 left-4 bg-indigo-600 px-3 py-1 text-white text-sm rounded-full">
                  {course.courseCategory}
                </div>
              </div>
              <div className="p-6">
                <NavLink
                  to={`../course/${course._id}`}
                  className="block font-semibold text-lg text-gray-900 hover:text-indigo-600 transition-colors duration-200 mb-2"
                >
                  {course.courseName}
                </NavLink>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {course.courseDescription?.replace(/<[^>]*>/g, "").substring(0, 100)}...
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {new Date(course.date).toLocaleDateString()}
                  </span>
                  <NavLink
                    to={`../course/${course._id}`}
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                  >
                    Start Learning →
                  </NavLink>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Courses;
