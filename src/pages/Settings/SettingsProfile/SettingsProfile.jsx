import { useState } from "react";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import { useForm } from "react-hook-form";

const SettingsProfile = ({ profile }) => {
  const {
    name,
    email,
    phoneNumber,
    websiteURL,
    twitterURL,
    linkedInURL,
    youTubeURL,
    faceBookURL,
    about,
  } = profile;

  const axiosPublic = useAxiosPublic();
  const { register, handleSubmit } = useForm();

  const [success, setSuccess] = useState(true);
  const [messageActive, setMessageActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // form submit

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      // Prepare user info for the API request
      const userInfo = {
        name: data.name,
        email: email,
        phoneNumber: data.phoneNumber,
        websiteURL: data.websiteURL,
        twitterURL: data.twitterURL,
        linkedInURL: data.linkedInURL,
        youTubeURL: data.youTubeURL,
        faceBookURL: data.faceBookURL,
        about: data.about,
      };

      // Send user info to the backend
      const response = await axiosPublic.put("/users-info", userInfo);

      if (response.data.acknowledged) {
        setSuccess(true);
      } else {
        setSuccess(false);
      }
    } catch (error) {
      setSuccess(false);
    } finally {
      setMessageActive(true);
      setIsLoading(false);
    }
  };

  return (
    <div className="m-7">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Profile
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              This information will be displayed publicly so be careful what you
              share.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label
                  htmlFor="firstName"
                  className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium leading-6 text-gray-900"
                >
                  Full Name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    autoComplete="given-name"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    defaultValue={name}
                    {...register("name", { required: true })}
                    required
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="email"
                  className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium leading-6 text-gray-900"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    defaultValue={email}
                    disabled
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Phone number
                </label>
                <div className="mt-2">
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="number"
                    autoComplete="phoneNumber"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    {...register("phoneNumber")}
                    defaultValue={phoneNumber}
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="website-url"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Website URL
                </label>
                <div className="mt-2">
                  <input
                    id="websiteURL"
                    name="websiteURL"
                    type="text"
                    autoComplete="websiteURL"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    {...register("websiteURL")}
                    defaultValue={websiteURL}
                  />
                </div>
              </div>
              <div className="sm:col-span-3">
                <label
                  htmlFor="twitter-url"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  X (Twitter)
                </label>
                <div className="mt-2">
                  <input
                    id="twitterURL"
                    name="twitterURL"
                    type="text"
                    autoComplete="twitterURL"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    {...register("twitterURL")}
                    defaultValue={twitterURL}
                  />
                </div>
              </div>
              <div className="sm:col-span-3">
                <label
                  htmlFor="linkedIn-url"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  LinkedIn
                </label>
                <div className="mt-2">
                  <input
                    id="linkedInURL"
                    name="linkedInURL"
                    type="text"
                    autoComplete="linkedInURL"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    {...register("linkedInURL")}
                    defaultValue={linkedInURL}
                  />
                </div>
              </div>
              <div className="sm:col-span-3">
                <label
                  htmlFor="youTube-url"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  YouTube
                </label>
                <div className="mt-2">
                  <input
                    id="youTubeURL"
                    name="youTubeURL"
                    type="text"
                    autoComplete="youTubeURL"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    {...register("youTubeURL")}
                    defaultValue={youTubeURL}
                  />
                </div>
              </div>
              <div className="sm:col-span-3">
                <label
                  htmlFor="faceBook-url"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Facebook
                </label>
                <div className="mt-2">
                  <input
                    id="faceBookURL"
                    name="faceBookURL"
                    type="text"
                    autoComplete="faceBookURL"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    {...register("faceBookURL")}
                    defaultValue={faceBookURL}
                  />
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="about"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  About
                </label>
                <div className="mt-2">
                  <textarea
                    id="about"
                    name="about"
                    rows={3}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    {...register("about")}
                    defaultValue={about}
                  />
                </div>
                <p className="mt-3 text-sm leading-6 text-gray-600">
                  Write a few sentences about yourself.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="button"
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            Cancel
          </button>
          {isLoading ? (
            <button
              disabled
              type="button"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <svg
                aria-hidden="true"
                role="status"
                className="inline w-4 h-4 mr-3 text-white animate-spin"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="#E5E7EB"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentColor"
                />
              </svg>
              Loading
            </button>
          ) : (
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              disabled={email ? false : true}
            >
              Save
            </button>
          )}
        </div>
      </form>

      <div className="my-2">
        {/* // successful message //  */}
        {messageActive && (
          <div
            className={
              success
                ? "flex items-center justify-center p-4 text-sm font-bold text-green-800 rounded-lg bg-green-50 mt-10 -mb-2 mx-auto max-w-xl"
                : "flex items-center justify-center p-4 text-sm font-bold text-red-800 rounded-lg bg-red-50 mt-10 -mb-2 mx-auto max-w-xl"
            }
            role="alert"
          >
            <svg
              className="flex-shrink-0 inline w-4 h-4 mr-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
            </svg>
            <span className="sr-only">Info</span>
            {success ? (
              <div>Successfully submitted!</div>
            ) : (
              <div>Your submission failed, please try again</div>
            )}
          </div>
        )}

        {/* /// */}
      </div>
    </div>
  );
};

export default SettingsProfile;
