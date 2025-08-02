import PropTypes from "prop-types";

const Skeleton = ({ 
  className = "", 
  variant = "rectangular",
  width,
  height,
  lines = 1,
  animated = true,
}) => {
  const baseClasses = `bg-gray-200 ${animated ? "animate-pulse" : ""}`;
  
  const variantClasses = {
    rectangular: "rounded",
    circular: "rounded-full",
    text: "rounded h-4",
  };

  const style = {
    width: width || (variant === "circular" ? height : undefined),
    height: height || (variant === "text" ? "1rem" : undefined),
  };

  if (variant === "text" && lines > 1) {
    return (
      <div className={className}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`${baseClasses} ${variantClasses[variant]} mb-2 last:mb-0`}
            style={{
              ...style,
              width: index === lines - 1 ? "75%" : "100%",
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  );
};

Skeleton.propTypes = {
  className: PropTypes.string,
  variant: PropTypes.oneOf(["rectangular", "circular", "text"]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  lines: PropTypes.number,
  animated: PropTypes.bool,
};

export default Skeleton;