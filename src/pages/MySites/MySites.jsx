import { PlusIcon } from "@heroicons/react/24/outline";
import useSites from "../../hooks/useSites";
import Spinner from "../Shared/Spinner/Spinner";
import useProfile from "../../hooks/useProfile";
import { useState } from "react";
import CreateSiteForm from "../../components/CreateSiteForm/CreateSiteForm";

const MySites = () => {
  const [sites, isLoading] = useSites();
  const [profile] = useProfile();
  const [showCreateSiteForm, setShowCreateSiteForm] = useState(false);

  if (isLoading) {
    return <Spinner />;
  }

  // console.log(sites);

  if (!sites.length) {
    return (
      <>
        {" "}
        {showCreateSiteForm && (
          <CreateSiteForm
            profile={profile}
            setShowCreateSiteForm={setShowCreateSiteForm}
          />
        )}
        <div className="flex flex-col items-center justify-center mt-28 text-center">
          {/* Icon */}
          <div className="p-4 mb-4 text-gray-500 border border-dashed rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672ZM12 2.25V4.5m5.834.166-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243-1.59-1.59"
              />
            </svg>
          </div>

          {/* Title */}
          <h2 className="mb-2 text-md font-semibold text-gray-900">No sites</h2>

          {/* Subtitle */}
          <p className="mb-7 text-sm text-gray-500">
            Get started by creating a new site.
          </p>

          {/* Button */}
          <button
            className="flex items-center gap-2 px-4 py-1.5 text-sm text-white duration-150 bg-indigo-600 rounded-lg hover:bg-indigo-500 active:bg-indigo-700"
            onClick={() => setShowCreateSiteForm(true)}
          >
            <PlusIcon class="h-5 w-5 text-white font-bold" />
            New Site
          </button>
        </div>
      </>
    );
  }

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-16 lg:px-8 lg:py-32 xl:max-w-7xl">
        <div className="max-w-screen-xl mx-auto px-4 md:px-8">
          <div className="text-center">
            <h3 className="text-gray-800 text-xl font-bold sm:text-2xl">
              My sites
            </h3>
          </div>
          <div className="mt-12 shadow-sm border rounded-lg overflow-x-auto">
            <table className="w-full table-auto text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                <tr>
                  <th className="py-3 px-6">Site Name</th>
                  <th className="py-3 px-6">Password</th>
                  <th className="py-3 px-6">Created Date</th>
                  <th className="py-3 px-6"></th>
                </tr>
              </thead>
              <tbody className="text-gray-600 divide-y">
                {sites.map((item, idx) => (
                  <tr key={idx}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.siteName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.password}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.date}</td>
                    <td className="text-right px-6 whitespace-nowrap">
                      <a
                        href="javascript:void()"
                        className="py-2 px-3 font-medium text-indigo-600 hover:text-indigo-500 duration-150 hover:bg-gray-50 rounded-lg"
                      >
                        Manage
                      </a>
                      <button
                        href="javascript:void()"
                        className="py-2 leading-none px-3 font-medium text-red-600 hover:text-red-500 duration-150 hover:bg-gray-50 rounded-lg"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MySites;
