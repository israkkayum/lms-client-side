import { useEffect, useState } from "react";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { useOutletContext } from "react-router-dom";
import Spinner from "../../pages/Shared/Spinner/Spinner";
import useAuth from "../../hooks/useAuth";
import useCourses from "../../hooks/useCourses";

const MyGrade = () => {
  const [courseGrades, setCourseGrades] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const axiosPublic = useAxiosPublic();
  const { user } = useAuth();

  const { siteData } = useOutletContext();
  const [courses, isLoading] = useCourses(siteData?._id);

  useEffect(() => {
    const fetchAllGrades = async () => {
      if (!courses || !user?.email) return;

      setLoading(true);
      try {
        const gradesPromises = courses.map((course) =>
          axiosPublic.get(`/grades/${course._id}?email=${user?.email}`)
        );

        const responses = await Promise.all(gradesPromises);
        const gradesData = {};

        responses.forEach((response, index) => {
          gradesData[courses[index]._id] = {
            courseName: courses[index].courseName,
            ...response.data,
          };
        });

        setCourseGrades(gradesData);
        setError(null);
      } catch (err) {
        setError("Failed to fetch grades. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllGrades();
  }, [courses, user?.email, axiosPublic]);

  if (loading || isLoading) return <Spinner />;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">My Grades</h2>

      <div className="grid grid-cols-1 gap-8">
        {Object.entries(courseGrades).map(([courseId, courseData]) => (
          <div
            key={courseId}
            className="bg-white shadow-md rounded-lg overflow-hidden"
          >
            <div className="p-6 bg-gray-50 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                {courseData.courseName}
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Max Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submission Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Feedback
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {courseData?.assignments?.map((assignment, index) => (
                    <tr
                      key={`assignment-${index}`}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                        Assignment
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {assignment.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {assignment.score} / {assignment.maxScore}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {assignment.maxScore}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(
                          assignment.submissionDate
                        ).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {assignment.feedback || "-"}
                      </td>
                    </tr>
                  ))}
                  {courseData?.quizzes?.map((quiz, index) => (
                    <tr key={`quiz-${index}`} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                        Quiz
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {quiz.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {quiz.score} / {quiz.maxScore}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {quiz.maxScore}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(quiz.submissionDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {quiz.feedback || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {!courseData?.assignments?.length &&
            !courseData?.quizzes?.length ? (
              <div className="text-center py-8 text-gray-500">
                No grades available for this course yet.
              </div>
            ) : (
              <div className="p-6 bg-gray-50 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900">
                    Overall Grade
                  </span>
                  <span className="text-lg font-semibold text-indigo-600">
                    {courseData.overallGrade}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}

        {Object.keys(courseGrades).length === 0 && (
          <div className="text-center py-8 text-gray-500 bg-white shadow-md rounded-lg">
            No courses found or no grades available.
          </div>
        )}
      </div>
    </div>
  );
};

export default MyGrade;
