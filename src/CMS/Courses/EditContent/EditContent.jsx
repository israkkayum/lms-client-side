import { useState } from "react";

// Editable Component for Sections and Lessons
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
}) => (
  <div className="text-gray-600">
    <ul>
      {sections.map((section) => (
        <li key={section.id} className="mb-6">
          {/* Section Header */}
          <div className="flex justify-between items-center">
            <EditableText
              value={section.title}
              onChange={(newTitle) => onRenameSection(section.id, newTitle)}
              className="pb-3 font-medium text-gray-800"
            />
            <button
              onClick={() => onDeleteSection(section.id)}
              className="text-red-500 text-sm"
            >
              ✕
            </button>
          </div>

          {/* Lessons List */}
          <ul className="pl-4">
            {section.lessons.map((lesson, idx) => (
              <li key={idx} className="flex items-center">
                <EditableText
                  value={lesson.name}
                  onChange={(newName) =>
                    onRenameLesson(section.id, idx, newName)
                  }
                  className="block w-full py-2 px-4 border-l hover:border-indigo-600 hover:text-gray-900 duration-150"
                />
                <button
                  onClick={() => onDeleteLesson(section.id, idx)}
                  className="text-red-500 ml-2 text-sm"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>

          {/* Add Lesson Button */}
          <button
            onClick={() => onAddLesson(section.id)}
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
const EditContent = () => {
  const [sections, setSections] = useState([]);

  // Add a New Section
  const addSection = () => {
    setSections([
      ...sections,
      { id: Date.now(), title: "New Section", lessons: [] },
    ]);
  };

  // Rename a Section
  const renameSection = (id, newName) => {
    setSections(
      sections.map((section) =>
        section.id === id ? { ...section, title: newName } : section
      )
    );
  };

  // Delete a Section
  const deleteSection = (id) => {
    setSections(sections.filter((section) => section.id !== id));
  };

  // Add a Lesson to a Section
  const addLesson = (sectionId) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              lessons: [...section.lessons, { name: "New Lesson" }],
            }
          : section
      )
    );
  };

  // Rename a Lesson
  const renameLesson = (sectionId, lessonIdx, newName) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              lessons: section.lessons.map((lesson, idx) =>
                idx === lessonIdx ? { ...lesson, name: newName } : lesson
              ),
            }
          : section
      )
    );
  };

  // Delete a Lesson
  const deleteLesson = (sectionId, lessonIdx) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              lessons: section.lessons.filter((_, idx) => idx !== lessonIdx),
            }
          : section
      )
    );
  };

  return (
    <nav className="w-full h-full border-r bg-white space-y-8 overflow-auto sm:w-80">
      <div className="text-[0.9rem] space-y-6 mr-5">
        <button
          onClick={addSection}
          className="bg-indigo-500 text-white px-4 py-2 rounded w-full"
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
        />
      </div>
    </nav>
  );
};

export default EditContent;
