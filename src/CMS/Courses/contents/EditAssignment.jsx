import { useState, useEffect } from "react";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import { Editor } from "@tinymce/tinymce-react";
import { useForm, Controller } from "react-hook-form";

const EditAssignment = ({ lesson }) => {
  const { title, description } = lesson.content;
  const { courseId, sectionId, lessonId } = lesson;

  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState("");
  const [isDeleted, setIsDeleted] = useState(false);

  const axiosPublic = useAxiosPublic();

  const { control, handleSubmit, reset, setValue } = useForm({
    defaultValues: { title, description },
  });

  useEffect(() => {
    if (isEditing) {
      reset({ title, description });
      setMessage("");
    }
  }, [isEditing, reset, title, description]);

  const handleEdit = async (data) => {
    try {
      const response = await axiosPublic.patch(
        `/course/${courseId}/section/${sectionId}/lesson/${lessonId}/content`,
        { title: data.title, description: data.description, type: "assignment" }
      );

      setMessage(response.data.message || "Assignment updated successfully!");
      setIsEditing(false);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error updating assignment.");
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axiosPublic.delete(
        `/course/${courseId}/section/${sectionId}/lesson/${lessonId}/content`
      );

      setMessage(response.data.message || "Assignment deleted successfully!");
      setIsDeleting(false);
      setIsDeleted(true);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error deleting assignment.");
    }
  };

  const enterEditMode = () => {
    setIsEditing(true);
  };

  const cancelEditMode = () => {
    setIsEditing(false);
    setMessage("");
  };

  if (isDeleted) {
    return (
      <div className="bg-gray-50 p-6 rounded-md">
        <div className="p-3 rounded-md bg-green-100 text-green-700">
          Assignment has been deleted successfully.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-6 rounded-md">
      {message && (
        <div className="mb-4 p-3 rounded-md bg-green-100 text-green-700">
          {message}
        </div>
      )}

      {isDeleting ? (
        <div className="bg-red-50 p-4 rounded-md mb-4">
          <p className="text-red-600 mb-4">
            Are you sure you want to delete this assignment?
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
      ) : isEditing ? (
        <form onSubmit={handleSubmit(handleEdit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assignment Title
            </label>
            <Controller
              name="title"
              control={control}
              rules={{ required: "Title is required" }}
              render={({ field, fieldState: { error } }) => (
                <>
                  <input
                    {...field}
                    type="text"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                  />
                  {error && (
                    <p className="text-red-500 text-sm mt-1">{error.message}</p>
                  )}
                </>
              )}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assignment Description
            </label>
            <Controller
              name="description"
              control={control}
              rules={{ required: "Description is required" }}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <>
                  <Editor
                    apiKey="j16dob6t2wqd6tlj8jgjd5b46jnn37755eeqhemhbzi7pucz"
                    value={value}
                    init={{
                      height: 300,
                      menubar: false,
                      plugins: [
                        "advlist autolink lists link image charmap print preview anchor",
                        "searchreplace visualblocks code fullscreen",
                        "insertdatetime media table paste code help wordcount",
                      ],
                      toolbar:
                        "undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
                    }}
                    onEditorChange={(newValue) => {
                      setValue("description", newValue);
                      onChange(newValue);
                    }}
                  />
                  {error && (
                    <p className="text-red-500 text-sm mt-1">{error.message}</p>
                  )}
                </>
              )}
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={cancelEditMode}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assignment Title
            </label>
            <p className="text-gray-900">{title}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assignment Description
            </label>
            <div
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={enterEditMode}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => {
                setMessage("");
                setIsDeleting(true);
              }}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditAssignment;
