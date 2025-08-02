import { useState } from "react";
import { useParams } from "react-router-dom";
import useCourse from "../../../hooks/useCourse";
import useCourseProgress from "../../../hooks/useCourseProgress";
import StudentLessonDetails from "../StudentLessonDetails/StudentLessonDetails";
import LoadingSpinner from "../../../components/ui/LoadingSpinner/LoadingSpinner";

const Course = () => {
  const { courseId } = useParams();
  const { courseData, isLoading, error } = useCourse(courseId);
  const { progressData, markLessonComplete } = useCourseProgress(courseId);
  const [selectedLesson, setSelectedLesson] = useState(null);

  const selectLesson = (sectionId, lessonId) => {
    const section = courseData.sections?.find(
      (section) => section.sectionId === sectionId
    );
    if (section) {
      const selected = section.lessons.find(
        (lesson) => lesson.lessonId === lessonId
      );
      setSelectedLesson(selected || null);
    }
  };

  if (isLoading) return <LoadingSpinner size="lg" className="mt-20" />;
  
  if (error) {
    return (
      <div className="max-w-screen-xl mx-auto px-8 mt-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Course</h3>
          <p className="text-red-600">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!courseData?._id) {
    return (
      <div className="max-w-screen-xl mx-auto px-8 mt-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-yellow-800 mb-2">Course Not Found</h3>
          <p className="text-yellow-600">The course you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  // Calculate total lessons
  const totalLessons = courseData.sections?.reduce(
    (total, section) => total + section.lessons.length,
    0
  ) || 0;

  // Calculate progress percentage
  const progressPercentage = totalLessons > 0
    ? Math.round((progressData.completedLessons.length / totalLessons) * 100)
    : 0;

  return (
    <div className="flex flex-col md:flex-row min-h-screen max-w-screen-xl mx-auto px-8 md:px-4 mt-8">
      <nav className="w-full md:w-80 bg-white border-r border-gray-200 overflow-y-auto shadow-sm">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            {courseData.courseName}
          </h1>

          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">
                Progress
              </span>
              <span className="text-sm font-medium text-indigo-600">{progressPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              {progressData.completedLessons.length} of {totalLessons} lessons completed
            </div>
          </div>

          <div className="space-y-4">
            {courseData.sections?.map((section) => (
              <div
                key={section.sectionId}
                className="border-b border-gray-100 pb-4"
              >
                <h3 className="text-md font-semibold text-gray-800 mb-3">
                  {section.title}
                </h3>

                <ul className="space-y-1">
                  {section.lessons.map((lesson) => (
                    <li
                      key={lesson.lessonId}
                      onClick={() =>
                        selectLesson(section.sectionId, lesson.lessonId)
                      }
                      className={`flex items-center py-3 px-4 rounded-lg cursor-pointer transition-all duration-200 ${
                        selectedLesson?.lessonId === lesson.lessonId
                          ? "bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600"
                          : "hover:bg-gray-50 text-gray-700 hover:translate-x-1"
                      }`}
                    >
                      <span className="mr-3">
                        {progressData.completedLessons.includes(lesson.lessonId) ? (
                          <svg
                            className="w-5 h-5 text-indigo-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="w-5 h-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        )}
                      </span>
                      <span className="text-sm font-medium">{lesson.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </nav>

      <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
        {selectedLesson ? (
          <StudentLessonDetails 
            lesson={selectedLesson}
            onComplete={() => markLessonComplete(selectedLesson.lessonId)}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full bg-white rounded-lg shadow-sm">
            <svg
              className="w-16 h-16 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Learn?</h3>
            <p className="text-gray-500 text-center max-w-sm">
              Select a lesson from the sidebar to start your learning journey
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Course;
