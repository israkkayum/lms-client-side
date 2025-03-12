import { useEffect } from "react";

const FileModal = ({ isOpen, onClose, fileName, fileData }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Function to determine file type from file name
  const getFileType = (fileName) => {
    const extension = fileName.split(".").pop().toLowerCase();
    if (extension === "pdf") return "pdf";
    if (["doc", "docx"].includes(extension)) return "doc";
    return "unknown";
  };

  // Function to get MIME type based on file type
  const getMimeType = (fileType) => {
    const mimeTypes = {
      pdf: "application/pdf",
      doc: "application/msword",
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    };
    return mimeTypes[fileType] || "application/octet-stream";
  };

  const fileType = getFileType(fileName);
  const mimeType = getMimeType(fileType);

  const renderFileViewer = () => {
    if (!fileData) {
      return (
        <div className="text-center text-gray-500">File not available</div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        {fileType === "pdf" ? (
          <iframe
            src={`data:${mimeType};base64,${fileData}`}
            className="w-full h-[70vh] border-0"
            title={fileName}
          />
        ) : fileType === "doc" ? (
          <div className="w-full h-[70vh] border rounded-lg p-4 bg-gray-50 overflow-auto">
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                <p className="mt-4 text-sm text-gray-600">
                  Preview not available for {fileName}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500">
            Unsupported file format
          </div>
        )}
        <a
          href={`data:${mimeType};base64,${fileData}`}
          download={fileName}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Download File
        </a>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        ></div>

        <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              {fileName}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Close</span>
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="mt-2">{renderFileViewer()}</div>
        </div>
      </div>
    </div>
  );
};

export default FileModal;
