import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Editor } from "@tinymce/tinymce-react";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import { useOutletContext } from "react-router-dom";

const SiteHomeSettings = () => {
  const { siteData } = useOutletContext();
  // console.log(siteData._id);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();
  const axiosPublic = useAxiosPublic();

  const [success, setSuccess] = useState(false);
  const [messageActive, setMessageActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Pre-fill form fields with current site settings
  useEffect(() => {
    if (siteData) {
      setValue("fullSiteName", siteData.fullSiteName || "");
      setValue("shortSiteName", siteData.shortSiteName || "");
      setValue("siteSummary", siteData.siteSummary || "");
    }
  }, [siteData, setValue]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    setMessageActive(false);

    try {
      // Use siteData._id in the endpoint
      const response = await axiosPublic.put(
        `/sites/${siteData?._id}/home-settings`,
        data
      );
      if (response.data.acknowledged) {
        setSuccess(true);
      } else {
        setSuccess(false);
      }
    } catch (error) {
      // console.error("Failed to update site settings:", error);
      setSuccess(false);
    } finally {
      setMessageActive(true);
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 my-20">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold text-gray-900">
              Site Home Settings
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              This information will be displayed publicly, so be careful what
              you share.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-y-8 sm:grid-cols-6 gap-x-6">
              {/* Full Site Name */}
              <div className="sm:col-span-4">
                <label
                  htmlFor="fullSiteName"
                  className="block text-sm font-medium text-gray-900"
                >
                  Full Site Name
                </label>
                <input
                  id="fullSiteName"
                  type="text"
                  className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                  {...register("fullSiteName", {
                    required: "This field is required",
                  })}
                />
                {errors.fullSiteName && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.fullSiteName.message}
                  </p>
                )}
              </div>

              {/* Short Site Name */}
              <div className="sm:col-span-4">
                <label
                  htmlFor="shortSiteName"
                  className="block text-sm font-medium text-gray-900"
                >
                  Short Site Name
                </label>
                <input
                  id="shortSiteName"
                  type="text"
                  className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                  {...register("shortSiteName", {
                    required: "This field is required",
                  })}
                />
                {errors.shortSiteName && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.shortSiteName.message}
                  </p>
                )}
              </div>

              {/* Site Summary */}
              <div className="col-span-full">
                <label
                  htmlFor="siteSummary"
                  className="block text-sm font-medium text-gray-900"
                >
                  Site Home Summary
                </label>
                <Editor
                  id="siteSummary"
                  apiKey="j16dob6t2wqd6tlj8jgjd5b46jnn37755eeqhemhbzi7pucz"
                  initialValue={siteData?.siteSummary || ""}
                  init={{
                    height: 200,
                    menubar: false,
                    plugins: [
                      "advlist autolink lists link image charmap print preview anchor",
                      "searchreplace visualblocks code fullscreen",
                      "insertdatetime media table paste code help wordcount",
                    ],
                    toolbar:
                      "undo redo | formatselect | bold italic backcolor | \
                      alignleft aligncenter alignright alignjustify | \
                      bullist numlist outdent indent | removeformat | help",
                  }}
                  onEditorChange={(content) => setValue("siteSummary", content)}
                />
                <input
                  type="hidden"
                  {...register("siteSummary", {
                    required: "This field is required",
                  })}
                  value={watch("siteSummary") || ""}
                />
                {errors.siteSummary && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.siteSummary.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Submit and Feedback */}
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button type="button" className="text-sm font-semibold text-gray-900">
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className={`rounded-md px-3 py-2 text-sm font-semibold shadow-sm focus:ring-2 focus:ring-offset-2 ${
              isLoading
                ? "bg-gray-500"
                : "bg-indigo-600 text-white hover:bg-indigo-500"
            }`}
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </div>
        {messageActive && (
          <div
            className={`mt-4 rounded-lg p-4 ${
              success ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
            }`}
          >
            {success
              ? "Settings updated successfully!"
              : "An error occurred. Please try again."}
          </div>
        )}
      </form>
    </div>
  );
};

export default SiteHomeSettings;
