import PropTypes from "prop-types";

const ProgressBar = ({ 
  value = 0, 
  max = 100, 
  size = "md",
  color = "indigo",
  showLabel = false,
  label,
  className = "",
  animated = false,
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizeClasses = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4",
  };

  const colorClasses = {
    indigo: "bg-indigo-600",
    blue: "bg-blue-600",
    green: "bg-green-600",
    yellow: "bg-yellow-600",
    red: "bg-red-600",
  };

  const animationClass = animated ? "transition-all duration-500 ease-out" : "";

  return (
    <div className={className}>
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600">
            {label || "Progress"}
          </span>
          <span className="text-sm font-medium text-gray-900">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full ${sizeClasses[size]}`}>
        <div
          className={`${colorClasses[color]} ${sizeClasses[size]} rounded-full ${animationClass}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

ProgressBar.propTypes = {
  value: PropTypes.number,
  max: PropTypes.number,
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  color: PropTypes.oneOf(["indigo", "blue", "green", "yellow", "red"]),
  showLabel: PropTypes.bool,
  label: PropTypes.string,
  className: PropTypes.string,
  animated: PropTypes.bool,
};

export default ProgressBar;