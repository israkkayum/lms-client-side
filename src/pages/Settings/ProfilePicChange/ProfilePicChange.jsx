import { UserCircleIcon } from "@heroicons/react/24/solid";
import { Alert } from "@mui/material";

const ProfilePicChange = (props) => {
  const {
    successMessage,
    tempAvatar,
    setTempAvatar,
    profile,
    loading,
    avatar,
    handleRequestSubmit,
    handleOnChange,
  } = props;

  return (
    <div
      className="border-b border-gray-900/10 pb-5"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div>
        {successMessage && (
          <Alert className="my-2" severity="success">
            <strong>Successful !!</strong>
          </Alert>
        )}

        {tempAvatar ? (
          <img
            className="inline-block h-40 w-40 my-2 rounded-full ring-2 ring-white"
            src={tempAvatar}
            alt=""
          />
        ) : profile.profilePic ? (
          <img
            className="inline-block h-40 w-40 my-3 rounded-full ring-2 ring-white"
            src={`data:image/png;base64,${profile.profilePic}`}
            alt=""
          />
        ) : (
          <UserCircleIcon
            className="h-40 w-40 text-gray-300"
            aria-hidden="true"
          />
        )}

        <form onSubmit={handleRequestSubmit} className="flex justify-center">
          {loading ? (
            <button
              type="button"
              className="px-4 py-1 text-sm text-indigo-600 font-semibold rounded-md border border-indigo-200 hover:text-white hover:bg-indigo-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 mt-3"
              disabled
            >
              Processing...
            </button>
          ) : tempAvatar && avatar && !successMessage ? (
            <div className="flex space-x-2">
              <button
                type="submit"
                className="px-4 py-1 text-sm text-indigo-600 font-semibold rounded-md border border-indigo-200 hover:text-white hover:bg-indigo-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 mt-3"
              >
                Submit
              </button>
              <button
                onClick={() => setTempAvatar(null)}
                className="px-4 py-1 text-sm text-indigo-600 font-semibold rounded-md border border-indigo-200 hover:text-white hover:bg-indigo-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 mt-3"
              >
                Cancel
              </button>
            </div>
          ) : (
            <label
              htmlFor="photo-upload"
              className="px-4 py-1 text-sm text-indigo-600 font-semibold rounded-md border border-indigo-200 hover:text-white hover:bg-indigo-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 cursor-pointer"
            >
              <input
                id="photo-upload"
                type="file"
                className="sr-only"
                accept="image/*"
                required
                onChange={(e) => handleOnChange(e.target.files[0])}
              />
              <span> Change </span>
            </label>
          )}
        </form>
      </div>
    </div>
  );
};

export default ProfilePicChange;
