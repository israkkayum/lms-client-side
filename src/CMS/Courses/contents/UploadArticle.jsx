import { Editor } from "@tinymce/tinymce-react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import useAxiosPublic from "../../../hooks/useAxiosPublic";

const UploadArticle = ({ lesson }) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm();
  const courseId = lesson.courseId;
  const sectionId = lesson.sectionId;
  const lessonId = lesson.lessonId;

  const axiosPublic = useAxiosPublic();

  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("type", "article");
    formData.append("content", data.content);

    try {
      setIsUploading(true);
      setUploadMessage("");

      const response = await axiosPublic.post(
        `/course/${courseId}/section/${sectionId}/lesson/${lessonId}/article`,
        formData
      );

      setUploadMessage(
        response.data.message || "Article uploaded successfully!"
      );
      reset();
    } catch (error) {
      setUploadMessage(
        error.response?.data?.message || "Error uploading article."
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-gray-50 p-10 rounded-md"
    >
      <div className="col-span-full mb-5">
        <label
          htmlFor="title"
          className="block text-sm/6 font-medium text-gray-900"
        >
          Article Title
        </label>
        <div className="mt-2">
          <input
            id="title"
            {...register("title", { required: "Title is required" })}
            type="text"
            className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-1 focus:outline-indigo-600 sm:text-sm/6"
          />
          {errors.title && (
            <p className="mt-2 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>
      </div>

      <div className="col-span-full mb-5">
        <label
          htmlFor="content"
          className="block text-sm/6 font-medium text-gray-900"
        >
          Article Content
        </label>
        <div className="mt-2">
          <Editor
            id="content"
            apiKey="j16dob6t2wqd6tlj8jgjd5b46jnn37755eeqhemhbzi7pucz"
            initialValue=""
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
                bullist numlist outdent indent | removeformat | link image | help",
            }}
            onEditorChange={(content) => setValue("content", content)}
          />
          <input
            type="hidden"
            {...register("content", {
              required: "Content is required",
            })}
            value={watch("content") || ""}
          />
          {errors.content && (
            <p className="mt-2 text-sm text-red-600">
              {errors.content.message}
            </p>
          )}
        </div>
      </div>

      {uploadMessage && (
        <div
          className={`p-4 mb-4 rounded ${
            uploadMessage.includes("error") || uploadMessage.includes("Error")
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {uploadMessage}
        </div>
      )}

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="button"
          onClick={() => reset()}
          className="text-sm/6 font-semibold text-gray-900"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isUploading}
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          {isUploading ? "Uploading..." : "Submit Article"}
        </button>
      </div>
    </form>
  );
};

export default UploadArticle;
