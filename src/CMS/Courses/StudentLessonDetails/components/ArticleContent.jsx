import PropTypes from "prop-types";

const ArticleContent = ({ content, onComplete }) => {
  if (!content || !content.content) {
    return (
      <div className="text-gray-600 text-center p-4 bg-gray-50 rounded-lg">
        No article content available for this lesson.
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
      <div className="mx-auto w-full max-w-[800px]">
        <h3 className="text-2xl font-semibold text-gray-900 mb-6">
          {content.title || "Article"}
        </h3>
        <div
          className="prose prose-lg max-w-none mb-6"
          dangerouslySetInnerHTML={{ __html: content.content }}
        />
        <button
          onClick={onComplete}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-500 transition-colors"
        >
          Mark as Complete
        </button>
      </div>
    </div>
  );
};

ArticleContent.propTypes = {
  content: PropTypes.shape({
    title: PropTypes.string,
    content: PropTypes.string.isRequired,
  }).isRequired,
  onComplete: PropTypes.func.isRequired,
};

export default ArticleContent;
