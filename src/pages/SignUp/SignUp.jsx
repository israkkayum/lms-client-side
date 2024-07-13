import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import SocialLogin from "../../components/SocialLogin/SocialLogin";
import ReactHelmet from "../../components/ReactHelmet/ReactHelmet";
import { useState } from "react";
import ButtonSpinner from "../../components/ButtonSpinner/ButtonSpinner";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";

export default function SignUp() {
  const axiosPublic = useAxiosPublic();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const { createUser, updateUserProfile, user, deleteUserAccount } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      // Create user account
      await createUser(data.email, data.password);

      // Update user profile
      await updateUserProfile(data.name);

      // Prepare user info for the API request
      const userInfo = {
        name: data.name,
        email: data.email,
      };

      // Send user info to the backend
      const response = await axiosPublic.post("/users", userInfo);

      if (response.data.insertedId) {
        navigate("/");
      } else {
        setMessage("Account created, but failed to save additional details.");
        await deleteUserAccount(); // Remove the created account from Firebase
      }
    } catch (error) {
      // Differentiate errors
      if (error.message.includes("email")) {
        setMessage("An account with this email already exists!");
      } else if (error.response && error.response.status >= 500) {
        setMessage(
          "Account created, but failed to save additional details due to a server error."
        );
      } else {
        setMessage(error.message || "An unexpected error occurred.");
      }

      // If the user was created, delete the account
      if (user) {
        try {
          await deleteUserAccount();
        } catch (deleteError) {
          setMessage("Failed to clean up the created account after an error.");
        }
      }
    } finally {
      reset();
      setLoading(false);
    }
  };

  const password = watch("password");

  return (
    <>
      <ReactHelmet title={"LMS - Sign Up"}></ReactHelmet>
      {/* Pages: Sign In: Boxed */}

      {/* Page Container */}
      <div
        id="page-container"
        className="mx-auto flex min-h-dvh w-full min-w-[320px] flex-col bg-gray-200 dark:bg-gray-100 dark:text-gray-800"
      >
        {/* Page Content */}
        <main id="page-content" className="flex max-w-full flex-auto flex-col">
          <div className="relative mx-auto flex min-h-dvh w-full max-w-10xl items-center justify-center overflow-hidden p-4 lg:p-8">
            {/* Sign In Section */}
            <section className="w-full max-w-xl py-6">
              {/* Header */}
              <header className="mb-10 text-center">
                <h1 className="mb-2 inline-flex items-center gap-2 text-2xl font-bold">
                  <span>Create an Account</span>
                </h1>
                <h2 className="text-sm font-medium text-gray-500 dark:text-gray-500">
                  Welcome, please sign up to your dashboard
                </h2>
              </header>
              {/* END Header */}

              {/* Sign In Form */}
              <div className="flex flex-col overflow-hidden rounded-lg bg-white shadow-sm dark:bg-white-800">
                <div className="grow p-5 md:px-16 md:py-12">
                  {message && <ErrorMessage message={message}></ErrorMessage>}
                  <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm leading-6 text-gray-900 after:content-['*'] after:ml-0.5 after:text-red-500"
                      >
                        Full Name
                      </label>
                      <div className="mt-2">
                        <input
                          id="name"
                          name="name"
                          type="text"
                          autoComplete="name"
                          {...register("name", { required: true })}
                          required
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 font-medium shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm leading-6 text-gray-900 after:content-['*'] after:ml-0.5 after:text-red-500"
                      >
                        Email
                      </label>
                      <div className="mt-2">
                        <input
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          required
                          {...register("email", { required: true })}
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 font-medium shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <label
                          htmlFor="password"
                          className="block text-sm leading-6 text-gray-900 after:content-['*'] after:ml-0.5 after:text-red-500"
                        >
                          Password
                        </label>
                      </div>
                      <div className="mt-2">
                        <input
                          id="password"
                          name="password"
                          type="password"
                          autoComplete="current-password"
                          {...register("password", {
                            required: true,
                            pattern:
                              /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,}$/,
                          })}
                          required
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 font-medium shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                    {errors.password?.type === "pattern" && (
                      <>
                        <div
                          className="flex p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-100 dark:text-red-500"
                          role="alert"
                        >
                          <svg
                            className="flex-shrink-0 inline w-4 h-4 me-3 mt-[2px]"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                          </svg>
                          <span className="sr-only">Danger</span>
                          <div>
                            <span className="font-medium">
                              Ensure that these requirements are met:
                            </span>
                            <ul className="mt-1.5 list-disc list-inside">
                              <li>Be at least 8 characters long</li>
                              <li>Include at least one uppercase letter</li>
                              <li>Include at least one lowercase letter</li>
                              <li>Include at least one digit</li>
                              <li>Include at least one special character</li>
                            </ul>
                          </div>
                        </div>
                      </>
                    )}

                    <div>
                      <div className="flex items-center justify-between">
                        <label
                          htmlFor="confirm-password"
                          className="block text-sm leading-6 text-gray-900 after:content-['*'] after:ml-0.5 after:text-red-500"
                        >
                          Confirm
                        </label>
                      </div>
                      <div className="mt-2">
                        <input
                          id="confirm-password"
                          name="confirmPassword"
                          type="password"
                          autoComplete="confirmPassword"
                          required
                          {...register("confirmPassword", {
                            required: true,
                            validate: (value) => value === password,
                          })}
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 font-medium shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                    {errors.confirmPassword && (
                      <div
                        className="flex items-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-100 dark:text-red-500"
                        role="alert"
                      >
                        <svg
                          className="flex-shrink-0 inline w-4 h-4 me-3"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                        </svg>
                        <span className="sr-only">Info</span>
                        <div>Passwords do not match</div>
                      </div>
                    )}

                    {loading ? (
                      <ButtonSpinner></ButtonSpinner>
                    ) : (
                      <button
                        type="submit"
                        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        Register
                      </button>
                    )}
                    {/* Divider: With Label */}
                    <div className="my-5 flex items-center">
                      <span
                        aria-hidden="true"
                        className="h-0.5 grow rounded bg-gray-200 dark:bg-gray-100"
                      />
                      <span className="rounded-full bg-gray-200 px-3 py-1 text-xs font-medium text-gray-900 dark:bg-gray-100 dark:text-gray-900">
                        or sign up with
                      </span>
                      <span
                        aria-hidden="true"
                        className="h-0.5 grow rounded bg-gray-200 dark:bg-gray-100"
                      />
                    </div>
                    {/* END Divider: With Label */}
                    <SocialLogin
                      setLoading={setLoading}
                      setMessage={setMessage}
                    ></SocialLogin>
                  </form>
                </div>
                <div className="grow bg-gray-100 p-5 text-center text-sm dark:bg-gray-50 md:px-16">
                  Already have an account?{" "}
                  <NavLink
                    to="/login"
                    className="font-medium text-indigo-600 hover:text-indigo-400"
                  >
                    Sign in
                  </NavLink>
                </div>
              </div>
              {/* END Sign In Form */}
            </section>
            {/* END Sign In Section */}
          </div>
        </main>
        {/* END Page Content */}
      </div>
      {/* END Page Container */}

      {/* END Pages: Sign In: Boxed */}
    </>
  );
}
