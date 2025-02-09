import LatestCourses from "./LatestCourses";

const HomePage = () => {
  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-8 mt-20">
      <div className="items-start justify-between md:flex">
        <div className="max-w-lg">
          <h3 className="text-gray-800 text-xl font-bold sm:text-2xl">
            Announcements
          </h3>
          {/* <p className="text-gray-600 mt-2">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry.
          </p> */}
        </div>
        <div className="mt-3 md:mt-0">
          <a
            href="javascript:void(0)"
            className="inline-block px-4 py-2 text-white duration-150 font-medium bg-indigo-600 rounded-lg hover:bg-indigo-500 active:bg-indigo-700 md:text-sm"
          >
            + Add announcement
          </a>
        </div>
      </div>

      <div className="flex justify-between p-4 rounded-md bg-blue-50 border border-blue-300 mt-10">
        <div className="flex gap-3 sm:items-center">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-blue-600 sm:text-sm">
            “The new semester begins on February 1st, 2025. Please ensure you
            have completed all necessary enrollments and course registrations by
            January 30th, 2025.”
          </p>
        </div>
      </div>
      <div className="flex justify-between p-4 rounded-md bg-blue-50 border border-blue-300 mt-5">
        <div className="flex gap-3 sm:items-center">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-blue-600 sm:text-sm leading-10">
            “The LMS platform will undergo maintenance on Saturday, January
            20th, 2025, from 12:00 AM to 4:00 AM (UTC). During this time, the
            platform will be temporarily unavailable. We apologize for any
            inconvenience caused.”
          </p>
        </div>
      </div>
      <LatestCourses />
    </div>
  );
};

export default HomePage;
