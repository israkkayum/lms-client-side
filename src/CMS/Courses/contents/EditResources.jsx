import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import useAxiosPublic from "../../../hooks/useAxiosPublic";

const EditResources = ({ lesson }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm();

  const { courseId, sectionId, lessonId } = lesson;
  const axiosPublic = useAxiosPublic();

  const [files, setFiles] = useState([]);
  const [existingFiles, setExistingFiles] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    setValue("title", lesson.content.title);
    setExistingFiles(lesson.content.files || []);
  }, [lesson, setValue]);

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    if (selectedFiles.length > 0) {
      setFiles((prev) => [...prev, ...selectedFiles]);
      setUploadProgress(0);
    }
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingFile = (index) => {
    setExistingFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeAllFiles = () => {
    setFiles([]);
    setUploadProgress(0);
    setIsUpdating(false);
    setUpdateMessage("");
  };

  const onSubmit = async (data) => {
    if (files.length === 0 && existingFiles.length === 0) {
      alert("Please upload at least one resource file or keep existing files.");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });
    formData.append("type", "resource");
    formData.append("title", data.title);

    // Add existing files to keep
    formData.append("existingFiles", JSON.stringify(existingFiles));

    try {
      setIsUpdating(true);
      setUpdateMessage("");

      const response = await axiosPublic.patch(
        `/course/${courseId}/section/${sectionId}/lesson/${lessonId}/content`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        }
      );

      setUpdateMessage(
        response.data.message || "Resources updated successfully!"
      );
      setFiles([]);
    } catch (error) {
      console.error("Error updating resources:", error);
      setUpdateMessage(
        error.response?.data?.message || "Error updating resources."
      );
    } finally {
      setIsUpdating(false);
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
          Resource Group Title
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

      {existingFiles.length > 0 && (
        <div className="mt-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-gray-900">
              Existing Files ({existingFiles.length})
            </h3>
          </div>

          <div className="space-y-2">
            {existingFiles.map((file, index) => (
              <div
                key={index}
                className="p-3 bg-white border border-solid border-gray-300 rounded-xl"
              >
                <div className="mb-1 flex justify-between items-center">
                  <div className="flex items-center gap-x-3">
                    <span className="size-10 flex justify-center items-center border border-gray-200 text-gray-500 rounded-lg">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                        />
                      </svg>
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {file.filename}
                      </p>
                      <p className="text-xs text-gray-500">
                        {file.filesize
                          ? `${(file.filesize / 1024 / 1024).toFixed(2)} MB`
                          : ""}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="text-gray-500 hover:text-gray-800 focus:outline-none"
                    onClick={() => removeExistingFile(index)}
                  >
                    <svg
                      className="shrink-0 size-4"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 6h18"></path>
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                      <line x1="10" x2="10" y1="11" y2="17"></line>
                      <line x1="14" x2="14" y1="11" y2="17"></line>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div
        className="cursor-pointer p-12 flex justify-center bg-white border border-dashed border-gray-300 rounded-xl"
        onClick={() => document.getElementById("file-input").click()}
      >
        <div className="text-center">
          <span className="inline-flex justify-center items-center size-16 bg-gray-100 text-gray-800 rounded-full">
            <svg
              className="shrink-0 size-6"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" x2="12" y1="3" y2="15"></line>
            </svg>
          </span>
          <div className="mt-4 flex flex-wrap justify-center text-sm leading-6 text-gray-600">
            <span className="pe-1 font-medium text-gray-800">
              Add new files here or
            </span>
            <span className="bg-white font-semibold text-blue-600 hover:text-blue-700 rounded-lg decoration-2 hover:underline">
              browse
            </span>
          </div>
          <p className="mt-1 text-xs text-gray-400">
            Upload PDF, DOC, PPT, or other resource files.
          </p>
        </div>
      </div>

      <input
        id="file-input"
        type="file"
        className="hidden"
        onChange={handleFileChange}
        multiple
      />

      {files.length > 0 && (
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-gray-900">
              New Files ({files.length})
            </h3>
            <button
              type="button"
              className="text-sm text-red-600 hover:text-red-800"
              onClick={removeAllFiles}
            >
              Remove All New Files
            </button>
          </div>

          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="p-3 bg-white border border-solid border-gray-300 rounded-xl"
              >
                <div className="mb-1 flex justify-between items-center">
                  <div className="flex items-center gap-x-3">
                    <span className="size-10 flex justify-center items-center border border-gray-200 text-gray-500 rounded-lg">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                        />
                      </svg>
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="text-gray-500 hover:text-gray-800 focus:outline-none"
                    onClick={() => removeFile(index)}
                  >
                    <svg
                      className="shrink-0 size-4"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 6h18"></path>
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                      <line x1="10" x2="10" y1="11" y2="17"></line>
                      <line x1="14" x2="14" y1="11" y2="17"></line>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isUpdating && (
        <div className="mt-4">
          <div className="flex items-center gap-x-3 whitespace-nowrap">
            <div
              className="flex w-full h-2 bg-gray-200 rounded-full overflow-hidden"
              role="progressbar"
              aria-valuenow={uploadProgress}
              aria-valuemin="0"
              aria-valuemax="100"
            >
              <div
                className={`flex flex-col justify-center rounded-full overflow-hidden ${
                  uploadProgress < 100 ? "bg-blue-600" : "bg-green-500"
                } text-xs text-white text-center whitespace-nowrap transition-all duration-500`}
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <div className="w-10 text-end">
              <span className="text-sm text-gray-800">{uploadProgress}%</span>
            </div>
          </div>
        </div>
      )}

      {updateMessage && (
        <div
          className={`p-4 mt-4 mb-4 rounded ${
            updateMessage.includes("error") || updateMessage.includes("Error")
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {updateMessage}
        </div>
      )}

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="button"
          onClick={() => {
            reset();
            removeAllFiles();
          }}
          className="text-sm/6 font-semibold text-gray-900"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isUpdating}
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-indigo-300"
        >
          {isUpdating ? "Updating..." : "Update Resources"}
        </button>
      </div>
    </form>
  );
};

export default EditResources;
