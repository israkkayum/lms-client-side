import { useState } from "react";

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
              <li
                key={idx}
                className="flex items-center"
                onClick={() => onSelectLesson(section.id, idx)}
              >
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

// Lesson Details Panel Component
// const LessonDetails = ({ lesson }) => {
//   if (!lesson) {
//     return (
//       <div className="text-gray-500 text-center my-20">
//         Select a lesson to view its details.
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 space-y-4 pt-2">
//       <h3 className="text-xl font-semibold text-gray-800 mb-4 pl-3">
//         {lesson.name}
//       </h3>
//       <div className="space-y-4">
//         <section className="text-gray-600 body-font">
//           <div className="container px-5 py-10 mx-auto">
//             <div className="flex flex-wrap -m-4 text-center">
//               <div className="p-2 md:w-1/4 sm:w-1/2 w-full">
//                 <div className="border-2 border-gray-200 px-2 py-4 rounded-lg">
//                   <svg
//                     fill="none"
//                     stroke="currentColor"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="1"
//                     className="text-indigo-500 w-10 h-10 mb-3 inline-block"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"
//                     />
//                   </svg>

//                   <p className="leading-relaxed">Video</p>
//                 </div>
//               </div>
//               <div className="p-2 md:w-1/4 sm:w-1/2 w-full">
//                 <div className="border-2 border-gray-200 px-2 py-4 rounded-lg">
//                   <svg
//                     fill="none"
//                     stroke="currentColor"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="1"
//                     className="text-indigo-500 w-10 h-10 mb-3 inline-block"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12-3-3m0 0-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
//                     />
//                   </svg>

//                   <p className="leading-relaxed">Assignment</p>
//                 </div>
//               </div>
//               <div className="p-2 md:w-1/4 sm:w-1/2 w-full">
//                 <div className="border-2 border-gray-200 px-2 py-4 rounded-lg">
//                   <svg
//                     fill="none"
//                     stroke="currentColor"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="1"
//                     className="text-indigo-500 w-10 h-10 mb-3 inline-block"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
//                     />
//                   </svg>

//                   <p className="leading-relaxed">Articles</p>
//                 </div>
//               </div>
//               <div className="p-2 md:w-1/4 sm:w-1/2 w-full">
//                 <div className="border-2 border-gray-200 px-2 py-4 rounded-lg">
//                   <svg
//                     fill="none"
//                     stroke="currentColor"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="1"
//                     className="text-indigo-500 w-10 h-10 mb-3 inline-block"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       d="M7.5 7.5h-.75A2.25 2.25 0 0 0 4.5 9.75v7.5a2.25 2.25 0 0 0 2.25 2.25h7.5a2.25 2.25 0 0 0 2.25-2.25v-7.5a2.25 2.25 0 0 0-2.25-2.25h-.75m-6 3.75 3 3m0 0 3-3m-3 3V1.5m6 9h.75a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25h-7.5a2.25 2.25 0 0 1-2.25-2.25v-.75"
//                     />
//                   </svg>

//                   <p className="leading-relaxed">Resources</p>
//                 </div>
//               </div>
//               <div className="p-2 md:w-1/4 sm:w-1/2 w-full">
//                 <div className="border-2 border-gray-200 px-2 py-4 rounded-lg">
//                   <svg
//                     fill="none"
//                     stroke="currentColor"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="1"
//                     className="text-indigo-500 w-10 h-10 mb-3 inline-block"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0"
//                     />
//                   </svg>

//                   <p className="leading-relaxed">Quiz</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// };

// Main Sidebar Component
const EditContent = ({ course, isLoading }) => {
  console.log(course, isLoading);
  const [sections, setSections] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);

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
              lessons: [
                ...section.lessons,
                { name: "New Lesson", options: {} },
              ],
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

  // Select a Lesson
  const selectLesson = (sectionId, lessonIdx) => {
    const selected = sections.find((section) => section.id === sectionId)
      ?.lessons[lessonIdx];
    setSelectedLesson(selected || null);
  };

  return (
    <div className="flex">
      {/* Sidebar */}
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
            onSelectLesson={selectLesson}
          />
        </div>
      </nav>

      {/* Right Panel */}
      {/* <main className="flex-1 overflow-auto">
        <LessonDetails lesson={selectedLesson} />
      </main> */}
    </div>
  );
};

export default EditContent;
