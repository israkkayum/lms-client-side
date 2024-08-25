import { useRef, Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Alert } from "@mui/material";
import { useForm } from "react-hook-form";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import ButtonSpinner from "../ButtonSpinner/ButtonSpinner";
import { useNavigate } from "react-router-dom";
import useJoinedSites from "../../hooks/useJoinedSites";

const JoinSiteForm = ({ profile, setShowJoinSiteForm }) => {
  const [, , refetch] = useJoinedSites();
  const cancelButtonRef = useRef(null);
  const navigate = useNavigate();

  const email = profile?.email;

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();
  const axiosPublic = useAxiosPublic();

  const onSubmit = async (data) => {
    setLoading(true);
    setMessage("");

    try {
      // Send request to join a site
      const response = await axiosPublic.post("/sites/join", {
        siteName: data.siteName.toLowerCase(),
        password: data.password,
        email: email,
      });

      if (response.status === 200) {
        refetch();
        setSuccess(true);
        setMessage("Successfully joined the site.");
        setTimeout(() => {
          setShowJoinSiteForm(false);
          navigate("/my-institutions");
        }, 1500);
      } else {
        setMessage("Failed to join the site. Please check your credentials.");
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setMessage("Site not found.");
      } else if (error.response?.status === 401) {
        setMessage("Incorrect password.");
      } else if (error.response?.status == 400) {
        setMessage("You are already a member of this site.");
        // console.log(error.response.data?.message);
      } else {
        setMessage("An unexpected error occurred.");
      }
    } finally {
      reset();
      setLoading(false);
    }
  };

  const siteName = watch("siteName");
  const password = watch("password");

  return (
    <div>
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          initialFocus={cancelButtonRef}
          onClose={setShowJoinSiteForm}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full justify-center p-4 text-center items-start">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <button
                    type="button"
                    className="absolute right-5 top-5 text-gray-900 hover:text-gray-300 font-bold bg-gray-200"
                    onClick={() => setShowJoinSiteForm(false)}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                  <div className="bg-white py-5 border-b border-gray-200 text-center text-base font-semibold">
                    Join Site
                  </div>
                  <div className="bg-white px-4 pb-4 sm:pb-4">
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-6">
                        <div className="col-span-full">
                          <div className="mt-2">
                            <input
                              id="site-name"
                              name="siteName"
                              type="text"
                              className="block w-full rounded-md border-0 py-3 text-gray-900 shadow-sm ring-0 ring-inset ring-white-300 placeholder:text-gray-400 focus:ring-0 focus:ring-inset focus:ring-white-600 sm:text-sm sm:leading-6"
                              placeholder="Enter site name..."
                              {...register("siteName", {
                                required: "Site name is required",
                                pattern: {
                                  value: /^[a-zA-Z-]+$/,
                                  message:
                                    "Site name must contain only alphabets and hyphens, no white spaces or special characters.",
                                },
                              })}
                            />
                            {errors.siteName && (
                              <Alert className="mt-3" severity="error">
                                {errors.siteName.message}
                              </Alert>
                            )}
                          </div>
                        </div>

                        <div className="col-span-full">
                          <div className="mt-2">
                            <input
                              id="password"
                              name="password"
                              type="password"
                              className="block w-full rounded-md border-0 py-3 text-gray-900 shadow-sm ring-0 ring-inset ring-white-300 placeholder:text-gray-400 focus:ring-0 focus:ring-inset focus:ring-white-600 sm:text-sm sm:leading-6"
                              placeholder="Enter password..."
                              {...register("password", {
                                required: "Password is required",
                              })}
                            />
                            {errors.password && (
                              <Alert className="mt-3" severity="error">
                                {errors.password.message}
                              </Alert>
                            )}
                          </div>
                        </div>
                      </div>

                      {loading ? (
                        <div className="mt-6">
                          <ButtonSpinner />
                        </div>
                      ) : (
                        <button
                          type="submit"
                          className={
                            siteName && password
                              ? "block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mt-6 mb-2"
                              : "block w-full rounded-md bg-gray-200 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mt-6 mb-2"
                          }
                          disabled={!siteName || !password}
                        >
                          Join
                        </button>
                      )}

                      {message && (
                        <Alert
                          className="my-2"
                          severity={success ? "success" : "error"}
                        >
                          <strong>{message}</strong>
                        </Alert>
                      )}
                    </form>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
};

export default JoinSiteForm;
