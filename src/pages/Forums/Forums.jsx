import { useState, useEffect } from "react";
import { Tab } from "@headlessui/react";
import useAuth from "../../hooks/useAuth";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const categories = {
  "General Discussion": [],
  "Course Discussion": [],
  "Technical Support": [],
};

const Forums = () => {
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();
  const [topics, setTopics] = useState(categories);
  const [newTopic, setNewTopic] = useState({
    title: "",
    content: "",
    category: "General Discussion",
    replies: 0,
    views: 0,
  });
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [replies, setReplies] = useState([]);
  const [newReply, setNewReply] = useState({
    content: "",
    topicId: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [topicError, setTopicError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteType, setDeleteType] = useState(null); // 'topic' or 'reply'
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState("");

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      const response = await axiosPublic.get("/forum-topics");
      const data = response.data;

      const categorizedTopics = {
        "General Discussion": data.filter(
          (topic) => topic.category === "General Discussion"
        ),
        "Course Discussion": data.filter(
          (topic) => topic.category === "Course Discussion"
        ),
        "Technical Support": data.filter(
          (topic) => topic.category === "Technical Support"
        ),
      };

      setTopics(categorizedTopics);
      setError("");
    } catch (error) {
      console.error("Error fetching topics:", error);
      setError("Failed to load topics. Please try again later.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTopic((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateTopic = async (e) => {
    e.preventDefault();
    if (!user) {
      setError("Please login to create a topic");
      return;
    }

    if (!newTopic.title.trim() || !newTopic.content.trim()) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const response = await axiosPublic.post("/forum-topics", {
        ...newTopic,
        author: user?.email,
        authorName: user?.displayName || "Anonymous",
        authorAvatar: user?.photoURL || "",
        createdAt: new Date(),
      });

      if (response.data) {
        setNewTopic({
          title: "",
          content: "",
          category: "General Discussion",
          replies: 0,
          views: 0,
        });
        setShowForm(false);
        setError("");
        fetchTopics();
      }
    } catch (error) {
      console.error("Error creating topic:", error);
      setError("Failed to create topic. Please try again.");
    }
  };

  const handleTopicClick = async (topicId) => {
    setIsLoading(true);
    setTopicError("");

    try {
      // Fetch topic details
      const topicResponse = await axiosPublic.get(`/forum-topics/${topicId}`);

      if (!topicResponse.data) {
        throw new Error("Topic not found");
      }

      setSelectedTopic(topicResponse.data);

      // Fetch replies
      const repliesResponse = await axiosPublic.get(
        `/forum-replies/${topicId}`
      );
      setReplies(repliesResponse.data || []);
    } catch (error) {
      console.error("Error fetching topic details:", error);

      // Set more specific error messages based on the error
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response.status === 404) {
          setTopicError("Topic not found. It may have been deleted.");
        } else if (error.response.status === 403) {
          setTopicError("You don't have permission to view this topic.");
        } else {
          setTopicError(
            `Server error: ${
              error.response.data?.message || "Failed to load topic details."
            }`
          );
        }
      } else if (error.request) {
        // The request was made but no response was received
        setTopicError(
          "Network error. Please check your connection and try again."
        );
      } else {
        // Something happened in setting up the request that triggered an Error
        setTopicError("An unexpected error occurred. Please try again later.");
      }

      // Clear selected topic if we couldn't load it
      setSelectedTopic(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReplyChange = (e) => {
    setNewReply({
      ...newReply,
      content: e.target.value,
    });
  };

  const handleSubmitReply = async (e) => {
    e.preventDefault();
    if (!user) {
      setError("Please login to post a reply");
      return;
    }

    if (!newReply.content.trim()) {
      setError("Please enter a reply");
      return;
    }

    try {
      // Create a timestamp that will be consistent between client and server
      const currentDate = new Date();

      const response = await axiosPublic.post("/forum-replies", {
        content: newReply.content,
        topicId: selectedTopic._id,
        author: user.email,
        authorName: user?.displayName || "Anonymous",
        authorAvatar: user?.photoURL || "",
        createdAt: currentDate,
      });

      if (response.data) {
        // Format the new reply with the correct date before adding to state
        const formattedReply = {
          ...response.data,
          createdAt: response.data.createdAt || currentDate.toISOString(),
        };

        setNewReply({ content: "", topicId: "" });
        setReplies([...replies, formattedReply]);
        setSelectedTopic({
          ...selectedTopic,
          replies: selectedTopic.replies + 1,
        });
        setError("");

        // Show success message
        const successMessage = document.createElement("div");
        successMessage.className =
          "bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4";
        successMessage.textContent = "Reply posted successfully!";

        const formElement = e.target;
        formElement.parentNode.insertBefore(successMessage, formElement);

        // Remove success message after 3 seconds
        setTimeout(() => {
          if (successMessage.parentNode) {
            successMessage.parentNode.removeChild(successMessage);
          }
        }, 3000);
      }
    } catch (error) {
      console.error("Error posting reply:", error);
      setError("Failed to post reply. Please try again.");
    }
  };

  // Handle delete confirmation dialog
  const confirmDelete = (type, item) => {
    setDeleteType(type);
    setItemToDelete(item);
    setShowDeleteConfirm(true);
    setDeleteMessage("");
  };

  // Handle topic deletion
  const handleDeleteTopic = async () => {
    if (!itemToDelete || !user) return;

    try {
      const response = await axiosSecure.delete(
        `/forum-topics/${itemToDelete._id}`
      );

      if (response.data) {
        setShowDeleteConfirm(false);
        setSelectedTopic(null);
        fetchTopics();

        // Show success message
        setDeleteMessage("Topic deleted successfully!");
        setTimeout(() => setDeleteMessage(""), 3000);
      }
    } catch (error) {
      console.error("Error deleting topic:", error);
      setDeleteMessage("Failed to delete topic. Please try again.");
    }
  };

  // Handle reply deletion
  const handleDeleteReply = async () => {
    if (!itemToDelete || !selectedTopic || !user) return;

    try {
      const response = await axiosSecure.delete(
        `/forum-replies/${itemToDelete._id}`
      );

      if (response.data) {
        // Remove the reply from the UI
        setReplies(replies.filter((reply) => reply._id !== itemToDelete._id));

        // Update the topic's reply count
        setSelectedTopic({
          ...selectedTopic,
          replies: Math.max(0, selectedTopic.replies - 1),
        });

        setShowDeleteConfirm(false);

        // Show success message
        setDeleteMessage("Reply deleted successfully!");
        setTimeout(() => setDeleteMessage(""), 3000);
      }
    } catch (error) {
      console.error("Error deleting reply:", error);
      setDeleteMessage("Failed to delete reply. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Forums</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500 transition-colors"
        >
          {showForm ? "Cancel" : "New Topic"}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {deleteMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {deleteMessage}
        </div>
      )}

      {showForm && (
        <form
          onSubmit={handleCreateTopic}
          className="mb-8 bg-white p-6 rounded-lg shadow"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={newTopic.title}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Content
              </label>
              <textarea
                name="content"
                value={newTopic.content}
                onChange={handleInputChange}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                name="category"
                value={newTopic.category}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                {Object.keys(categories).map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500 transition-colors"
            >
              Create Topic
            </button>
          </div>
        </form>
      )}

      <div className="w-full px-2 sm:px-0">
        <Tab.Group>
          <Tab.List className="flex space-x-1 rounded-xl bg-indigo-900/20 p-1">
            {Object.keys(topics).map((category) => (
              <Tab
                key={category}
                className={({ selected }) =>
                  `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                  ${
                    selected
                      ? "bg-white text-indigo-700 shadow"
                      : "text-gray-600 hover:bg-white/[0.12] hover:text-gray-800"
                  }`
                }
              >
                {category}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels className="mt-2">
            {Object.values(topics).map((posts, idx) => (
              <Tab.Panel key={idx} className="rounded-xl bg-white p-3">
                {posts.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    No topics in this category yet.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {posts.map((post) => (
                      <div
                        key={post._id}
                        className="relative rounded-md p-3 hover:bg-gray-50 flex justify-between items-center border border-gray-200 cursor-pointer"
                      >
                        <div onClick={() => handleTopicClick(post._id)}>
                          <h3 className="text-lg font-medium leading-5">
                            {post.title}
                          </h3>
                          <div className="mt-1 flex space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              {post.authorAvatar ? (
                                <img
                                  src={post.authorAvatar}
                                  alt="Author"
                                  className="w-6 h-6 rounded-full mr-2"
                                />
                              ) : (
                                <div className="w-6 h-6 rounded-full bg-indigo-200 flex items-center justify-center mr-2">
                                  <span className="text-xs text-indigo-600">
                                    {post.authorName?.charAt(0) ||
                                      post.author?.charAt(0) ||
                                      "A"}
                                  </span>
                                </div>
                              )}
                              <p>By: {post.authorName || post.author}</p>
                            </div>
                            <p>
                              Date:{" "}
                              {new Date(post.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="text-sm text-gray-500 space-x-4 mr-4">
                            <span>{post.replies || 0} replies</span>
                            <span>{post.views || 0} views</span>
                          </div>
                          {user?.email === post.author && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                confirmDelete("topic", post);
                              }}
                              className="text-red-600 hover:text-red-800 p-1"
                              title="Delete topic"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
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
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </div>

      {(selectedTopic || isLoading) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setSelectedTopic(null);
                setTopicError("");
              }}
              className="mb-4 text-gray-500 hover:text-gray-700"
            >
              &larr; Back to topics
            </button>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : topicError ? (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {topicError}
                <div className="mt-4">
                  <button
                    onClick={() => {
                      setTopicError("");
                      setSelectedTopic(null);
                    }}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500"
                  >
                    Go Back
                  </button>
                </div>
              </div>
            ) : (
              selectedTopic && (
                <>
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-bold">
                      {selectedTopic.title}
                    </h2>
                    {user?.email === selectedTopic.author && (
                      <button
                        onClick={() => confirmDelete("topic", selectedTopic)}
                        className="text-red-600 hover:text-red-800 p-1 flex items-center"
                        title="Delete topic"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-1"
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
                    )}
                  </div>
                  <div className="text-gray-600 mb-4 flex items-center">
                    {selectedTopic.authorAvatar ? (
                      <img
                        src={selectedTopic.authorAvatar}
                        alt="Author"
                        className="w-8 h-8 rounded-full mr-2"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-indigo-200 flex items-center justify-center mr-2">
                        <span className="text-sm text-indigo-600">
                          {selectedTopic.authorName?.charAt(0) ||
                            selectedTopic.author?.charAt(0) ||
                            "A"}
                        </span>
                      </div>
                    )}
                    <div>
                      <p>
                        By: {selectedTopic.authorName || selectedTopic.author}
                      </p>
                      <p>
                        Date:{" "}
                        {new Date(selectedTopic.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <p className="whitespace-pre-wrap">
                      {selectedTopic.content}
                    </p>
                  </div>

                  <h3 className="text-xl font-bold mb-4">
                    Replies ({replies.length})
                  </h3>

                  <div className="space-y-4 mb-6">
                    {replies.length > 0 ? (
                      replies.map((reply) => (
                        <div
                          key={reply._id}
                          className="bg-gray-50 p-4 rounded-lg relative"
                        >
                          <p className="text-gray-600 mb-2">{reply.content}</p>
                          <div className="text-sm text-gray-500 flex items-center justify-between">
                            <div className="flex items-center">
                              {reply.authorAvatar ? (
                                <img
                                  src={reply.authorAvatar}
                                  alt="Author"
                                  className="w-6 h-6 rounded-full mr-2"
                                />
                              ) : (
                                <div className="w-6 h-6 rounded-full bg-indigo-200 flex items-center justify-center mr-2">
                                  <span className="text-xs text-indigo-600">
                                    {reply.authorName?.charAt(0) ||
                                      reply.author?.charAt(0) ||
                                      "A"}
                                  </span>
                                </div>
                              )}
                              <div>
                                <p>By: {reply.authorName || reply.author}</p>
                                <p>
                                  Date:{" "}
                                  {new Date(
                                    reply.createdAt
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            {user?.email === reply.author && (
                              <button
                                onClick={() => confirmDelete("reply", reply)}
                                className="text-red-600 hover:text-red-800 p-1"
                                title="Delete reply"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5"
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
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">
                        No replies yet. Be the first to reply!
                      </p>
                    )}
                  </div>

                  <form onSubmit={handleSubmitReply} className="mt-4">
                    <textarea
                      value={newReply.content}
                      onChange={handleReplyChange}
                      rows={3}
                      className="w-full p-2 border rounded mb-2"
                      placeholder="Write your reply..."
                    />
                    <button
                      type="submit"
                      className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-500"
                    >
                      Post Reply
                    </button>
                  </form>
                </>
              )
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirm Delete
            </h3>
            <p className="text-gray-500 mb-6">
              Are you sure you want to delete this {deleteType}? This action
              cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={
                  deleteType === "topic" ? handleDeleteTopic : handleDeleteReply
                }
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Forums;
