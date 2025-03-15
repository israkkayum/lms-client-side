import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { Editor } from "@tinymce/tinymce-react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";

const EditBlog = () => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const axiosPublic = useAxiosPublic();
  const { user } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Fetch the blog data to edit and check authorization
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const response = await axiosPublic.get(`/blogs/${id}`);
        const blog = response.data.blog;

        // Check if current user is the author
        if (user?.email !== blog.author) {
          // User is not the author, show error and redirect
          Swal.fire({
            title: "Unauthorized",
            text: "You don't have permission to edit this blog post",
            icon: "error",
            confirmButtonText: "Go Back",
          }).then(() => {
            navigate(`/blogs/${id}`);
          });
          return;
        }

        // User is authorized, set state and form values
        setIsAuthorized(true);

        // Set form values
        setValue("title", blog.title);
        setValue("category", blog.category);
        setValue("excerpt", blog.excerpt);
        setValue("content", blog.content);

        // Set image preview if available
        if (blog.image) {
          setImagePreview(`data:image/png;base64, ${blog.image}`);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching blog:", error);
        setMessage("Failed to load blog data. Please try again.");
        setLoading(false);
        // Redirect on error
        navigate("/blogs");
      }
    };

    if (id && user) {
      fetchBlog();
    } else if (!user) {
      // If user is not logged in, redirect to login
      Swal.fire({
        title: "Login Required",
        text: "You need to login to edit a blog post",
        icon: "warning",
        confirmButtonText: "Go to Login",
      }).then(() => {
        navigate("/login", { state: { from: `/edit-blog/${id}` } });
      });
    }
  }, [id, axiosPublic, setValue, user, navigate]);

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Create a preview URL for the selected image
      const previewURL = URL.createObjectURL(file);
      setImagePreview(previewURL);
    }
  };

  // Calculate estimated read time based on content length
  const calculateReadTime = (content) => {
    // Strip HTML tags to get plain text
    const plainText = content.replace(/<[^>]*>/g, "");
    // Average reading speed: 200 words per minute
    const words = plainText.split(/\s+/).length;
    const readTimeMinutes = Math.ceil(words / 200);
    return Math.max(1, readTimeMinutes); // Minimum 1 minute read time
  };

  const onSubmit = async (data) => {
    // Only allow submission if user is authorized
    if (!isAuthorized) {
      Swal.fire({
        title: "Unauthorized",
        text: "You don't have permission to edit this blog post",
        icon: "error",
        confirmButtonText: "Go Back",
      }).then(() => {
        navigate(`/blogs/${id}`);
      });
      return;
    }

    try {
      setIsSubmitting(true);
      setMessage("");

      // Create form data for submission
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("content", data.content);
      formData.append("category", data.category);
      formData.append("excerpt", data.excerpt);

      // Only append image if a new one was selected
      if (imageFile) {
        formData.append("image", imageFile);
      }

      formData.append("readTime", calculateReadTime(data.content));

      // Send data to the backend API
      const response = await axiosSecure.patch(`/blogs/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        setMessage("Blog post updated successfully!");

        // Navigate to the blog details page after a short delay
        setTimeout(() => {
          navigate(`/blogs/${id}`);
        }, 2000);
      }
    } catch (error) {
      console.error("Error updating blog post:", error);
      setMessage(
        error.response?.data?.message ||
          "Error updating blog post. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    );
  }

  // Don't render the form if user is not authorized
  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Edit Blog Post
        </h1>
        <p className="text-gray-600">
          Update your blog post with the latest information.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Blog Title
          </label>
          <input
            id="title"
            type="text"
            {...register("title", { required: "Title is required" })}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
            placeholder="Enter an engaging title"
          />
          {errors.title && (
            <p className="mt-2 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Category
          </label>
          <select
            id="category"
            {...register("category", { required: "Category is required" })}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
          >
            <option value="">Select a category</option>
            <option value="Education">Education</option>
            <option value="Technology">Technology</option>
            <option value="Programming">Programming</option>
            <option value="Career">Career</option>
            <option value="Learning">Learning</option>
            <option value="Other">Other</option>
          </select>
          {errors.category && (
            <p className="mt-2 text-sm text-red-600">
              {errors.category.message}
            </p>
          )}
        </div>

        {/* Excerpt/Summary */}
        <div>
          <label
            htmlFor="excerpt"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Excerpt/Summary
          </label>
          <textarea
            id="excerpt"
            {...register("excerpt", {
              required: "Excerpt is required",
              maxLength: {
                value: 200,
                message: "Excerpt should be less than 200 characters",
              },
            })}
            rows="3"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
            placeholder="Write a brief summary of your blog post (max 200 characters)"
          />
          {errors.excerpt && (
            <p className="mt-2 text-sm text-red-600">
              {errors.excerpt.message}
            </p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            {watch("excerpt")?.length || 0}/200 characters
          </p>
        </div>

        {/* Featured Image */}
        <div>
          <label
            htmlFor="image"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Featured Image
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              {imagePreview ? (
                <div className="mb-4">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="mx-auto h-64 w-full object-cover rounded-md"
                  />
                </div>
              ) : (
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="image-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                >
                  <span>
                    {imagePreview ? "Change image" : "Upload an image"}
                  </span>
                  <input
                    id="image-upload"
                    name="image-upload"
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
                {!imagePreview && <p className="pl-1">or drag and drop</p>}
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Blog Content
          </label>
          <Controller
            name="content"
            control={control}
            rules={{ required: "Content is required" }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <>
                <Editor
                  id="content"
                  apiKey="j16dob6t2wqd6tlj8jgjd5b46jnn37755eeqhemhbzi7pucz"
                  value={value || ""}
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
                    entity_encoding: "raw",
                    paste_data_images: true,
                    browser_spellcheck: true,
                    preserve_caret_position: true,
                  }}
                  onEditorChange={(newValue) => {
                    if (newValue !== value) {
                      setValue("content", newValue);
                      onChange(newValue);
                    }
                  }}
                />
                {error && (
                  <p className="mt-2 text-sm text-red-600">{error.message}</p>
                )}
              </>
            )}
          />
        </div>

        {/* Status Message */}
        {message && (
          <div
            className={`p-4 rounded ${
              message.includes("successfully")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate(`/blogs/${id}`)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Updating..." : "Update Blog Post"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBlog;
