import PropTypes from "prop-types";

const ResourceContent = ({ content, onComplete }) => {
  if (!content || !content.files || content.files.length === 0) {
    return (
      <div className="text-gray-600 text-center p-4 bg-gray-50 rounded-lg">
        No resources available for this lesson.
      </div>
    );
  }

  const handleDownload = (file) => {
    // Create a temporary link to trigger the download
    const link = document.createElement('a');
    link.href = `data:${file.mimetype};base64,${file.data}`;
    link.download = file.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Mark the lesson as complete when a resource is downloaded
    onComplete();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
      <h3 className="text-2xl font-semibold mb-6 text-gray-900">
        {content.title || "Resources"}
      </h3>
      <div className="space-y-4">
        {content.files.map((file, index) => {
          if (!file.data) {
            return (
              <div
                key={index}
                className="text-red-600 p-4 bg-red-50 rounded-lg"
              >
                Error: Resource data is missing for {file.filename}
              </div>
            );
          }
          return (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-150"
            >
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <svg
                    className="w-6 h-6 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-900">
                    {file.filename}
                  </h4>
                  {file.filesize && (
                    <p className="text-xs text-gray-400 mt-1">
                      Size: {(file.filesize / 1024 / 1024).toFixed(2)} MB
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleDownload(file)}
                className="flex items-center px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Download
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

ResourceContent.propTypes = {
  content: PropTypes.shape({
    title: PropTypes.string,
    files: PropTypes.arrayOf(
      PropTypes.shape({
        filename: PropTypes.string.isRequired,
        data: PropTypes.string.isRequired,
        mimetype: PropTypes.string.isRequired,
        filesize: PropTypes.number,
      })
    ).isRequired,
  }).isRequired,
  onComplete: PropTypes.func.isRequired,
};

export default ResourceContent;
