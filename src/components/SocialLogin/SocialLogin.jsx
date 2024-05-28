import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useAxiosPublic from "../../hooks/useAxiosPublic";

const SocialLogin = ({ setLoading, setMessage }) => {
  const { googleSignIn, facebookSignIn } = useAuth();
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setMessage("");

    try {
      const result = await googleSignIn();
      const userInfo = {
        email: result.user?.email,
        name: result.user?.displayName,
      };
      const res = await axiosPublic.post("/users", userInfo);
      console.log(res.data);
      navigate("/");
    } catch (error) {
      setMessage(
        error.message || "Failed to sign in with Google. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookSignIn = async () => {
    setLoading(true);
    setMessage("");

    try {
      const result = await facebookSignIn();
      const userInfo = {
        email: result.user?.email,
        name: result.user?.displayName,
      };
      const res = await axiosPublic.post("/users", userInfo);
      console.log(res.data);
      navigate("/");
    } catch (error) {
      setMessage(
        error.message || "Failed to sign in with Facebook. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      <button
        type="button"
        className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-400 bg-white px-3 py-2 text-sm leading-5 text-gray-900 hover:border-gray-300 hover:text-gray-900 hover:shadow-sm focus:ring focus:ring-gray-100 active:border-gray-100 active:shadow-none dark:border-gray-200 dark:text-gray-900 dark:hover:border-gray-100 dark:hover:text-gray-900 dark:focus:ring-gray-100 dark:active:border-gray-100"
        onClick={handleGoogleSignIn}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="0.98em"
          height="1em"
          viewBox="0 0 262 268"
        >
          <path
            fill="#4285f4"
            d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
          />
          <path
            fill="#34a853"
            d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
          />
          <path
            fill="#fbbc05"
            d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
          />
          <path
            fill="#eb4335"
            d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
          />
        </svg>
        <span>Google</span>
      </button>
      <button
        type="button"
        className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-400 bg-white px-3 py-2 text-sm leading-5 text-gray-900 hover:border-gray-300 hover:text-gray-900 hover:shadow-sm focus:ring focus:ring-gray-100 active:border-gray-100 active:shadow-none dark:border-gray-200 dark:text-gray-900 dark:hover:border-gray-100 dark:hover:text-gray-900 dark:focus:ring-gray-100 dark:active:border-gray-100"
        onClick={handleFacebookSignIn}
      >
        <svg
          className="bi bi-facebook inline-block size-4 text-[#1877f2]"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 16 16"
          aria-hidden="true"
        >
          <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
        </svg>
        <span>Facebook</span>
      </button>
    </div>
  );
};

export default SocialLogin;
