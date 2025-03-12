import PropTypes from "prop-types";
import { useState } from "react";

const VideoContent = ({ content, onComplete }) => {
  const [isCompleted, setIsCompleted] = useState(false);

  if (!content || !content.data) {
    return (
      <div className="text-gray-600 text-center p-4 bg-gray-50 rounded-lg">
        No video content available for this lesson.
      </div>
    );
  }

  const handleComplete = () => {
    onComplete();
    setIsCompleted(true);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
      <div className="mx-auto w-full max-w-[700px]">
        <iframe
          className="h-[400px] w-full rounded-lg"
          autoPlay
          src={`data:video/mp4;base64,${content.data}`}
          type="video/mp4"
        />
        <div className="mt-5">
          <h3 className="text-2xl font-semibold text-gray-900">
            {content.title || "Video Lesson"}
          </h3>
          {!isCompleted && (
            <button
              onClick={handleComplete}
              className="w-full bg-indigo-600 text-white mt-20 py-2 px-4 rounded-lg hover:bg-indigo-500 transition-colors"
            >
              Mark as Complete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

VideoContent.propTypes = {
  content: PropTypes.shape({
    title: PropTypes.string,
    data: PropTypes.string.isRequired,
  }).isRequired,
  onComplete: PropTypes.func.isRequired,
};

export default VideoContent;
