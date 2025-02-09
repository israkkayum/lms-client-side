import { useState } from "react";
import useAxiosPublic from "../../../hooks/useAxiosPublic";

const EditVideo = ({ lesson }) => {
  const { title, data } = lesson.content;
  const { courseId, sectionId, lessonId } = lesson;

  const axiosPublic = useAxiosPublic();

  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const [uploadMessage, setUploadMessage] = useState("");

  const [isContentVisible, setIsContentVisible] = useState(true);

  const handleTitleChange = async () => {
    try {
      const response = await axiosPublic.patch(
        `/course/${courseId}/section/${sectionId}/lesson/${lessonId}/content`,
        { title: newTitle }
      );
      setUploadMessage(response.data.message || "Title updated successfully!");
      setIsEditingTitle(false);
    } catch (error) {
      console.error("Error updating title:", error);
      setUploadMessage(
        error.response?.data?.error ||
          "An error occurred while updating the title."
      );
    }
  };

  const deleteContent = async () => {
    setIsDeleting(true);
    try {
      const response = await axiosPublic.delete(
        `/course/${courseId}/section/${sectionId}/lesson/${lessonId}/content`
      );
      console.log(response.data.message || "Lesson deleted successfully!");
      setIsContentVisible(false);
    } catch (error) {
      console.error("Error deleting lesson:", error);
      alert("An error occurred while deleting the lesson.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isContentVisible) {
    return (
      <div className="my-10 text-center">
        <p className="text-gray-500">Content has been deleted.</p>
      </div>
    );
  }

  return (
    <div className="my-10">
      <div className="mx-auto w-full max-w-[700px] bg-white">
        <>
          <iframe
            className="h-[400px] w-full rounded-lg"
            autoPlay
            src={`data:video/mp4;base64,${data}`}
            type="video/mp4"
          />
        </>
        <div className="mt-5 ">
          {isEditingTitle ? (
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onBlur={handleTitleChange}
              className="border border-gray-300 rounded-md px-2 py-1 w-full"
              autoFocus
            />
          ) : (
            <p
              className="block text-lg font-medium text-black leading-8"
              onDoubleClick={() => setIsEditingTitle(true)}
              title="Double-click to edit"
            >
              {newTitle}
            </p>
          )}
        </div>
        {uploadMessage && (
          <p
            className={`mt-4 text-sm ${
              uploadMessage.includes("error")
                ? "text-red-600"
                : "text-green-600"
            }`}
          >
            {uploadMessage}
          </p>
        )}
      </div>
      <div className="flex items-center justify-center mt-20">
        <button
          type="button"
          className="inline-flex w-full justify-center rounded-md bg-red-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
          onClick={deleteContent}
        >
          {isDeleting ? "Deleting..." : "Delete Content"}
        </button>
      </div>
    </div>
  );
};

export default EditVideo;
