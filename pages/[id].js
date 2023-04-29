import { PencilIcon, XIcon } from "@heroicons/react/outline";
import { deleteObject, ref } from "firebase/storage";
import { getSession, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "../components/Avatar";
import ClassLinkItem from "../components/ClassLinkItem";
import Modal from "../components/Modal";
import Navbar from "../components/Navbar";
import UserDetails from "../components/UserDetails";
import UserEditForm from "../components/UserEditForm";
import { update } from "../redux/userSlice";
import { storage } from "../utils/firebase";
import {
  deleteuser,
  getUnapprovedFacultyDetails,
  getuser,
  getUserClassLinks,
  updateuser,
} from "../utils/request";
import { UserRole } from "../models/User";

function Profile({
  userData,
  userClassLinks,
  unapprovedFacultyDetails: unapproved,
}) {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [unapprovedFacultyDetails, setUnapprovedFacultyDetails] = useState(() =>
    unapproved?.data?.length > 0 ? unapproved.data : null
  );

  const userDataFromStore = useSelector((state) => state.userState);

  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = async () => {
      dispatch(update(userData));
    };
    return unsubscribe();
  }, []);

  const router = useRouter();

  const user = userDataFromStore?.data;
  const loggedInUser = session?.user.uid === user?.uid;
  const currentUser = session?.user.uid === router.query.id;

  const updateUser = async (payload) => {
    if (loading) return;
    setLoading(true);
    const user = await updateuser({ ...payload });
    dispatch(update(user));
    setLoading(false);
    return user;
  };

  const deleteUser = async (id) => {
    if (loading) return;
    setLoading(true);

    const deleteRef = ref(
      storage,
      `images/${userData.data.uid}/profileImg/${userData.data.email}`
    );

    deleteObject(deleteRef)
      .then(async () => {
        setMessage("");
      })
      .catch((err) => setMessage(err));

    const user = await deleteuser(id);
    if (user.hasError) {
      setMessage(user.errorMessage);
    } else {
      setLoading(false);
      router.replace("/dashboard");
    }
    setLoading(false);
  };

  return (
    <div
      className={`min-h-screen w-full bg-slate-50 text-slate-900 antialiased`}
    >
      <Head>
        <title>welcome {session?.user?.email}</title>
        <link rel="icon" href="/1logo.png" />
      </Head>
      <Navbar />
      <Modal />
      <div className="w-screen px-5 md:px-0 md:max-w-screen-2xl xl:max-w-screen-xl mx-auto flex items-center justify-between h-full">
        <div className="py-5 w-full">
          <section className="relative p-11 w-full flex flex-col md:flex-row gap-y-8 items-center md:items-start gap-x-16 max-w-screen-md mx-auto bg-white border-[0.2px] shadow-sm">
            {message && (
              <p className="text-red-500 text-center capitalize font-semibold text-sm mb-5">
                {message}
              </p>
            )}

            {(loggedInUser ||
              session.user.role === UserRole.Admin ||
              session.user.role === UserRole.Faculty) && (
              <div
                onClick={() => setIsEditing((val) => !val)}
                className="absolute top-3 right-3 h-7 font-bold text-gray-400 cursor-pointer"
              >
                {isEditing ? (
                  <XIcon className="h-full" />
                ) : (
                  <PencilIcon className="h-full" />
                )}
              </div>
            )}

            <Avatar src={user?.img} height="40" />

            <div className="flex-1 flex flex-col items-start space-y-2">
              {isEditing ? (
                <UserEditForm updateUser={updateUser} />
              ) : (
                <UserDetails />
              )}
              <div className="flex items-center gap-x-4">
                {!isEditing && loggedInUser && (
                  <button
                    onClick={signOut}
                    className="px-3 p-2 bg-blue-500 text-white uppercase text-sm rounded-md hover:ring-2 hover:ring-blue-500 hover:bg-white hover:text-blue-500 animate-slide-up"
                  >
                    Sign Out
                  </button>
                )}

                {!isEditing &&
                  (session.user.role === UserRole.Admin ||
                    session.user.role === UserRole.Faculty) && (
                    <button
                      onClick={() => deleteUser(user.uid)}
                      className="px-3 p-2 bg-red-500 text-white uppercase text-sm rounded-md hover:ring-2 hover:ring-red-500 hover:bg-white hover:text-red-500 animate-slide-up"
                    >
                      Delete User
                    </button>
                  )}
              </div>
            </div>
          </section>

          {session.user.role === UserRole.Faculty &&
            !isEditing &&
            currentUser && (
              <div className="animate-slide-up">
                <p className="my-10 text-xl font-medium w-full max-w-screen-md mx-auto">
                  Posted By You:
                </p>

                <table className="table-auto mx-auto bg-white border-[0.2px] shadow-sm w-full max-w-screen-md">
                  <thead>
                    <tr className="p-5 grid grid-cols-8 md:grid-cols-9 justify-items-start w-full bg-gray-100 text-xs md:text-base">
                      <th className="capitalize col-span-3">Title</th>
                      <th className="capitalize col-span-1">sem</th>
                      <th className="capitalize col-span-1">branch</th>
                      <th className="capitalize col-span-1">subject</th>
                      <th className="capitalize col-span-1 md:col-span-2">
                        postedBy
                      </th>
                      <th className="capitalize col-span-1">createdAt</th>
                    </tr>
                  </thead>
                  <tbody className="">
                    {userClassLinks.data.length > 0 ? (
                      userClassLinks?.data?.map((classLink) => (
                        <ClassLinkItem
                          key={classLink._id}
                          classLink={classLink}
                        />
                      ))
                    ) : (
                      <tr className="p-5 grid place-items-center w-full text-xs md:text-base">
                        <td className="text-3xl font-medium">
                          No Classes Found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

          {session.user.role === UserRole.Admin &&
            !isEditing &&
            currentUser && (
              <div className="animate-slide-up">
                <p className="my-10 text-xl font-medium w-full max-w-screen-md mx-auto">
                  Approvals Needed for Faculty:
                </p>

                <table className="table-auto mx-auto bg-white border-[0.2px] shadow-sm w-full max-w-screen-md">
                  <thead>
                    <tr className="p-5 grid grid-cols-4 justify-items-center w-full bg-gray-100 text-xs md:text-base">
                      <th className="capitalize col-span-1">uid</th>
                      <th className="capitalize col-span-1">branch</th>
                      <th className="capitalize col-span-1">email</th>
                      <th className="capitalize col-span-1">Action</th>
                    </tr>
                  </thead>
                  <tbody className="">
                    {unapprovedFacultyDetails !== null ||
                    unapprovedFacultyDetails?.length > 0 ? (
                      unapprovedFacultyDetails.map((faculty) => (
                        <tr className="p-5 grid grid-cols-4 justify-items-center place-items-center w-full text-xs md:text-base">
                          <td className="col-span-1 text-xs">{faculty.uid}</td>
                          <td className="col-span-1 text-xs">
                            {faculty.branch}
                          </td>
                          <td className="col-span-1 text-xs uppercase overflow-hidden">
                            {faculty.email}
                          </td>
                          <td className="col-span-1 text-xs">
                            <button
                              onClick={() => {
                                updateUser({
                                  uid: faculty.uid,
                                  isApprovedAsFaculty: true,
                                }).then(() => {
                                  const rest = unapprovedFacultyDetails.filter(
                                    (fac) => fac.uid !== faculty.uid
                                  );
                                  setUnapprovedFacultyDetails(rest);
                                });
                              }}
                              className="authButton"
                            >
                              Approve
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr className="p-5 grid place-items-center w-full text-xs md:text-base">
                        <td className="text-3xl font-medium">
                          No Faculty profiles found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}

export default Profile;

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);
  const user = await getuser(ctx.query.id);
  const userClassLinks = await getUserClassLinks(ctx.query.id);
  const unapprovedFacultyDetails = await getUnapprovedFacultyDetails();

  if (user.hasError) {
    return {
      notFound: true,
    };
  }

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
      userData: user,
      userClassLinks,
      unapprovedFacultyDetails,
    },
  };
}
