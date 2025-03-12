import PropTypes from "prop-types";
import VideoContent from "./components/VideoContent";
import QuizContent from "./components/QuizContent";
import ResourceContent from "./components/ResourceContent";
import ArticleContent from "./components/ArticleContent";
import AssignmentContent from "./components/AssignmentContent";

const StudentLessonDetails = ({ lesson, onComplete }) => {
  const handleComplete = () => {
    onComplete();
  };
  if (!lesson) {
    return <div className="text-gray-600 text-center">No lesson selected.</div>;
  }

  if (!lesson.content) {
    return (
      <div className="text-gray-600 text-center">
        No content available for this lesson.
      </div>
    );
  }

  const renderContentByType = () => {
    switch (lesson.content.type) {
      case "video":
        return (
          <VideoContent content={lesson.content} onComplete={handleComplete} />
        );
      case "quiz":
        return (
          <QuizContent
            lesson={lesson}
            content={lesson.content}
            onComplete={handleComplete}
          />
        );
      case "resource":
        return (
          <ResourceContent
            content={lesson.content}
            onComplete={handleComplete}
          />
        );
      case "article":
        return (
          <ArticleContent
            content={lesson.content}
            onComplete={handleComplete}
          />
        );
      case "assignment":
        return (
          <AssignmentContent
            lesson={lesson}
            content={lesson.content}
            onComplete={handleComplete}
          />
        );
      default:
        return (
          <div className="text-gray-600 text-center p-4 bg-gray-50 rounded-lg">
            Unsupported content type: {lesson.content.type}
          </div>
        );
    }
  };

  return (
    <>
      <div className="border-b border-stroke dark:border-dark-3 w-full p-6 space-y-4 pt-2">
        <h2 className="mb-2 text-xl font-semibold">{lesson.name}</h2>
      </div>
      <div className="p-6 bg-white rounded-lg shadow-sm">
        {renderContentByType()}
      </div>
    </>
  );
};

StudentLessonDetails.propTypes = {
  lesson: PropTypes.shape({
    content: PropTypes.shape({
      type: PropTypes.string.isRequired,
      title: PropTypes.string,
      data: PropTypes.string,
      files: PropTypes.array,
      questions: PropTypes.array,
    }),
  }),
  onComplete: PropTypes.func.isRequired,
};

export default StudentLessonDetails;
