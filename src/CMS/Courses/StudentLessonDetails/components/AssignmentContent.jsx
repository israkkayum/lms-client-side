import PropTypes from "prop-types";
import { useState } from "react";
import useAxiosPublic from "../../../../hooks/useAxiosPublic";
import { useContext } from "react";
import { AuthContext } from "../../../../providers/AuthProvider";
import useSubmission from "../../../../hooks/useSubmission";

const AssignmentContent = ({ lesson, content, onComplete }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const axiosPublic = useAxiosPublic();
  const { user } = useContext(AuthContext);

  const { submission, loading, error, refetchSubmission } = useSubmission(
    content?.id,
    user?.email
  );

  if (!content || !content.description || !content.id) {
    return (
      <div className="text-gray-600 text-center p-4 bg-gray-50 rounded-lg">
        {!content || !content.description
          ? "No assignment content available for this lesson."
          : "This assignment is not properly configured. Please contact your instructor."}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-red-600 text-center p-4 bg-red-50 rounded-lg">
        Please log in to submit assignments.
      </div>
    );
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setSubmitStatus({
          type: "error",
          message: "File size must be less than 10MB",
        });
        return;
      }
      const allowedTypes = [".pdf", ".doc", ".docx", ".zip"];
      const fileExtension = file.name.substring(file.name.lastIndexOf("."));
      if (!allowedTypes.includes(fileExtension.toLowerCase())) {
        setSubmitStatus({
          type: "error",
          message:
            "Invalid file type. Please upload PDF, DOC, DOCX, or ZIP files only.",
        });
        return;
      }
      setSelectedFile(file);
      setSubmitStatus(null);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile || !user?.email) return;

    setSubmitting(true);
    setSubmitStatus(null);

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("assignmentId", content.id);
    formData.append("courseId", lesson.courseId);
    formData.append("sectionId", lesson.sectionId);
    formData.append("lessonId", lesson.lessonId);
    formData.append("email", user.email);

    try {
      const response = await axiosPublic.post(`/assignments/submit`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSubmitStatus({
        type: "success",
        message: response.data.message || "Assignment submitted successfully!",
      });
      setSelectedFile(null);
      await refetchSubmission();
      onComplete();
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message:
          error.response?.data?.message ||
          "Failed to submit assignment. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
      <div className="mx-auto w-full max-w-[800px]">
        <div className="bg-white p-6 rounded-lg shadow-sm space-y-4 mb-6">
          {/* Assignment Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-600">
              Assignment Title
            </label>
            <p className="text-lg font-medium text-gray-900 mt-1">
              {content.title || "Assignment"}
            </p>
          </div>

          {/* Assignment Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              Assignment Description
            </label>
            <div
              className="prose prose-lg max-w-none bg-gray-50 p-5 rounded-md border border-gray-300 mt-2 leading-relaxed-gray-800"
              dangerouslySetInnerHTML={{ __html: content.description }}
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center p-4">Loading submission status...</div>
        ) : error ? (
          <div className="text-red-600 text-center p-4 bg-red-50 rounded-lg">
            {error}
          </div>
        ) : submission ? (
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h4 className="text-lg font-medium text-gray-900 mb-4">
              Submitted Assignment
            </h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">File Name</p>
                  <p className="text-base text-gray-900">
                    {submission.fileName}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-500">
                    Submitted On
                  </p>
                  <p className="text-base text-gray-900">
                    {formatDate(submission.submittedAt)}
                  </p>
                </div>
              </div>
              {submission.score !== undefined && (
                <div className="border-b pb-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Score</p>
                      <p className="text-base text-gray-900">
                        {submission.score}/10
                      </p>
                    </div>
                  </div>
                  {submission.feedback && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-500">
                        Teachers Feedback
                      </p>
                      <p className="text-base text-gray-900 mt-1">
                        {submission.feedback}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h4 className="text-lg font-medium text-gray-900 mb-4">
              Submit Your Assignment
            </h4>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Your Work
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-medium
                    file:bg-indigo-50 file:text-indigo-700
                    hover:file:bg-indigo-100
                    cursor-pointer"
                  accept=".pdf,.doc,.docx,.zip"
                  disabled={submitting}
                />
                <p className="mt-1 text-sm text-gray-500">
                  Accepted formats: PDF, DOC, DOCX, ZIP (max 10MB)
                </p>
              </div>

              {submitStatus && (
                <div
                  className={`p-4 rounded-md ${
                    submitStatus.type === "success"
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {submitStatus.message}
                </div>
              )}

              <button
                type="submit"
                disabled={!selectedFile || submitting}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white
                  ${
                    !selectedFile || submitting
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  }`}
              >
                {submitting ? "Submitting..." : "Submit Assignment"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

AssignmentContent.propTypes = {
  content: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
    description: PropTypes.string.isRequired,
    dueDate: PropTypes.string,
    maxFileSize: PropTypes.number,
    allowedFileTypes: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  onComplete: PropTypes.func.isRequired,
  lesson: PropTypes.shape({
    courseId: PropTypes.string.isRequired,
    sectionId: PropTypes.string.isRequired,
    lessonId: PropTypes.string.isRequired,
  }).isRequired,
};

export default AssignmentContent;
