import { useState } from "react";
import { useForm } from "react-hook-form";
import useAxiosPublic from "../../../hooks/useAxiosPublic";

const UploadVideo = ({ lesson }) => {
  const { register, handleSubmit, reset } = useForm();
  const courseId = lesson.courseId;
  const sectionId = lesson.sectionId;
  const lessonId = lesson.lessonId;

  const axiosPublic = useAxiosPublic();

  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith("video/")) {
        alert("Please upload only video files.");
        return;
      }
      setFile(selectedFile);
      setUploadProgress(0);
    }
  };

  const removeFile = () => {
    setFile(null);
    setUploadProgress(0);
    setIsUploading(false);
    setUploadMessage("");
  };

  const onSubmit = async (data) => {
    if (!file) {
      alert("Please upload a video file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "video");
    formData.append("title", data.title);

    try {
      setIsUploading(true);
      setUploadMessage("");
      const response = await axiosPublic.post(
        `/course/${courseId}/section/${sectionId}/lesson/${lessonId}/video`,
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

      setUploadMessage(response.data.message || "Upload successful!");
      setFile(null);
      reset();
    } catch (error) {
      console.error("Error uploading video:", error);
      setUploadMessage(
        error.response?.data?.error || "An error occurred during upload."
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
          Lesson title
        </label>
        <div className="mt-2">
          <input
            id="title"
            {...register("title", { required: "Title is required" })}
            type="text"
            className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-1 focus:outline-indigo-600 sm:text-sm/6"
          />
        </div>
      </div>

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
              Drop your file here or
            </span>
            <span className="bg-white font-semibold text-blue-600 hover:text-blue-700 rounded-lg decoration-2 hover:underline">
              browse
            </span>
          </div>
          <p className="mt-1 text-xs text-gray-400">
            Pick a video file up to 2MB.
          </p>
        </div>
      </div>

      <input
        id="file-input"
        type="file"
        accept="video/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {file && (
        <div className="mt-4 p-3 bg-white border border-solid border-gray-300 rounded-xl">
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
                <p className="text-sm font-medium text-gray-800">{file.name}</p>
                <p className="text-xs text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              type="button"
              className="text-gray-500 hover:text-gray-800 focus:outline-none"
              onClick={removeFile}
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

      {uploadMessage && (
        <p
          className={`mt-4 text-sm ${
            uploadMessage.includes("error") ? "text-red-600" : "text-green-600"
          }`}
        >
          {uploadMessage}
        </p>
      )}

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="button"
          onClick={removeFile}
          className="text-sm/6 font-semibold text-gray-900"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isUploading}
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          {isUploading ? "Uploading..." : "Submit Lesson"}
        </button>
      </div>
    </form>
  );
};

export default UploadVideo;
