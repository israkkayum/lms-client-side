import PropTypes from "prop-types";
import Button from "../Button/Button";

const EmptyState = ({
  icon,
  title,
  description,
  action,
  className = "",
}) => {
  return (
    <div className={`text-center py-12 ${className}`}>
      {icon && (
        <div className="flex justify-center mb-4">
          {typeof icon === "string" ? (
            <img src={icon} alt="" className="w-16 h-16 text-gray-400" />
          ) : (
            <div className="w-16 h-16 text-gray-400">{icon}</div>
          )}
        </div>
      )}
      
      {title && (
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      )}
      
      {description && (
        <p className="text-gray-500 mb-6 max-w-sm mx-auto">{description}</p>
      )}
      
      {action && action}
    </div>
  );
};

EmptyState.propTypes = {
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  title: PropTypes.string,
  description: PropTypes.string,
  action: PropTypes.node,
  className: PropTypes.string,
};

export default EmptyState;