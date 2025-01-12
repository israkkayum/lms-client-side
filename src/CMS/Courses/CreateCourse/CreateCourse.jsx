import { PhotoIcon } from "@heroicons/react/24/solid";
import { Editor } from "@tinymce/tinymce-react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import { useNavigate, useOutletContext } from "react-router-dom";

const CreateCourse = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();
  const { siteData } = useOutletContext();

  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  const [success, setSuccess] = useState(false);
  const [messageActive, setMessageActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    setIsLoading(true);
    setMessageActive(false);
    try {
      const formData = new FormData();
      formData.append("courseName", data.courseName);
      formData.append("courseDescription", data.courseDescription);
      formData.append("courseCategory", data.courseCategory);
      formData.append(
        "courseTags",
        JSON.stringify(data.courseTags.split(",").map((tag) => tag.trim()))
      );
      formData.append("thumbnail", thumbnail);
      formData.append("origin", siteData?._id);
      formData.append("date", new Date().toDateString());

      const response = await axiosPublic.post("/courses", formData);
      if (response.data.acknowledged) {
        setSuccess(true);
        setTimeout(() => navigate("../my-courses"), 2000);
      } else {
        setSuccess(false);
      }
    } catch (error) {
      // console.error("Failed to update site settings:", error);
      setSuccess(false);
    } finally {
      setMessageActive(true);
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    reset();
    setThumbnail(null);
    setThumbnailPreview(null);
    setMessageActive(false);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 my-20">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base/7 font-semibold text-gray-900">
              Add a new course
            </h2>
            <p className="mt-1 text-sm/6 text-gray-600">
              This information will be displayed publicly, so be careful what
              you share.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              {/* Course Name */}
              <div className="sm:col-span-4">
                <label
                  htmlFor="course-name"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Course Name
                </label>
                <div className="mt-2">
                  <input
                    {...register("courseName", {
                      required: "Course name is required",
                    })}
                    id="course-name"
                    type="text"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                  />
                  {errors.courseName && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.courseName.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Course Description */}
              <div className="col-span-full">
                <label
                  htmlFor="course-description"
                  className="mb-2.5 block text-sm font-medium text-gray-900"
                >
                  Course Description
                </label>
                <Editor
                  id="courseDescription"
                  apiKey="j16dob6t2wqd6tlj8jgjd5b46jnn37755eeqhemhbzi7pucz"
                  //   initialValue={siteData?.siteSummary || ""}
                  init={{
                    height: 200,
                    menubar: false,
                    plugins: [
                      "advlist autolink lists link image charmap print preview anchor",
                      "searchreplace visualblocks code fullscreen",
                      "insertdatetime media table paste code help wordcount",
                    ],
                    toolbar:
                      "undo redo | formatselect | bold italic backcolor | \
                      alignleft aligncenter alignright alignjustify | \
                      bullist numlist outdent indent | removeformat | help",
                  }}
                  onEditorChange={(content) =>
                    setValue("courseDescription", content)
                  }
                />
                <input
                  type="hidden"
                  {...register("courseDescription", {
                    required: "Course description is required",
                  })}
                  value={watch("courseDescription") || ""}
                />
                {errors.courseDescription && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.courseDescription.message}
                  </p>
                )}
              </div>

              {/* Course Category */}
              <div className="sm:col-span-3">
                <label
                  htmlFor="course-category"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Course Category
                </label>
                <div className="mt-2">
                  <input
                    {...register("courseCategory", {
                      required: "Course category is required",
                    })}
                    id="course-category"
                    type="text"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                  />
                  {errors.courseCategory && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.courseCategory.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Course Tags */}
              <div className="sm:col-span-3">
                <label
                  htmlFor="course-tags"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Course Tags
                </label>
                <div className="mt-2">
                  <input
                    {...register("courseTags")}
                    id="course-tags"
                    type="text"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                  />
                </div>
              </div>

              {/* thumbnail */}
              <div className="col-span-full">
                <label
                  htmlFor="thumbnail"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Thumbnail
                </label>
                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                  <div className="text-center">
                    {thumbnailPreview ? (
                      <img
                        className="mx-auto h-100 w-100 text-gray-300"
                        src={thumbnailPreview}
                        alt=""
                      />
                    ) : (
                      <PhotoIcon
                        aria-hidden="true"
                        className="mx-auto size-12 text-gray-300"
                      />
                    )}
                    <div className="mt-4 flex justify-center text-sm/6 text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                      >
                        <span>Upload a file</span>
                        <input
                          {...register("thumbnail", {
                            required: "Thumbnail is required",
                          })}
                          id="file-upload"
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            setThumbnail(file);
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () =>
                                setThumbnailPreview(reader.result);
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs/5 text-gray-600">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>
                {errors.thumbnail && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.thumbnail.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Submit and Feedback */}
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="button"
            className="text-sm font-semibold text-gray-900"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className={`rounded-md px-3 py-2 text-sm font-semibold shadow-sm focus:ring-2 focus:ring-offset-2 ${
              isLoading
                ? "bg-gray-500"
                : "bg-indigo-600 text-white hover:bg-indigo-500"
            }`}
          >
            {isLoading ? "Creating..." : "Create"}
          </button>
        </div>
        {messageActive && (
          <div
            className={`mt-4 rounded-lg p-4 ${
              success ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
            }`}
          >
            {success
              ? "Course created successfully! Redirecting to My Courses..."
              : "An error occurred. Please try again."}
          </div>
        )}
      </form>
    </div>
  );
};

export default CreateCourse;
