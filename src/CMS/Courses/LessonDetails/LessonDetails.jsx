import { useEffect, useState } from "react";
import EditVideo from "../contents/EditVideo";
import UploadVideo from "../contents/UploadVideo";

const LessonDetails = ({ lesson }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeOption, setActiveOption] = useState(null);

  useEffect(() => {
    setActiveOption(null);
  }, [lesson]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOutsideClick = () => {
    setIsOpen(false);
  };

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".dropdown-container")) {
        handleOutsideClick();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const renderOptionContent = () => {
    switch (activeOption) {
      case "video":
        return <UploadVideo lesson={lesson} />;

      case "assignment":
        return (
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-lg font-medium mb-2">Create Assignment</h3>
            <textarea
              placeholder="Write instructions..."
              className="w-full p-2 mb-3 border border-gray-300 rounded-md"
              rows="4"
            ></textarea>
            <button className="bg-red-500 text-white px-4 py-2 rounded-md">
              Save
            </button>
          </div>
        );

      case "articles":
        return (
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-lg font-medium mb-2">Write Article</h3>
            <textarea
              placeholder="Write your article here..."
              className="w-full p-2 mb-3 border border-gray-300 rounded-md"
              rows="6"
            ></textarea>
            <button className="bg-green-500 text-white px-4 py-2 rounded-md">
              Publish
            </button>
          </div>
        );

      case "resources":
        return (
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-lg font-medium mb-2">Upload Resources</h3>
            <input
              type="file"
              multiple
              className="w-full p-2 mb-3 border border-gray-300 rounded-md"
            />
            <button className="bg-yellow-500 text-white px-4 py-2 rounded-md">
              Upload
            </button>
          </div>
        );

      case "quiz":
        return (
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-lg font-medium mb-2">Create Quiz</h3>
            <input
              type="text"
              placeholder="Enter Quiz Title"
              className="w-full p-2 mb-3 border border-gray-300 rounded-md"
            />
            <textarea
              placeholder="Enter questions here..."
              className="w-full p-2 mb-3 border border-gray-300 rounded-md"
              rows="4"
            ></textarea>
            <button className="bg-purple-500 text-white px-4 py-2 rounded-md">
              Save Quiz
            </button>
          </div>
        );

      default:
        return (
          <div className="text-gray-500 text-center my-10">
            Select an option from the dropdown to get started.
          </div>
        );
    }
  };

  if (!lesson) {
    return (
      <div className="text-gray-500 text-center my-20">
        Select a lesson to view its details.
      </div>
    );
  }

  return (
    <>
      <div className="p-6 space-y-4 pt-2">
        <div className="flex flex-col items-center justify-between border-b border-stroke dark:border-dark-3 md:flex-row">
          {/* Heading Section */}
          <div className="mb-6 w-full">
            <h2 className="mb-2 text-xl font-semibold">{lesson.name}</h2>
          </div>

          {/* Button Section */}
          <div className="mb-6">
            <div className="relative inline-block dropdown-container">
              {/* Dropdown Button */}
              <button
                className="inline-flex items-center justify-center whitespace-nowrap rounded bg-indigo-500 px-5 py-[10px] text-sm font-medium text-white hover:bg-opacity-90"
                onClick={toggleDropdown}
                disabled={lesson.content ? true : false}
              >
                Add New Item
                <span className="pl-2">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M8.99961 2.39961C5.35453 2.39961 2.39961 5.35453 2.39961 8.99961C2.39961 12.6447 5.35453 15.5996 8.99961 15.5996C12.6447 15.5996 15.5996 12.6447 15.5996 8.99961C15.5996 5.35453 12.6447 2.39961 8.99961 2.39961ZM0.599609 8.99961C0.599609 4.36042 4.36042 0.599609 8.99961 0.599609C13.6388 0.599609 17.3996 4.36042 17.3996 8.99961C17.3996 13.6388 13.6388 17.3996 8.99961 17.3996C4.36042 17.3996 0.599609 13.6388 0.599609 8.99961Z"
                      fill="white"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M8.99961 5.09961C9.49667 5.09961 9.89961 5.50255 9.89961 5.99961V11.99961C9.89961 12.4967 9.49667 12.89961 8.99961 12.89961C8.50255 12.89961 8.09961 12.4967 8.09961 11.99961V5.99961C8.09961 5.50255 8.50255 5.09961 8.99961 5.09961Z"
                      fill="white"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M5.09961 8.99961C5.09961 8.50255 5.50255 8.09961 5.99961 8.09961H11.99961C12.4967 8.09961 12.89961 8.50255 12.89961 8.99961C12.89961 9.49667 12.4967 9.89961 11.99961 9.89961H5.99961C5.50255 9.89961 5.09961 9.49667 5.09961 8.99961Z"
                      fill="white"
                    />
                  </svg>
                </span>
              </button>

              {/* Dropdown Menu */}
              {isOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded shadow-lg z-10">
                  <ul className="py-1 text-sm text-gray-700">
                    <li>
                      <button
                        className="flex items-center px-4 py-2 hover:bg-gray-100 w-full text-left"
                        onClick={() => setActiveOption("video")}
                      >
                        <span className="mr-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-blue-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"
                            />
                          </svg>
                        </span>
                        Video
                      </button>
                    </li>
                    <li>
                      <button
                        className="flex items-center px-4 py-2 hover:bg-gray-100 w-full text-left"
                        onClick={() => setActiveOption("assignment")}
                      >
                        <span className="mr-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-red-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12-3-3m0 0-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                            />
                          </svg>
                        </span>
                        Assignment
                      </button>
                    </li>
                    <li>
                      <button
                        className="flex items-center px-4 py-2 hover:bg-gray-100 w-full text-left"
                        onClick={() => setActiveOption("articles")}
                      >
                        <span className="mr-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-green-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 16h8M8 12h4M4 8h16M4 6h16M4 4h16"
                            />
                          </svg>
                        </span>
                        Article
                      </button>
                    </li>
                    <li>
                      <button
                        className="flex items-center px-4 py-2 hover:bg-gray-100 w-full text-left"
                        onClick={() => setActiveOption("resources")}
                      >
                        <span className="mr-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-yellow-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 7h18M9 15h6M10 11h4M4 5a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V7a2 2 0 00-2-2H4z"
                            />
                          </svg>
                        </span>
                        Resources
                      </button>
                    </li>
                    <li>
                      <button
                        className="flex items-center px-4 py-2 hover:bg-gray-100 w-full text-left"
                        onClick={() => setActiveOption("quiz")}
                      >
                        <span className="mr-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-purple-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0"
                            />
                          </svg>
                        </span>
                        Quiz
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-4">
          {!lesson?.content ? (
            <>{renderOptionContent()}</>
          ) : (
            <EditVideo lesson={lesson} />
          )}
        </div>
      </div>
    </>
  );
};

export default LessonDetails;
