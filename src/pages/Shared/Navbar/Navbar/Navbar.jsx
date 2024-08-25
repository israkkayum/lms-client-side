import { Fragment, useState } from "react";
import { Dialog, Menu, Popover, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  BellIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { NavLink } from "react-router-dom";
import useAuth from "../../../../hooks/useAuth";
import useProfile from "../../../../hooks/useProfile";
import CreateSiteForm from "../../../../components/CreateSiteForm/CreateSiteForm";
import JoinSiteForm from "../../../../components/JoinSiteForm/JoinSiteForm";

const navigation = {
  pages: [
    { name: "Home", href: "/home" },
    { name: "Documentation", href: "/documentation" },
    { name: "Blog", href: "/blog" },
    { name: "Forums", href: "/forums" },
  ],
};

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Navbar = () => {
  const { user, logOut } = useAuth();
  const [profile] = useProfile();
  const [open, setOpen] = useState(false);
  const [showCreateSiteForm, setShowCreateSiteForm] = useState(false);
  const [showJoinSiteForm, setShowJoinSiteForm] = useState(false);

  const handleLogOut = () => {
    logOut()
      .then(() => {})
      .catch((error) => {
        console.log(error);
      });
  };

  // console.log(profile);

  return (
    <div className="bg-white">
      {showCreateSiteForm && (
        <CreateSiteForm
          profile={profile}
          setShowCreateSiteForm={setShowCreateSiteForm}
        />
      )}
      {showJoinSiteForm && (
        <JoinSiteForm
          profile={profile}
          setShowJoinSiteForm={setShowJoinSiteForm}
        />
      )}
      {/* Mobile menu */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog className="relative z-40 lg:hidden" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-white pb-12 shadow-xl">
                <div className="flex px-4 pb-2 pt-5">
                  <button
                    type="button"
                    className="relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-indigo-700"
                    onClick={() => setOpen(false)}
                  >
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="space-y-6 border-t border-gray-200 px-4 py-6">
                  {navigation.pages.map((page) => (
                    <div key={page.name} className="flow-root">
                      <a
                        href={page.href}
                        className="-m-2 block p-2 font-medium text-gray-900"
                      >
                        {page.name}
                      </a>
                    </div>
                  ))}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <header className="relative bg-white">
        <nav
          aria-label="Top"
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        >
          <div className="border-b border-gray-200">
            <div className="flex h-20 items-center">
              <button
                type="button"
                className="relative rounded-md bg-white p-2 text-indigo-700 lg:hidden"
                onClick={() => setOpen(true)}
              >
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open menu</span>
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </button>

              {/* Logo */}
              <div className="ml-4 flex lg:ml-0">
                <a href="#">
                  <span className="sr-only">Your Company</span>
                  <img
                    className="h-8 w-auto"
                    src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                    alt=""
                  />
                </a>
              </div>

              {/* Flyout menus */}
              <Popover.Group className="hidden lg:ml-8 lg:mr-5 lg:block lg:self-stretch z-50">
                <div className="flex h-full space-x-8">
                  {navigation.pages.map((page) => (
                    <a
                      key={page.name}
                      href={page.href}
                      className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800"
                    >
                      {page.name}
                    </a>
                  ))}
                </div>
              </Popover.Group>

              <div className="ml-auto flex items-center">
                {user?.email ? (
                  <div className="absolute inset-y-0 space-x-4 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                    {profile?.profileType == "teacher" ? (
                      <button
                        className="flex items-center gap-2 px-3 py-1.5 text-sm text-white duration-150 bg-indigo-600 rounded-lg hover:bg-indigo-500 active:bg-indigo-700"
                        onClick={() => setShowCreateSiteForm(true)}
                      >
                        <PlusIcon class="h-5 w-5 text-white" />
                        New Site
                      </button>
                    ) : (
                      <button
                        className="flex items-center gap-2 px-3 py-1.5 text-sm text-white duration-150 bg-indigo-600 rounded-lg hover:bg-indigo-500 active:bg-indigo-700"
                        onClick={() => setShowJoinSiteForm(true)}
                      >
                        <PlusIcon class="h-5 w-5 text-white" />
                        Join
                      </button>
                    )}

                    <button
                      type="button"
                      className="relative rounded-full 0 p-1 text-indigo-600 hover:text-indigo-400 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600"
                    >
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">View notifications</span>
                      <BellIcon className="h-6 w-6" aria-hidden="true" />
                    </button>

                    {/* Profile dropdown */}
                    <Menu as="div" className="relative ml-3">
                      <div>
                        <Menu.Button className="relative flex rounded-full  text-sm focus:outline-none focus:ring-2 focus:ring-indigo focus:ring-offset-2 focus:ring-offset-indigo-600">
                          <span className="absolute -inset-1.5" />
                          <span className="sr-only">Open user menu</span>
                          {profile?.profilePic ? (
                            <img
                              className="h-8 w-8 rounded-full"
                              src={`data:image/png;base64,${profile?.profilePic}`}
                              alt=""
                            />
                          ) : (
                            <img
                              className="h-8 w-8 rounded-full"
                              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                              alt=""
                            />
                          )}
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <Menu.Item>
                            {({ active }) => (
                              <div>
                                {profile?.profileType == "teacher" ? (
                                  <NavLink
                                    to="/my-sites"
                                    className={classNames(
                                      active ? "bg-gray-100" : "",
                                      "block px-4 py-2 text-sm text-gray-700"
                                    )}
                                  >
                                    My Sites
                                  </NavLink>
                                ) : (
                                  <NavLink
                                    to="/my-institutions"
                                    className={classNames(
                                      active ? "bg-gray-100" : "",
                                      "block px-4 py-2 text-sm text-gray-700"
                                    )}
                                  >
                                    My Institutions
                                  </NavLink>
                                )}
                              </div>
                            )}
                          </Menu.Item>

                          <Menu.Item>
                            {({ active }) => (
                              <NavLink
                                to="/profile-settings"
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm text-gray-700"
                                )}
                              >
                                Profile & Settings
                              </NavLink>
                            )}
                          </Menu.Item>

                          <Menu.Item>
                            {({ active }) => (
                              <NavLink
                                onClick={handleLogOut}
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm text-gray-700"
                                )}
                              >
                                Sign out
                              </NavLink>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                ) : (
                  <div className="flex flex-1 items-center justify-end space-x-6">
                    <NavLink
                      to="/login"
                      className="text-sm font-medium text-gray-700 hover:text-gray-800"
                    >
                      Sign in
                    </NavLink>
                    <span className="h-6 w-px bg-gray-200" aria-hidden="true" />
                    <NavLink
                      to="/register"
                      className="text-sm font-medium text-gray-700 hover:text-gray-800"
                    >
                      Create account
                    </NavLink>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default Navbar;
