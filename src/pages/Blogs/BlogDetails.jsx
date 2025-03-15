import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        setLoading(true);
        // Fetch blog details from the API
        const response = await axiosPublic.get(`/blogs/${id}`);
        setBlog(response.data.blog);
        // Set like count and check if user has liked the blog
        if (response.data.blog.likes) {
          setLikeCount(response.data.blog.likes);
          setIsLiked(
            Array.isArray(response.data.blog.likedBy) &&
              response.data.blog.likedBy.includes(user?.email)
          );
        }

        // Set related blogs from API response
        setRelatedBlogs(response.data.relatedBlogs || []);

        setError(null);
      } catch (err) {
        console.error("Error fetching blog details:", err);
        setError("Failed to load blog details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBlogDetails();
      // Scroll to top when blog changes
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [id, axiosPublic, user?.email]);

  // Handle like/unlike functionality
  const handleLikeToggle = async () => {
    if (!user) {
      Swal.fire({
        title: "Login Required",
        text: "You need to login to like this blog",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Login",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login", { state: { from: `/blogs/${id}` } });
        }
      });
      return;
    }

    try {
      const response = await axiosSecure.post(`/blogs/${id}/like`);
      if (response.status === 200) {
        setIsLiked(!isLiked);
        setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to like/unlike the blog",
        icon: "error",
      });
    }
  };

  // Handle blog deletion
  const handleDelete = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axiosSecure.delete(`/blogs/${id}`);
          if (response.status === 200) {
            Swal.fire({
              title: "Deleted!",
              text: "Your blog has been deleted.",
              icon: "success",
            });
            navigate("/blogs");
          }
        } catch (error) {
          console.error("Error deleting blog:", error);
          Swal.fire({
            title: "Error",
            text: "Failed to delete the blog",
            icon: "error",
          });
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6"
          role="alert"
        >
          <p>{error}</p>
          <Link
            to="/blogs"
            className="text-indigo-600 hover:text-indigo-800 font-medium mt-2 inline-block"
          >
            Return to Blogs
          </Link>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Blog not found
          </h3>
          <p className="text-gray-600 mb-4">
            The blog youre looking for doesnt exist or has been removed.
          </p>
          <Link
            to="/blogs"
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Return to Blogs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-7xl">
      {/* Back to blogs link */}
      <div className="mb-8">
        <Link
          to="/blogs"
          className="text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Blogs
        </Link>
      </div>

      {/* Blog header */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-sm font-semibold px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full">
            {blog.category}
          </span>
          <span className="text-sm text-gray-500">
            {new Date(blog.updatedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          <span className="text-sm text-gray-500">
            {blog.readTime || 5} min read
          </span>

          {/* Like button */}
          <button
            onClick={handleLikeToggle}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              isLiked
                ? "bg-red-100 text-red-600"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill={isLiked ? "currentColor" : "none"}
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <span>{likeCount}</span>
          </button>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {blog.title}
        </h1>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
              <span className="text-indigo-800 font-semibold">
                {blog.author?.charAt(0)}
              </span>
            </div>
            <span className="text-gray-700">
              By {blog.authorName || blog.author}
            </span>
          </div>

          {/* Edit and Delete buttons - only visible to the author */}
          {user?.email === blog.author && (
            <div className="flex gap-2">
              <Link
                to={`/edit-blog/${blog._id}`}
                className="px-3 py-1 bg-indigo-100 text-indigo-600 rounded-md hover:bg-indigo-200 transition-colors flex items-center gap-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Edit
              </Link>
              <button
                onClick={handleDelete}
                className="px-3 py-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors flex items-center gap-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Featured image */}
      <div className="mb-8 rounded-lg overflow-hidden">
        <img
          src={`data:image/png;base64, ${blog.image}`}
          alt={blog.title}
          className="w-full h-auto object-cover max-h-[500px]"
        />
      </div>

      {/* Blog content */}
      <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-12">
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </div>

      {/* Related blogs */}
      {relatedBlogs.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6 border-b pb-2">
            Related Articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedBlogs.map((relatedBlog) => (
              <div
                key={relatedBlog.id}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <img
                  src={relatedBlog.image}
                  alt={relatedBlog.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full">
                      {relatedBlog.category}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(relatedBlog.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 hover:text-indigo-600 transition-colors">
                    <Link to={`/blogs/${relatedBlog.id}`}>
                      {relatedBlog.title}
                    </Link>
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {relatedBlog.excerpt}
                  </p>
                  <Link
                    to={`/blogs/${relatedBlog.id}`}
                    className="text-indigo-600 hover:text-indigo-800 font-medium text-sm inline-flex items-center"
                  >
                    Read More
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogDetails;
