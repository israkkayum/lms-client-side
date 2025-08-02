import { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { validateFile, formatFileSize } from "../../../utils/helpers";
import Button from "../Button/Button";

const FileUpload = ({
  onFileSelect,
  accept = "*/*",
  multiple = false,
  maxSize,
  fileType = "document",
  className = "",
  children,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");

  const handleFiles = useCallback((files) => {
    const fileArray = Array.from(files);
    const validFiles = [];
    let hasError = false;

    fileArray.forEach((file) => {
      const validation = validateFile(file, fileType);
      if (validation.isValid) {
        validFiles.push(file);
      } else {
        setError(validation.error);
        hasError = true;
      }
    });

    if (!hasError) {
      setError("");
      onFileSelect(multiple ? validFiles : validFiles[0]);
    }
  }, [onFileSelect, multiple, fileType]);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleChange = useCallback((e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  }, [handleFiles]);

  return (
    <div className={className}>
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
          dragActive
            ? "border-indigo-400 bg-indigo-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleChange}
          accept={accept}
          multiple={multiple}
        />
        
        <div className="text-center">
          {children || (
            <>
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="mt-4">
                <p className="text-sm text-gray-600">
                  <span className="font-medium text-indigo-600 hover:text-indigo-500">
                    Click to upload
                  </span>{" "}
                  or drag and drop
                </p>
                {maxSize && (
                  <p className="text-xs text-gray-500 mt-1">
                    Maximum file size: {formatFileSize(maxSize)}
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      
      {error && (
        <div className="mt-2 text-sm text-red-600">
          {error}
        </div>
      )}
    </div>
  );
};

FileUpload.propTypes = {
  onFileSelect: PropTypes.func.isRequired,
  accept: PropTypes.string,
  multiple: PropTypes.bool,
  maxSize: PropTypes.number,
  fileType: PropTypes.oneOf(["image", "video", "document"]),
  className: PropTypes.string,
  children: PropTypes.node,
};

export default FileUpload;