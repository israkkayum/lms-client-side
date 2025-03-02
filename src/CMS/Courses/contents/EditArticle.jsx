import { useState } from "react";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import { Editor } from "@tinymce/tinymce-react";

const EditArticle = ({ lesson }) => {
  const { title, content } = lesson.content;
  const { courseId, sectionId, lessonId } = lesson;
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedContent, setEditedContent] = useState(content);
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState("");
  const [currentTitle, setCurrentTitle] = useState(title);
  const [currentContent, setCurrentContent] = useState(content);
  const [isDeleted, setIsDeleted] = useState(false);

  const axiosPublic = useAxiosPublic();

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", editedTitle);
      formData.append("content", editedContent);

      const response = await axiosPublic.patch(
        `/course/${courseId}/section/${sectionId}/lesson/${lessonId}/content`,
        formData
      );

      setCurrentTitle(editedTitle);
      setCurrentContent(editedContent);

      setMessage(response.data.message || "Article updated successfully!");
      setIsEditing(false);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error updating article.");
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axiosPublic.delete(
        `/course/${courseId}/section/${sectionId}/lesson/${lessonId}/content`
      );

      setMessage(response.data.message || "Article deleted successfully!");
      setIsDeleting(false);
      setIsDeleted(true);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error deleting article.");
    }
  };

  if (isDeleted) {
    return (
      <div className="bg-gray-50 p-10 rounded-md">
        <div className="p-3 rounded-md bg-green-100 text-green-700">
          Article has been deleted successfully.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-10 rounded-md">
      {message && (
        <div className="mb-4 p-3 rounded-md bg-green-100 text-green-700">
          {message}
        </div>
      )}

      {isDeleting ? (
        <div className="bg-red-50 p-4 rounded-md mb-4">
          <p className="text-red-600 mb-4">
            Are you sure you want to delete this article?
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              Confirm Delete
            </button>
            <button
              onClick={() => setIsDeleting(false)}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleEdit} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Article Title
            </label>
            {isEditing ? (
              <input
                type="text"
                id="title"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
              />
            ) : (
              <p className="text-gray-900">{currentTitle}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Article Content
            </label>
            {isEditing ? (
              <Editor
                id="content"
                apiKey="j16dob6t2wqd6tlj8jgjd5b46jnn37755eeqhemhbzi7pucz"
                value={editedContent}
                init={{
                  height: 500,
                  menubar: true,
                  plugins: [
                    "advlist autolink lists link image charmap print preview anchor",
                    "searchreplace visualblocks code fullscreen",
                    "insertdatetime media table paste code help wordcount",
                  ],
                  toolbar:
                    "undo redo | formatselect | bold italic backcolor | \
                    alignleft aligncenter alignright alignjustify | \
                    bullist numlist outdent indent | removeformat | help",
                  auto_focus: true,
                  selection_restore: true,
                }}
                onEditorChange={(content) => setEditedContent(content)}
              />
            ) : (
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: currentContent }}
              />
            )}
          </div>

          <div className="flex justify-end gap-3">
            {isEditing ? (
              <>
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setEditedTitle(currentTitle);
                    setEditedContent(currentContent);
                  }}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => setIsDeleting(true)}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </form>
      )}
    </div>
  );
};

export default EditArticle;
