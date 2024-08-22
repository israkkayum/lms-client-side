import { useForm } from "react-hook-form";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import SocialLogin from "../../components/SocialLogin/SocialLogin";
import { useState } from "react";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import ReactHelmet from "../../components/ReactHelmet/ReactHelmet";
import ButtonSpinner from "../../components/ButtonSpinner/ButtonSpinner";

export default function Login() {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    // formState: { errors },
  } = useForm();

  const { resetPassword } = useAuth();
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const onSubmit = async (data) => {
    setLoading(true);
    setMessage("");

    try {
      await signIn(data.email, data.password);
      navigate(from, { replace: true });
    } catch (error) {
      setMessage(
        "Email or password incorrect! Please try again." || error.message
      );
    } finally {
      reset();
      setLoading(false);
    }
  };

  const handleResetPassword = async (email) => {
    if (!email) {
      setMessage("Please enter your email to reset your password.");
      return;
    }

    try {
      await resetPassword(email);
      setMessage("Password reset email sent. Please check your inbox.");
    } catch (error) {
      setMessage(
        error.message || "Failed to reset password. Please try again."
      );
    }
  };

  const emailValue = watch("email");

  return (
    <>
      <ReactHelmet title={"LMS - Login"}></ReactHelmet>

      <div
        id="page-container"
        className="mx-auto flex min-h-dvh w-full min-w-[320px] flex-col bg-gray-200 dark:bg-gray-100 dark:text-gray-800"
      >
        <main id="page-content" className="flex max-w-full flex-auto flex-col">
          <div className="relative mx-auto flex min-h-dvh w-full max-w-10xl items-center justify-center overflow-hidden p-4 lg:p-8">
            <section className="w-full max-w-xl py-6">
              <header className="mb-10 text-center">
                <h1 className="mb-2 inline-flex items-center gap-2 text-2xl font-bold">
                  <span>Sign in to your account</span>
                </h1>
                <h2 className="text-sm font-medium text-gray-300 dark:text-gray-500">
                  Welcome, please sign in to your dashboard
                </h2>
              </header>

              <div className="flex flex-col overflow-hidden rounded-lg bg-white shadow-sm dark:bg-white-800">
                <div className="grow p-5 md:px-16 md:py-12">
                  {message && <ErrorMessage message={message}></ErrorMessage>}
                  <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
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
                        <div className="text-sm">
                          <NavLink
                            onClick={() => handleResetPassword(emailValue)}
                            className="text-indigo-600 hover:text-indigo-500"
                          >
                            Forgot password?
                          </NavLink>
                        </div>
                      </div>
                      <div className="mt-2">
                        <input
                          id="password"
                          name="password"
                          type="password"
                          autoComplete="current-password"
                          {...register("password", {
                            required: true,
                          })}
                          required
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 font-medium shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    {loading ? (
                      <ButtonSpinner></ButtonSpinner>
                    ) : (
                      <button
                        type="submit"
                        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        Sign in
                      </button>
                    )}

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

                    <SocialLogin
                      setLoading={setLoading}
                      setMessage={setMessage}
                    ></SocialLogin>
                  </form>
                </div>
                <div className="grow bg-gray-100 p-5 text-center text-sm dark:bg-gray-50 md:px-16">
                  Don’t have an account yet?{" "}
                  <NavLink
                    to="/register"
                    className="font-medium text-indigo-600 hover:text-indigo-400"
                  >
                    Sign up
                  </NavLink>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </>
  );
}
