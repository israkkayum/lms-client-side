import { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import LessonDetails from "../LessonDetails/LessonDetails";

// Editable Component for Inline Editing
const EditableText = ({ value, onChange, className = "" }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  const handleBlur = () => {
    setIsEditing(false);
    if (inputValue.trim()) {
      onChange(inputValue);
    }
  };

  return isEditing ? (
    <input
      type="text"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={(e) => {
        if (e.key === "Enter") handleBlur();
      }}
      autoFocus
      className={`border rounded p-1 ${className}`}
    />
  ) : (
    <span
      onDoubleClick={() => setIsEditing(true)}
      className={`cursor-pointer ${className}`}
    >
      {value}
    </span>
  );
};

// Sidebar Sections List Component
const SectionsList = ({
  sections,
  onRenameSection,
  onDeleteSection,
  onAddLesson,
  onRenameLesson,
  onDeleteLesson,
  onSelectLesson,
}) => (
  <div className="text-gray-600">
    <ul>
      {sections.map((section) => (
        <li key={section.id} className="mb-6">
          {/* Section Header */}
          <div className="flex justify-between items-center">
            <EditableText
              value={section.title}
              onChange={(newTitle) =>
                onRenameSection(section.sectionId, newTitle)
              }
              className="pb-3 font-medium text-gray-800"
            />
            <button
              onClick={() => onDeleteSection(section.sectionId)}
              className="text-red-500 text-sm"
            >
              ✕
            </button>
          </div>

          {/* Lessons List */}
          <ul className="pl-4">
            {section.lessons.map((lesson) => (
              <li
                key={lesson.lessonId}
                className="flex items-center"
                onClick={() =>
                  onSelectLesson(section.sectionId, lesson.lessonId)
                }
              >
                <EditableText
                  value={lesson.name}
                  onChange={(newName) =>
                    onRenameLesson(section.sectionId, lesson.lessonId, newName)
                  }
                  className="block w-full py-2 px-4 border-l hover:border-indigo-600 hover:text-gray-900 duration-150"
                />
                <button
                  onClick={() =>
                    onDeleteLesson(section.sectionId, lesson.lessonId)
                  }
                  className="text-red-500 ml-2 text-sm"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>

          {/* Add Lesson Button */}
          <button
            onClick={() => onAddLesson(section.sectionId)}
            className="text-indigo-500 mt-2"
          >
            + Add Lesson
          </button>
        </li>
      ))}
    </ul>
  </div>
);

// Main Sidebar Component
const EditContent = ({ courseId }) => {
  const axiosSecure = useAxiosSecure();
  const axiosPublic = useAxiosPublic();

  const [sections, setSections] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      try {
        const response = await axiosSecure.get(`/course/${courseId}`);
        setSections(response.data.sections || []);
      } catch (error) {
        console.error("Error fetching course:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [axiosSecure, courseId]);

  // Helper to wrap async operations with loading state
  const withLoading = async (operation) => {
    setLoading(true);
    try {
      await operation();
    } catch (error) {
      console.error("Error in operation:", error);
    } finally {
      setLoading(false);
    }
  };

  // Add a New Section
  const addSection = () =>
    withLoading(async () => {
      await axiosPublic.post(`/course/${courseId}/section`, {
        title: "New Section",
      });
      setSections((prevSections) => [
        ...prevSections,
        { sectionId: Date.now().toString(), title: "New Section", lessons: [] },
      ]);
    });

  // Rename a Section
  const renameSection = (id, newName) =>
    withLoading(async () => {
      const response = await axiosPublic.put(
        `/course/${courseId}/section/${id}`,
        { newTitle: newName }
      );

      if (response.data) {
        setSections(
          sections.map((section) =>
            section.sectionId === id ? { ...section, title: newName } : section
          )
        );
      }
    });

  // Delete a Section
  const deleteSection = (sectionId) =>
    withLoading(async () => {
      await axiosPublic.delete(`/course/${courseId}/section/${sectionId}`);
      setSections((prevSections) =>
        prevSections.filter((section) => section.sectionId !== sectionId)
      );
    });

  // Add a Lesson to a Section
  const addLesson = (sectionId) =>
    withLoading(async () => {
      await axiosPublic.post(
        `/course/${courseId}/section/${sectionId}/lesson`,
        { lessonName: "New Lesson" }
      );
      setSections((prevSections) =>
        prevSections.map((section) =>
          section.sectionId === sectionId
            ? {
                ...section,
                lessons: [
                  ...section.lessons,
                  { lessonId: Date.now().toString(), name: "New Lesson" },
                ],
              }
            : section
        )
      );
    });

  // Rename a Lesson
  const renameLesson = (sectionId, lessonId, newName) =>
    withLoading(async () => {
      await axiosPublic.put(
        `/course/${courseId}/section/${sectionId}/lesson/${lessonId}`,
        { newName }
      );
      setSections((prevSections) =>
        prevSections.map((section) =>
          section.sectionId === sectionId
            ? {
                ...section,
                lessons: section.lessons.map((lesson) =>
                  lesson.lessonId === lessonId
                    ? { ...lesson, name: newName }
                    : lesson
                ),
              }
            : section
        )
      );
    });

  // Delete a Lesson
  const deleteLesson = (sectionId, lessonId) =>
    withLoading(async () => {
      await axiosPublic.delete(
        `/course/${courseId}/section/${sectionId}/lesson/${lessonId}`
      );
      setSections((prevSections) =>
        prevSections.map((section) =>
          section.sectionId === sectionId
            ? {
                ...section,
                lessons: section.lessons.filter(
                  (lesson) => lesson.lessonId !== lessonId
                ),
              }
            : section
        )
      );
    });

  // Select a Lesson
  const selectLesson = (sectionId, lessonId) => {
    const section = sections.find((section) => section.sectionId === sectionId);

    if (section) {
      const selected = section.lessons.find(
        (lesson) => lesson.lessonId === lessonId
      );
      setSelectedLesson(selected || null);

      // navigate(`../edit-course/${courseId}/lesson/${lessonId}`);
    } else {
      setSelectedLesson(null);
    }
  };

  return (
    <div className={`flex ${loading ? "cursor-wait" : ""}`}>
      {/* Sidebar */}
      <nav className="w-full h-full border-r bg-white space-y-8 overflow-auto sm:w-80">
        <div className="text-[0.9rem] space-y-6 mr-5">
          <button
            onClick={addSection}
            className="bg-indigo-500 text-white px-4 py-2 rounded w-full"
            disabled={loading}
          >
            + Add Section
          </button>
          <SectionsList
            sections={sections}
            onRenameSection={renameSection}
            onDeleteSection={deleteSection}
            onAddLesson={addLesson}
            onRenameLesson={renameLesson}
            onDeleteLesson={deleteLesson}
            onSelectLesson={selectLesson}
          />
        </div>
      </nav>

      {/* Right Panel */}
      <main className="flex-1 overflow-auto">
        <LessonDetails lesson={selectedLesson} />
      </main>
    </div>
  );
};

export default EditContent;
