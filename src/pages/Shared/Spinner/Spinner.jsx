import LoadingSpinner from "../../../components/ui/LoadingSpinner/LoadingSpinner";

const Spinner = () => {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <LoadingSpinner size="lg" />
    </div>
  );
};

export default Spinner;
