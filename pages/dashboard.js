import { PlusIcon } from "@heroicons/react/outline";
import { getSession, useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import ClassLinkItem from "../components/ClassLinkItem";
import Navbar from "../components/Navbar";

function Dashboard() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-900 antialiased">
      <Head>
        <title>welcome {session?.user?.email}</title>
        <link rel="icon" href="/1logo.png" />
      </Head>
      <Navbar />
      <div className="w-screen px-2 md:px-0 md:max-w-screen-2xl xl:max-w-screen-xl mx-auto flex items-center justify-between h-full">
        <section className="py-2 w-full">
          {session?.user.isFaculty && (
            <div
              onClick={() => router.push("/addClass")}
              className="grid place-items-center p-4 w-full bg-white max-w-screen-md mx-auto border-[0.2px] shadow-sm mb-4 rounded-lg cursor-pointer group"
            >
              <div className="grid place-items-center h-16 w-16 bg-red-100 rounded-full group-hover:scale-105">
                <div className="h-11 w-11">
                  <PlusIcon className="h-full text-red-600" />
                </div>
              </div>
            </div>
          )}
          <ul className="p-5 w-full flex flex-col max-w-screen-md mx-auto bg-white border-[0.2px] shadow-sm">
            {Array.from(Array(2), (_, i) => (
              <ClassLinkItem key={i} />
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}
