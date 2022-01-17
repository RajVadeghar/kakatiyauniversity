import { EmojiSadIcon, PencilIcon, XIcon } from "@heroicons/react/outline";
import { getSession, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { useState } from "react";
import { deleteuser, getuser } from "../client/request";
import Avatar from "../components/Avatar";
import Navbar from "../components/Navbar";
import UserDetails from "../components/UserDetails";
import UserEditForm from "../components/UserEditForm";

function Profile({ user }) {
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState(false);
  const { data: session } = useSession();
  const loggedInUser = session?.user.id === user?.uid;

  const deleteUser = async (id) => {
    const user = await deleteuser(id);
    if (user.hasError) {
      setMessage(user.errorMessage);
    } else {
      setMessage("");
    }
  };

  if (!user) {
    return (
      <div>
        <Navbar />
        <Head>
          <title>Sorry, Not Found</title>
          <link rel="icon" href="/1logo.png" />
        </Head>
        <div className="w-screen px-5 md:px-0 md:max-w-screen-2xl xl:max-w-screen-xl mx-auto flex items-center justify-between h-full">
          <section className="py-5 w-full">
            <div className="p-11 w-full flex justify-center items-center gap-x-5 max-w-screen-md mx-auto bg-white border-[0.2px] shadow-sm">
              <h1 className="text-center text-4xl font-medium ">
                User Not Found
              </h1>
              <div className="h-16">
                <EmojiSadIcon className="h-full" />
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-900 antialiased">
      <Head>
        <title>welcome {session?.user?.email}</title>
        <link rel="icon" href="/1logo.png" />
      </Head>
      <Navbar />
      <div className="w-screen px-5 md:px-0 md:max-w-screen-2xl xl:max-w-screen-xl mx-auto flex items-center justify-between h-full">
        <section className="py-5 w-full">
          <div className="relative p-11 w-full flex flex-col md:flex-row gap-y-8 items-center md:items-start gap-x-16 max-w-screen-md mx-auto bg-white border-[0.2px] shadow-sm">
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
            <div>
              <Avatar height="40" />
            </div>
            <div className="flex-1 flex flex-col items-start space-y-2 animate-fade-up">
              {isEditing ? (
                <UserEditForm user={user} />
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
          </div>
        </section>
      </div>
    </div>
  );
}

export default Profile;

export async function getServerSideProps(context) {
  const session = await getSession(context);
  let user = await getuser(context.query.id);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: { session, user: user.data || null },
  };
}
