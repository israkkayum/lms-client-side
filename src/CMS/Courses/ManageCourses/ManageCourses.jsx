import { NavLink } from "react-router-dom";
import useCourses from "../../../hooks/useCourses";
import { createSafeImageUrl } from "../../../utils/helpers";
import LoadingSpinner from "../../../components/ui/LoadingSpinner/LoadingSpinner";
import EmptyState from "../../../components/ui/EmptyState/EmptyState";
import Card from "../../../components/ui/Card/Card";
import Badge from "../../../components/ui/Badge/Badge";
import Button from "../../../components/ui/Button/Button";

const ManageCourses = ({ siteData }) => {
  const [courses, isLoading, refetch, error] = useCourses(siteData?._id);

  if (isLoading) return <LoadingSpinner size="lg" className="mt-20" />;
  
  if (error) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 mt-20">
        <Card className="bg-red-50 border border-red-200">
          <div className="text-center">
            <h3 className="text-lg font-medium text-red-800 mb-2">Failed to Load Courses</h3>
            <p className="text-red-600 mb-4">{error.message}</p>
            <Button onClick={refetch} variant="danger" size="sm">
              Try Again
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="items-start justify-between sm:flex">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Course Management</h1>
            <p className="mt-2 text-gray-600">
              Create and manage your courses with comprehensive tools and analytics.
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button
              as={NavLink}
              to="../create-course"
              variant="primary"
              size="md"
              className="inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create Course
            </Button>
          </div>
        </div>
      </div>
      
      <div className="space-y-6">
        {courses.length === 0 ? (
          <Card className="bg-gray-50">
            <EmptyState
              icon={
                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              }
              title="No courses yet"
              description="Get started by creating your first course to begin sharing knowledge with your students."
              action={
                <Button as={NavLink} to="../create-course" variant="primary">
                  Create Your First Course
                </Button>
              }
            />
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 gap-8">
            {courses.map((course) => (
              <Card key={course._id} padding="none" hover className="overflow-hidden">
                <div className="relative">
                  <img
                    className="w-full h-48 object-cover"
                    src={createSafeImageUrl(course?.thumbnail)}
                    alt={course.courseName}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-4 left-4">
                    <Badge variant="primary" className="bg-indigo-600 text-white">
                      {course.courseCategory}
                    </Badge>
                  </div>
                </div>
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {course.courseName}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {course.courseDescription?.replace(/<[^>]*>/g, "").substring(0, 120)}...
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>Created {new Date(course.date).toLocaleDateString()}</span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                      </svg>
                      {course.enrolledCount || 0} students
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      as={NavLink}
                      to={`../edit-course/${course._id}`}
                      variant="primary"
                      size="sm"
                      className="flex-1"
                    >
                      Manage
                    </Button>
                    <Button
                      as={NavLink}
                      to={`../course/${course._id}`}
                      variant="outline"
                      size="sm"
                    >
                      Preview
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageCourses;

                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      Created {new Date(course.date).toLocaleDateString()}
                    </span>
                    <NavLink
                      to={`../edit-course/${course._id}`}
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                    >
                      Manage →
                    </NavLink>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ManageCourses;
