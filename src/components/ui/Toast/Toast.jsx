import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const Toast = ({ message, type = "info", duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for animation to complete
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getToastStyles = () => {
    const baseStyles = "fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 transform";
    const typeStyles = {
      success: "bg-green-100 text-green-800 border border-green-200",
      error: "bg-red-100 text-red-800 border border-red-200",
      warning: "bg-yellow-100 text-yellow-800 border border-yellow-200",
      info: "bg-blue-100 text-blue-800 border border-blue-200",
    };

    const visibilityStyles = isVisible
      ? "translate-x-0 opacity-100"
      : "translate-x-full opacity-0";

    return `${baseStyles} ${typeStyles[type]} ${visibilityStyles}`;
  };

  const getIcon = () => {
    const iconProps = { className: "w-5 h-5 mr-2" };
    
    switch (type) {
      case "success":
        return (
          <svg {...iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case "error":
        return (
          <svg {...iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      case "warning":
        return (
          <svg {...iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      default:
        return (
          <svg {...iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  return (
    <div className={getToastStyles()}>
      <div className="flex items-center">
        {getIcon()}
        <span className="text-sm font-medium">{message}</span>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="ml-4 text-gray-400 hover:text-gray-600"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

Toast.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["success", "error", "warning", "info"]),
  duration: PropTypes.number,
  onClose: PropTypes.func.isRequired,
};

export default Toast;