import Error from "next/error";
import { PencilIcon, XIcon } from "@heroicons/react/outline";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { deleteuser, getuser, updateuser } from "../utils/request";
import Avatar from "./Avatar";
import UserDetails from "./UserDetails";
import UserEditForm from "./UserEditForm";
import { useRecoilState } from "recoil";
import { userState } from "../atoms/userAtom";
import { ref, deleteObject } from "firebase/storage";
import { storage } from "../utils/firebase";

function ProfileSection() {
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useRecoilState(userState);

  const { data: session } = useSession();
  const router = useRouter();

  const user = userData?.data;
  const loggedInUser = session?.user.uid === user?.uid;

  useEffect(() => {
    const unsubscribe = async () => {
      const user = await getuser(router.query.id);
      setUserData(user);
    };
    return unsubscribe();
  }, [loading]);

  const updateUser = async (payload) => {
    if (loading) return;
    setLoading(true);
    const user = await updateuser({ ...payload });
    setLoading(false);
    return user;
  };

  const deleteUser = async (id) => {
    if (loading) return;
    setLoading(true);

    const deleteRef = ref(
      storage,
      `images/${userData?.data.uid}/profileImg/${userData?.data.email}`
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

  if (userData?.hasError) {
    return <Error statusCode={404} />;
  }

  return (
    <section className="relative p-11 w-full flex flex-col md:flex-row gap-y-8 items-center md:items-start gap-x-16 max-w-screen-md mx-auto bg-white border-[0.2px] shadow-sm">
      {message && (
        <p className="text-red-500 text-center capitalize font-semibold text-sm mb-5">
          {message}
        </p>
      )}

      {(loggedInUser || session?.user.isFaculty) && (
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

      <div className="flex-1 flex flex-col items-start space-y-2 animate-fade-up">
        {isEditing ? (
          <UserEditForm user={user} updateUser={updateUser} />
        ) : (
          <UserDetails user={user} />
        )}
        <div className="flex items-center gap-x-4">
          {!isEditing && loggedInUser && (
            <button
              onClick={signOut}
              className="px-3 p-2 bg-blue-500 text-white uppercase text-sm rounded-md hover:ring-2 hover:ring-blue-500 hover:bg-white hover:text-blue-500"
            >
              Sign Out
            </button>
          )}

          {!isEditing && session?.user.isFaculty && (
            <button
              onClick={() => deleteUser(user.uid)}
              className="px-3 p-2 bg-red-500 text-white uppercase text-sm rounded-md hover:ring-2 hover:ring-red-500 hover:bg-white hover:text-red-500"
            >
              Delete User
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

export default ProfileSection;
