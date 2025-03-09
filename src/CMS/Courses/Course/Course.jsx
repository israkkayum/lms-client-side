import { useState } from "react";
import { useParams } from "react-router-dom";
import useCourse from "../../../hooks/useCourse";
import LessonDetails from "../LessonDetails/LessonDetails";

const Course = () => {
  const { courseId } = useParams();
  const [courseData, isLoading] = useCourse(courseId);
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

  return (
    <div className={`flex ${isLoading ? "cursor-wait" : ""}`}>
      {/* Sidebar */}
      <nav className="w-full h-full border-r bg-white space-y-8 overflow-auto sm:w-80">
        <div className="text-[0.9rem] space-y-6 mr-5">
          {courseData.sections?.map((section) => (
            <div key={section.sectionId} className="mb-6">
              {/* Section Header */}
              <h3 className="pb-3 font-medium text-gray-800">
                {section.title}
              </h3>

              {/* Lessons List */}
              <ul className="pl-4">
                {section.lessons.map((lesson) => (
                  <li
                    key={lesson.lessonId}
                    className="py-2 px-4 border-l hover:border-indigo-600 hover:text-gray-900 duration-150 cursor-pointer"
                    onClick={() =>
                      selectLesson(section.sectionId, lesson.lessonId)
                    }
                  >
                    {lesson.name}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </nav>

      {/* Right Panel */}
      <main className="flex-1 overflow-auto">
        <LessonDetails lesson={selectedLesson} />
      </main>
    </div>
  );
};

export default Course;
