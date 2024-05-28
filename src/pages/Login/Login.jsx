import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import SocialLogin from "../../components/SocialLogin/SocialLogin";

export default function Login() {
  const {
    register,
    handleSubmit,
    reset,
    // formState: { errors },
  } = useForm();

  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const onSubmit = (data) => {
    // console.log(data);
    signIn(data.email, data.password).then((result) => {
      console.log(result.user);
      navigate(from, { replace: true });
    });
    reset();
  };

  return (
    <>
      <Helmet>
        <title>LMS|| Login</title>
      </Helmet>
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
                  <span>Sign in to your account</span>
                </h1>
                <h2 className="text-sm font-medium text-gray-300 dark:text-gray-500">
                  Welcome, please sign in to your dashboard
                </h2>
              </header>
              {/* END Header */}

              {/* Sign In Form */}
              <div className="flex flex-col overflow-hidden rounded-lg bg-white shadow-sm dark:bg-white-800">
                <div className="grow p-5 md:px-16 md:py-12">
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

                    <button
                      type="submit"
                      className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Sign in
                    </button>
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
                    <SocialLogin></SocialLogin>
                  </form>
                </div>
                <div className="grow bg-gray-100 p-5 text-center text-sm dark:bg-gray-50 md:px-16">
                  Don’t have an account yet?{" "}
                  <NavLink
                    to="/signup"
                    className="font-medium text-indigo-600 hover:text-indigo-400"
                  >
                    Sign up
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
