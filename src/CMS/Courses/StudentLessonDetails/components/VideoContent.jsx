import PropTypes from 'prop-types';

const VideoContent = ({ content, onComplete }) => {
  if (!content || !content.data) {
    return (
      <div className="text-gray-600 text-center p-4 bg-gray-50 rounded-lg">
        No video content available for this lesson.
      </div>
    );
  }

  const handleComplete = () => {
    if (window.confirm('Have you finished watching the video? This will mark the lesson as complete.')) {
      onComplete();
    }
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
          <button
            onClick={handleComplete}
            className="mt-4 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-500 transition-colors"
          >
            Mark as Complete
          </button>
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