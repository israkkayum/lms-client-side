import { useRef, Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Alert } from "@mui/material";
import { useForm } from "react-hook-form";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import ButtonSpinner from "../ButtonSpinner/ButtonSpinner";
import { useNavigate } from "react-router-dom";

const NewSiteCreate = ({ profile, setShowNewSiteCreate }) => {
  const cancelButtonRef = useRef(null);
  const navigate = useNavigate();

  const email = profile?.email;
  const date = new Date().toDateString();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();
  const axiosPublic = useAxiosPublic();

  //	Generate Random Password Function
  const generateRandomPassword = (length) => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let password = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      password += characters[randomIndex];
    }
    return password;
  };

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      // Check if siteName is available
      const checkResponse = await axiosPublic.get("/sites/check-site-name", {
        params: { siteName: data.siteName.toLowerCase() },
      });

      // If the site name exists, show the error message
      if (checkResponse.status === 409) {
        setMessage("Site name already exists. Please choose another name.");
        setLoading(false);
        return;
      }

      // Generate a unique password with a length of 5-7 characters
      const passwordLength = Math.floor(Math.random() * 3) + 5;
      const uniquePassword = generateRandomPassword(passwordLength);

      const siteInfo = {
        createdBy: email,
        siteName: data.siteName.toLowerCase(),
        password: uniquePassword,
        date: date,
      };

      // Send site info to the backend
      const response = await axiosPublic.post("/sites", siteInfo);
      if (response.data.insertedId) {
        setShowNewSiteCreate(false);
        navigate("/profile-settings");
      } else {
        setMessage("Failed to save site details.");
      }
    } catch (error) {
      if (error.response?.status === 409) {
        setMessage("Site name already exists. Please choose another name.");
      } else {
        setMessage(error.message || "An unexpected error occurred.");
      }
    } finally {
      reset();
      setLoading(false);
    }
  };

  const siteName = watch("siteName");
  // console.log(watch("siteName"));

  return (
    <div>
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          initialFocus={cancelButtonRef}
          onClose={setShowNewSiteCreate}
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
                    onClick={() => setShowNewSiteCreate(false)}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                  <div className="bg-white py-5 border-b border-gray-200 text-center text-base font-semibold">
                    Create New Site
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
                              placeholder="Type site name...."
                              {...register("siteName", {
                                required: true,
                                pattern: /^[a-zA-Z-]+$/,
                              })}
                            />
                            {errors.siteName?.type === "pattern" && (
                              <Alert className="mt-3" severity="error">
                                Site name must contain only alphabets and
                                hyphens, and no white spaces or special
                                characters.
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
                            siteName
                              ? "block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mt-6 mb-2"
                              : "block w-full rounded-md bg-gray-200 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mt-6 mb-2"
                          }
                          disabled={siteName ? false : true}
                        >
                          Create
                        </button>
                      )}

                      {message && (
                        <Alert className="my-2" severity="error">
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

export default NewSiteCreate;
