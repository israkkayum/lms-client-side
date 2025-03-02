import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import useAxiosPublic from "../../../hooks/useAxiosPublic";

const EditQuiz = ({ lesson }) => {
  const { title, questions } = lesson.content;
  const { courseId, sectionId, lessonId } = lesson;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: title || "",
      questions:
        questions?.length > 0
          ? questions.map((q) => ({
              question: q.question,
              options: [
                ...q.options,
                ...Array(4 - q.options.length).fill(""),
              ].slice(0, 4),
              correctOption: q.correctOption,
            }))
          : [
              {
                question: "",
                options: ["", "", "", ""],
                correctOption: 0,
              },
            ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  const axiosPublic = useAxiosPublic();

  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  const onSubmit = async (data) => {
    try {
      setIsUpdating(true);
      setUpdateMessage("");

      const formData = {
        title: data.title,
        type: "quiz",
        questions: data.questions.map((q) => ({
          question: q.question,
          options: q.options.filter((option) => option.trim() !== ""),
          correctOption: parseInt(q.correctOption),
        })),
      };

      const response = await axiosPublic.patch(
        `/course/${courseId}/section/${sectionId}/lesson/${lessonId}/content`,
        formData
      );

      setUpdateMessage(response.data.message || "Quiz updated successfully!");
    } catch (error) {
      setUpdateMessage(error.response?.data?.message || "Error updating quiz.");
      console.error("Error updating quiz:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axiosPublic.delete(
        `/course/${courseId}/section/${sectionId}/lesson/${lessonId}/content`
      );

      setUpdateMessage(response.data.message || "Quiz deleted successfully!");
      setIsDeleting(false);
      setIsDeleted(true);
    } catch (error) {
      setUpdateMessage(error.response?.data?.message || "Error deleting quiz.");
    }
  };

  const addQuestion = () => {
    append({
      question: "",
      options: ["", "", "", ""],
      correctOption: 0,
    });
  };

  if (isDeleted) {
    return (
      <div className="bg-gray-50 p-10 rounded-md">
        <div className="p-3 rounded-md bg-green-100 text-green-700">
          Quiz has been deleted successfully.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-10 rounded-md">
      {updateMessage && (
        <div
          className={`p-4 mb-4 rounded ${
            updateMessage.includes("error") || updateMessage.includes("Error")
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {updateMessage}
        </div>
      )}

      {isDeleting ? (
        <div className="bg-red-50 p-4 rounded-md mb-4">
          <p className="text-red-600 mb-4">
            Are you sure you want to delete this quiz?
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              Confirm Delete
            </button>
            <button
              onClick={() => setIsDeleting(false)}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="col-span-full mb-5">
            <label
              htmlFor="title"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Quiz Title
            </label>
            <div className="mt-2">
              <input
                id="title"
                {...register("title", { required: "Quiz title is required" })}
                type="text"
                className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-1 focus:outline-indigo-600 sm:text-sm/6"
              />
              {errors.title && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.title.message}
                </p>
              )}
            </div>
          </div>

          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">Questions</h2>
              <button
                type="button"
                onClick={addQuestion}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Question
              </button>
            </div>

            {fields.map((field, questionIndex) => (
              <div
                key={field.id}
                className="mb-8 p-6 bg-white border border-gray-200 rounded-lg shadow-sm"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-md font-medium text-gray-900">
                    Question {questionIndex + 1}
                  </h3>
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(questionIndex)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  )}
                </div>

                <div className="mb-4">
                  <label
                    htmlFor={`questions.${questionIndex}.question`}
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Question Text
                  </label>
                  <input
                    {...register(`questions.${questionIndex}.question`, {
                      required: "Question text is required",
                    })}
                    type="text"
                    className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-1 focus:outline-indigo-600 sm:text-sm/6"
                    placeholder="Enter your question here"
                  />
                  {errors.questions?.[questionIndex]?.question && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.questions[questionIndex].question.message}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Options
                  </label>
                  <div className="space-y-3">
                    {[0, 1, 2, 3].map((optionIndex) => (
                      <div key={optionIndex} className="flex items-center">
                        <input
                          type="radio"
                          id={`questions.${questionIndex}.correctOption.${optionIndex}`}
                          {...register(
                            `questions.${questionIndex}.correctOption`
                          )}
                          value={optionIndex}
                          defaultChecked={field.correctOption === optionIndex}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 mr-2"
                        />
                        <input
                          {...register(
                            `questions.${questionIndex}.options.${optionIndex}`,
                            { required: "Option text is required" }
                          )}
                          type="text"
                          className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-1 focus:outline-indigo-600 sm:text-sm/6"
                          placeholder={`Option ${optionIndex + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                  {errors.questions?.[questionIndex]?.options && (
                    <p className="mt-1 text-sm text-red-600">
                      All options are required
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button
              type="button"
              onClick={() => setIsDeleting(true)}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              Delete Quiz
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {isUpdating ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default EditQuiz;
