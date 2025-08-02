import PropTypes from "prop-types";
import { Controller } from "react-hook-form";
import Input from "../../ui/Input/Input";
import Select from "../../ui/Select/Select";
import Textarea from "../../ui/Textarea/Textarea";

const FormField = ({
  name,
  control,
  rules,
  type = "text",
  component = "input",
  ...props
}) => {
  const renderComponent = (field, fieldState) => {
    const commonProps = {
      ...field,
      ...props,
      error: fieldState.error?.message,
    };

    switch (component) {
      case "select":
        return <Select {...commonProps} />;
      case "textarea":
        return <Textarea {...commonProps} />;
      default:
        return <Input type={type} {...commonProps} />;
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => renderComponent(field, fieldState)}
    />
  );
};

FormField.propTypes = {
  name: PropTypes.string.isRequired,
  control: PropTypes.object.isRequired,
  rules: PropTypes.object,
  type: PropTypes.string,
  component: PropTypes.oneOf(["input", "select", "textarea"]),
};

export default FormField;