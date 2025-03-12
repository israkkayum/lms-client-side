import { useState, useEffect } from "react";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import FileModal from "./FileModal";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const AssignmentMarking = ({ lesson }) => {
  const { id: assignmentId } = lesson.content;
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);

  useEffect(() => {
    fetchSubmissions();
  }, [assignmentId]);

  const fetchSubmissions = async () => {
    try {
      const response = await axiosPublic.get(
        `/assignments/${assignmentId}/submissions`
      );
      setSubmissions(response.data);
    } catch (err) {
      setError("Failed to fetch submissions");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmissionSelect = (submission) => {
    setSelectedSubmission(submission);
    setFeedback(submission.feedback || "");
    setScore(submission.score || "");
    setMessage("");
  };

  const handleMarkSubmission = async (e) => {
    e.preventDefault();
    if (!selectedSubmission || !score) return;

    setSubmitting(true);
    try {
      await axiosSecure.post(
        `/assignments/${assignmentId}/submissions/${selectedSubmission._id}/mark`,
        {
          score: parseInt(score),
          feedback,
        }
      );

      setMessage("Assignment marked successfully!");
      fetchSubmissions(); // Refresh the submissions list
      setSelectedSubmission(null);
    } catch (err) {
      setMessage("Failed to mark assignment. Please try again.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return <div className="p-4 text-center">Loading submissions...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-xl font-semibold mb-6">Assignment Submissions</h3>

      {submissions.length === 0 ? (
        <p className="text-gray-500 text-center">No submissions yet</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Submissions List */}
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-4">All Submissions</h4>
            <div className="space-y-4">
              {submissions.map((submission) => (
                <div
                  key={submission._id}
                  className={`p-4 rounded-lg cursor-pointer transition-colors ${
                    selectedSubmission?._id === submission._id
                      ? "bg-indigo-50 border-indigo-200"
                      : "bg-gray-50 hover:bg-gray-100"
                  }`}
                  onClick={() => handleSubmissionSelect(submission)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{submission.studentEmail}</p>
                      <p className="text-sm text-gray-500">
                        Submitted:{" "}
                        {new Date(submission.submittedAt).toLocaleString()}
                      </p>
                    </div>
                    {submission.score !== undefined && (
                      <span className="px-2 py-1 text-sm rounded bg-green-100 text-green-800">
                        Score: {submission.score}/10
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Marking Interface */}
          {selectedSubmission && (
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-4">Mark Submission</h4>
              <form onSubmit={handleMarkSubmission} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Students Work
                  </label>
                  <div className="p-3 bg-gray-50 rounded-md">
                    <p
                      className="text-sm mb-2 cursor-pointer text-indigo-600 hover:text-indigo-800"
                      onClick={() => setIsFileModalOpen(true)}
                    >
                      File: {selectedSubmission.fileName}
                    </p>
                    <FileModal
                      isOpen={isFileModalOpen}
                      onClose={() => setIsFileModalOpen(false)}
                      fileName={selectedSubmission.fileName}
                      fileData={selectedSubmission.fileData}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Score (0-10)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={score}
                    onChange={(e) => setScore(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Feedback
                  </label>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows="4"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                {message && (
                  <div
                    className={`p-3 rounded-md ${
                      message.includes("success")
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {message}
                  </div>
                )}

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedSubmission(null)}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:bg-indigo-300"
                  >
                    {submitting ? "Saving..." : "Save Grade"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AssignmentMarking;
