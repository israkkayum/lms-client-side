import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";
import useAuth from "./useAuth";

const useCourseProgress = (courseId) => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: progressData = { completedLessons: [], progress: 0 }, isLoading } = useQuery({
    queryKey: ["courseProgress", courseId, user?.email],
    queryFn: async () => {
      const response = await axiosSecure.get(`/course-progress/${courseId}/${user?.email}`);
      return response.data;
    },
    enabled: !!courseId && !!user?.email,
  });

  const { mutate: updateProgress } = useMutation({
    mutationFn: async ({ lessonId, completed }) => {
      return await axiosSecure.post(`/course-progress/${courseId}/${user?.email}`, {
        lessonId,
        completed,
        timestamp: new Date().toISOString(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["courseProgress", courseId, user?.email]);
    },
  });

  const markLessonComplete = (lessonId) => {
    updateProgress({ lessonId, completed: true });
  };

  const markLessonIncomplete = (lessonId) => {
    updateProgress({ lessonId, completed: false });
  };

  return {
    progressData,
    isLoading,
    markLessonComplete,
    markLessonIncomplete,
  };
};

export default useCourseProgress;