import { useState } from "react";
import { Container } from "@mui/system";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import useAuth from "../../../hooks/useAuth";

import { Alert } from "@mui/material";
import ProfilePicChange from "../ProfilePicChange/ProfilePicChange";
import DeleteAccount from "../DeleteAccount/DeleteAccount";
import Spinner from "../../Shared/Spinner/Spinner";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosPublic from "../../../hooks/useAxiosPublic";

const SettingsHome = () => {
  const { user, emailVerification, deleteUserAccount } = useAuth();
  const [message, setMessage] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [tempAvatar, setTempAvatar] = useState(null);
  const [successMessage, setSuccessMessage] = useState(false);
  const [loading, setLoading] = useState(false);

  const axiosSecure = useAxiosSecure();
  const axiosPublic = useAxiosPublic();
  const queryClient = useQueryClient();

  // console.log(user);

  const handleEmailVerification = (e) => {
    emailVerification();
    setMessage(true);
    e.preventDefault();
  };

  const handleOnChange = (e) => {
    setAvatar(e);
    const file = e;
    const reader = new FileReader();
    reader.onload = () => {
      setTempAvatar(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRequestSubmit = (e) => {
    setLoading(true);

    if (avatar) {
      const formData = new FormData();
      formData.append("email", user.email);
      formData.append("profilePic", avatar);

      axiosPublic
        .put("/users/profilePic", formData)
        .then((response) => {
          const data = response.data;
          setSuccessMessage(data.acknowledged);
          setLoading(false);
          queryClient.invalidateQueries({ queryKey: ["profile"] });
        })
        .catch((error) => {
          console.error("Error:", error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }

    e.preventDefault();
  };

  const handleDeleteUser = async (id) => {
    try {
      await axiosSecure.delete(`/users/${id}`);
      deleteUserAccount();
      window.location.reload();
    } catch (error) {
      console.error("Error deleting user account:", error);
    }
  };

  const { data: profile = [], isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user?.email}`);
      return res.data;
    },
  });

  // console.log(profile);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      {profile?.email ? (
        <div>
          <Container maxWidth="lg" sx={{ py: 10 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    "& > :not(style)": {
                      m: 1,
                      width: "100%",
                      height: "100%",
                    },
                  }}
                >
                  <Paper elevation={3}>
                    <ProfilePicChange
                      key={profile.email}
                      successMessage={successMessage}
                      avatar={avatar}
                      tempAvatar={tempAvatar}
                      setTempAvatar={setTempAvatar}
                      loading={loading}
                      handleOnChange={handleOnChange}
                      handleRequestSubmit={handleRequestSubmit}
                      profile={profile}
                    ></ProfilePicChange>

                    {message && (
                      <Alert severity="info" className="mb-3">
                        An email has been sent to your given address. Please
                        click the link in the mail to continue. After click the
                        link please reload this page.
                      </Alert>
                    )}

                    <ul className="divide-y divide-gray-100 mx-5">
                      <li className="flex justify-between gap-x-6 py-5">
                        <div className="flex min-w-0 gap-x-4">
                          <div className="min-w-0 flex-auto">
                            <p className="text-sm font-semibold leading-6 text-gray-900">
                              Profile type
                            </p>
                          </div>
                        </div>
                        <div className="shrink-0 sm:flex sm:flex-col sm:items-end">
                          <p className="text-sm leading-6 text-gray-900">
                            <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                              {profile.status}
                            </span>
                          </p>
                        </div>
                      </li>
                      <li className="flex justify-between gap-x-6 py-5">
                        <div className="flex min-w-0 gap-x-4">
                          <div className="min-w-0 flex-auto">
                            <p className="text-sm font-semibold leading-6 text-gray-900">
                              Profile status
                            </p>
                          </div>
                        </div>
                        <div className=" shrink-0 sm:flex sm:flex-col sm:items-end">
                          <p className="text-sm leading-6 text-gray-900">
                            {profile?.phoneNumber ? (
                              <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                completed
                              </span>
                            ) : (
                              <span className="inline-flex items-center rounded-md bg-pink-50 px-2 py-1 text-xs font-medium text-pink-700 ring-1 ring-inset ring-pink-700/10">
                                incomplete
                              </span>
                            )}
                          </p>
                        </div>
                      </li>
                      <li className="flex justify-between gap-x-6 py-5">
                        <div className="flex min-w-0 gap-x-4">
                          <div className="min-w-0 flex-auto">
                            <p className="text-sm font-semibold leading-6 text-gray-900">
                              Email
                            </p>
                          </div>
                        </div>
                        <div className=" shrink-0 sm:flex sm:flex-col sm:items-end">
                          <p className="text-sm leading-6 text-gray-900">
                            {profile?.emailVerified ? (
                              <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                verified
                              </span>
                            ) : (
                              <>
                                <span className="inline-flex items-center rounded-md bg-pink-50 px-2 py-1 text-xs font-medium text-pink-700 ring-1 ring-inset ring-pink-700/10">
                                  unverified
                                </span>
                                <span
                                  onClick={handleEmailVerification}
                                  className="inline-flex items-center rounded-md bg-blue-600 px-2 py-1 text-xs font-medium text-white ring-1 ring-inset ring-pink-700/10 ml-2 cursor-pointer"
                                >
                                  verify
                                </span>
                              </>
                            )}
                          </p>
                        </div>
                      </li>
                      {profile.status == "physician" && (
                        <li className="flex justify-between gap-x-6 py-5">
                          <div className="flex min-w-0 gap-x-4">
                            <div className="min-w-0 flex-auto">
                              <p className="text-sm font-semibold leading-6 text-gray-900">
                                Approval
                              </p>
                            </div>
                          </div>
                          <div className=" shrink-0 sm:flex sm:flex-col sm:items-end">
                            <p className="text-sm leading-6 text-gray-900">
                              {profile?.certificates ? (
                                <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                  approved
                                </span>
                              ) : (
                                <span className="inline-flex items-center rounded-md bg-pink-50 px-2 py-1 text-xs font-medium text-pink-700 ring-1 ring-inset ring-pink-700/10">
                                  certificate not found
                                </span>
                              )}
                            </p>
                          </div>
                        </li>
                      )}
                      <li className="flex justify-between gap-x-6 py-5">
                        <div className="flex min-w-0 gap-x-4">
                          <div className="min-w-0 flex-auto">
                            <p className="text-sm font-semibold leading-6 text-gray-900">
                              Delete Account
                            </p>
                          </div>
                        </div>
                        <div className=" shrink-0 sm:flex sm:flex-col sm:items-end">
                          <DeleteAccount
                            key={profile._id}
                            profile={user}
                            handleDeleteUser={handleDeleteUser}
                          />
                        </div>
                      </li>
                    </ul>
                  </Paper>
                </Box>
              </Grid>

              <Grid item xs={12} md={8}>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    "& > :not(style)": {
                      m: 1,
                      width: "100%",
                      height: "100%",
                    },
                  }}
                >
                  <Paper elevation={3}>
                    {/* {profile.status == "physician" ? (
                      <SettingsPhysicianProfile
                        key={profile._id}
                        profile={profile}
                      ></SettingsPhysicianProfile>
                    ) : (
                      <SettingsPatientProfile
                        key={profile._id}
                        profile={profile}
                      ></SettingsPatientProfile>
                    )} */}
                  </Paper>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </div>
      ) : (
        <Spinner />
      )}
    </>
  );
};

export default SettingsHome;
