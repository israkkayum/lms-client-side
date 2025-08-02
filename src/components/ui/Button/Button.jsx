import PropTypes from "prop-types";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className = "",
  onClick,
  type = "button",
  ...props
}) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClasses = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500",
    success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    warning: "bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-indigo-500",
    ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
    xl: "px-8 py-4 text-lg",
  };

  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={isDisabled}
      onClick={onClick}
      {...props}
    >
      {loading && <LoadingSpinner size="sm" color="white" className="mr-2" />}
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(["primary", "secondary", "success", "danger", "warning", "outline", "ghost"]),
  size: PropTypes.oneOf(["sm", "md", "lg", "xl"]),
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
};

export default Button;