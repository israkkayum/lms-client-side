import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const EditHomePage = ({ siteData }) => {
  const [announcements, setAnnouncements] = useState(
    siteData?.announcements || []
  );
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
  });

  const axiosSecure = useAxiosSecure();

  const handleUpdateSite = async () => {
    try {
      // Validate announcements before sending
      const invalidAnnouncements = announcements.some(
        (announcement) => !announcement.title || !announcement.content
      );
      if (invalidAnnouncements) {
        Swal.fire(
          "Error",
          "All announcements must have a title and content",
          "error"
        );
        return;
      }

      await axiosSecure.put(`/sites/${siteData?._id}/announcements`, {
        announcements,
      });
      Swal.fire("Success", "Announcements updated successfully", "success");
    } catch (error) {
      console.error("Error updating site:", error);
      Swal.fire(
        "Error",
        error.response?.data?.message || "Failed to update announcements",
        "error"
      );
    }
  };

  const handleAddAnnouncement = () => {
    if (newAnnouncement.title && newAnnouncement.content) {
      setAnnouncements([
        ...announcements,
        { ...newAnnouncement, date: new Date() },
      ]);
      setNewAnnouncement({ title: "", content: "" });
    }
  };

  const handleDeleteAnnouncement = (index) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosSecure.delete(
            `/sites/${siteData?._id}/announcements/${index}`
          );
          const updatedAnnouncements = announcements.filter(
            (_, i) => i !== index
          );
          setAnnouncements(updatedAnnouncements);
          Swal.fire(
            "Deleted!",
            "The announcement has been deleted.",
            "success"
          );
        } catch (error) {
          console.error("Error deleting announcement:", error);
          Swal.fire(
            "Error",
            error.response?.data?.message || "Failed to delete announcement",
            "error"
          );
        }
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Announcements</h2>
        <div className="space-y-4 mb-4">
          {announcements.map((announcement, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-6 relative"
            >
              <button
                onClick={() => handleDeleteAnnouncement(index)}
                className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-colors"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
              <h3 className="text-xl font-medium mb-2">{announcement.title}</h3>
              <p className="text-gray-600">{announcement.content}</p>
              <p className="text-sm text-gray-500 mt-2">
                Posted on: {new Date(announcement.date).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Add New Announcement</h3>
          <input
            type="text"
            placeholder="Title"
            value={newAnnouncement.title}
            onChange={(e) =>
              setNewAnnouncement({ ...newAnnouncement, title: e.target.value })
            }
            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <textarea
            rows={3}
            placeholder="Content"
            value={newAnnouncement.content}
            onChange={(e) =>
              setNewAnnouncement({
                ...newAnnouncement,
                content: e.target.value,
              })
            }
            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <button
            onClick={handleAddAnnouncement}
            disabled={!newAnnouncement.title || !newAnnouncement.content}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Add Announcement
          </button>
        </div>
      </div>

      <button
        onClick={handleUpdateSite}
        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
      >
        Save Changes
      </button>
    </div>
  );
};

export default EditHomePage;
