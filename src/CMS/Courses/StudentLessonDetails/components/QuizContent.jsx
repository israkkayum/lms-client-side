import PropTypes from "prop-types";
import { useState, useContext, useEffect } from "react";
import useAxiosPublic from "../../../../hooks/useAxiosPublic";
import { AuthContext } from "../../../../providers/AuthProvider";

const QuizContent = ({ content, onComplete }) => {
  const [userAnswers, setUserAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [previousSubmission, setPreviousSubmission] = useState(null);

  const { user } = useContext(AuthContext);
  const axiosPublic = useAxiosPublic();

  useEffect(() => {
    const fetchPreviousSubmission = async () => {
      if (!user || !content.id) return;
      try {
        const response = await axiosPublic.get(
          `/quiz-submissions/${content?.id}/${user?.email}`
        );
        if (response.data) {
          setPreviousSubmission(response.data);
          setQuizSubmitted(true);
          setQuizScore(response.data.score);
          setUserAnswers(response.data.answers);
        }
      } catch (err) {
        console.error("Error fetching previous submission:", err);
      }
    };

    fetchPreviousSubmission();
  }, [user, content.id, axiosPublic]);

  if (!content.questions || content.questions.length === 0) {
    return (
      <div className="text-gray-600 text-center p-4 bg-gray-50 rounded-lg">
        No quiz questions available for this lesson.
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-red-600 text-center p-4 bg-red-50 rounded-lg">
        Please log in to take the quiz.
      </div>
    );
  }

  const handleAnswerChange = (questionIndex, selectedOption) => {
    if (quizSubmitted) return;
    setUserAnswers((prev) => ({
      ...prev,
      [questionIndex]: selectedOption,
    }));
  };

  const handleQuizSubmit = async () => {
    if (!user) {
      setError("Please log in to submit the quiz");
      return;
    }

    if (previousSubmission && previousSubmission.score < 70) {
      setError(
        "You must achieve a score of 70% or higher to proceed. Please review the material and try again later."
      );
      return;
    }

    setSubmitting(true);
    setError(null);

    const totalQuestions = content.questions.length;
    let correctAnswers = 0;

    content.questions.forEach((question, index) => {
      if (userAnswers[index] === question.correctOption) {
        correctAnswers++;
      }
    });

    const score = (correctAnswers / totalQuestions) * 100;

    try {
      const quizSubmission = {
        userId: user.email,
        quizId: content.id,
        score: score,
        answers: userAnswers,
        submittedAt: new Date().toISOString(),
        totalQuestions,
        correctAnswers,
      };

      await axiosPublic.post("/quiz-submissions", quizSubmission);

      setQuizScore(score);
      setQuizSubmitted(true);
      setPreviousSubmission(quizSubmission);

      if (score >= 70) {
        onComplete();
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to submit quiz. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetake = async () => {
    try {
      await axiosPublic.delete(`/quiz-submissions/${content.id}/${user.email}`);
      setPreviousSubmission(null);
      setQuizSubmitted(false);
      setQuizScore(null);
      setUserAnswers({});
      setError(null);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to reset quiz. Please try again."
      );
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
      <h3 className="text-2xl font-semibold mb-6 text-gray-900">
        {content.title || "Quiz"}
      </h3>

      {error && (
        <div className="p-4 mb-6 rounded-lg bg-red-100 text-red-700">
          {error}
        </div>
      )}

      {quizSubmitted && quizScore !== null && (
        <div
          className={`p-4 mb-6 rounded-lg ${
            quizScore >= 70 ? "bg-green-100" : "bg-yellow-100"
          }`}
        >
          <p className="font-medium">Your Score: {quizScore.toFixed(1)}%</p>
          <p className="text-sm mt-1">
            {quizScore >= 70
              ? "Congratulations! You passed the quiz."
              : "Keep practicing to improve your score. You need 70% to pass."}
          </p>
          {quizScore < 70 && (
            <button
              onClick={handleRetake}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Retake Quiz
            </button>
          )}
        </div>
      )}

      <div className="space-y-6">
        {content.questions.map((question, questionIndex) => (
          <div key={questionIndex} className="p-4 bg-gray-50 rounded-lg">
            <p className="font-medium text-gray-900 mb-4">
              {questionIndex + 1}. {question.question}
            </p>
            <div className="space-y-2">
              {question.options.map((option, optionIndex) => {
                const isSelected = userAnswers[questionIndex] === optionIndex;
                const isCorrect = question.correctOption === optionIndex;
                const showResult = quizSubmitted;

                let optionClassName =
                  "flex items-center space-x-3 p-3 rounded-lg transition-colors cursor-pointer ";
                if (showResult) {
                  if (isSelected && isCorrect) {
                    optionClassName += "bg-green-100 text-green-800";
                  } else if (isSelected && !isCorrect) {
                    optionClassName += "bg-red-100 text-red-800";
                  } else if (isCorrect) {
                    optionClassName += "bg-green-50 text-green-800";
                  } else {
                    optionClassName += "bg-gray-50 text-gray-800";
                  }
                } else {
                  optionClassName += isSelected
                    ? "bg-indigo-50 text-indigo-800"
                    : "hover:bg-gray-100";
                }

                return (
                  <label key={optionIndex} className={optionClassName}>
                    <input
                      type="radio"
                      name={`question-${questionIndex}`}
                      value={optionIndex}
                      checked={userAnswers[questionIndex] === optionIndex}
                      onChange={() =>
                        handleAnswerChange(questionIndex, optionIndex)
                      }
                      disabled={quizSubmitted}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-gray-700">{option}</span>
                    {showResult && (
                      <span className="ml-auto">
                        {isSelected && isCorrect && (
                          <svg
                            className="h-5 w-5 text-green-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                        {isSelected && !isCorrect && (
                          <svg
                            className="h-5 w-5 text-red-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        )}
                        {!isSelected && isCorrect && (
                          <svg
                            className="h-5 w-5 text-green-600 opacity-50"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {!quizSubmitted && (
        <button
          onClick={handleQuizSubmit}
          disabled={
            Object.keys(userAnswers).length !== content.questions.length ||
            submitting
          }
          className="mt-6 w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? "Submitting..." : "Submit Quiz"}
        </button>
      )}
    </div>
  );
};

QuizContent.propTypes = {
  content: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
    questions: PropTypes.arrayOf(
      PropTypes.shape({
        question: PropTypes.string.isRequired,
        options: PropTypes.arrayOf(PropTypes.string).isRequired,
        correctOption: PropTypes.number.isRequired,
      })
    ).isRequired,
  }).isRequired,
  onComplete: PropTypes.func.isRequired,
};

export default QuizContent;
