import { useState } from "react";
import { useParams } from "react-router-dom";
import useCourse from "../../../hooks/useCourse";
import useCourseProgress from "../../../hooks/useCourseProgress";
import StudentLessonDetails from "../StudentLessonDetails/StudentLessonDetails";
import Spinner from "../../../pages/Shared/Spinner/Spinner";

const Course = () => {
  const { courseId } = useParams();
  const [courseData, isLoading] = useCourse(courseId);
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

  if (isLoading) return <Spinner />;

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
      <nav className="w-full md:w-80 bg-white border-r border-gray-200 overflow-y-auto">
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
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
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
                      className={`flex items-center py-2 px-4 rounded-lg cursor-pointer transition-colors ${
                        selectedLesson?.lessonId === lesson.lessonId
                          ? "bg-indigo-50 text-indigo-700"
                          : "hover:bg-gray-50 text-gray-700"
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
                      <span className="text-sm">{lesson.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </nav>

      <main className="flex-1 overflow-y-auto bg-white p-6">
        {selectedLesson ? (
          <StudentLessonDetails 
            lesson={selectedLesson}
            onComplete={() => markLessonComplete(selectedLesson.lessonId)}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 text-lg">
              Select a lesson to start learning
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Course;
