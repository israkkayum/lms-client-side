import { useState, useEffect } from "react";
import { Tab } from "@headlessui/react";
import useAuth from "../../hooks/useAuth";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useNavigate } from "react-router-dom";

const categories = {
  "General Discussion": [],
  "Course Discussion": [],
  "Technical Support": [],
};

const Forums = () => {
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();
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
    try {
      // Fetch topic details
      const topicResponse = await axiosPublic.get(`/forum-topics/${topicId}`);
      setSelectedTopic(topicResponse.data);

      // Fetch replies
      const repliesResponse = await axiosPublic.get(
        `/forum-replies/${topicId}`
      );
      setReplies(repliesResponse.data);
    } catch (error) {
      console.error("Error fetching topic details:", error);
      setError("Failed to load topic details.");
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
      const response = await axiosPublic.post("/forum-replies", {
        content: newReply.content,
        topicId: selectedTopic._id,
        author: user.email,
        createdAt: new Date(),
      });

      if (response.data) {
        setNewReply({ content: "", topicId: "" });
        setReplies([...replies, response.data]);
        setSelectedTopic({
          ...selectedTopic,
          replies: selectedTopic.replies + 1,
        });
        setError("");
      }
    } catch (error) {
      console.error("Error posting reply:", error);
      setError("Failed to post reply. Please try again.");
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
                        onClick={() => handleTopicClick(post._id)}
                        className="relative rounded-md p-3 hover:bg-gray-50 flex justify-between items-center border border-gray-200 cursor-pointer"
                      >
                        <div>
                          <h3 className="text-lg font-medium leading-5">
                            {post.title}
                          </h3>
                          <div className="mt-1 flex space-x-4 text-sm text-gray-500">
                            <p>By: {post.author}</p>
                            <p>
                              Date:{" "}
                              {new Date(post.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500 space-x-4">
                          <span>{post.replies || 0} replies</span>
                          <span>{post.views || 0} views</span>
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

      {selectedTopic && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedTopic(null)}
              className="mb-4 text-gray-500 hover:text-gray-700"
            >
              &larr; Back to topics
            </button>

            <h2 className="text-2xl font-bold mb-4">{selectedTopic.title}</h2>
            <div className="text-gray-600 mb-4">
              <p>By: {selectedTopic.author}</p>
              <p>
                Date: {new Date(selectedTopic.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="mb-6">
              <p className="whitespace-pre-wrap">{selectedTopic.content}</p>
            </div>

            <h3 className="text-xl font-bold mb-4">
              Replies ({replies.length})
            </h3>

            <div className="space-y-4 mb-6">
              {replies.map((reply) => (
                <div key={reply._id} className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600 mb-2">{reply.content}</p>
                  <div className="text-sm text-gray-500">
                    <p>By: {reply.author}</p>
                    <p>
                      Date: {new Date(reply.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
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
          </div>
        </div>
      )}
    </div>
  );
};

export default Forums;
