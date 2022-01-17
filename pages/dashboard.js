import { getSession, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import ClassLinkSection from "../components/ClassLinkSection";
import Navbar from "../components/Navbar";

function Dashboard({ session }) {
  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-900 antialiased">
      <Head>
        <title>welcome {session?.user?.email}</title>
        <link rel="icon" href="/1logo.png" />
      </Head>
      <Navbar />
      <div className="w-screen px-5 md:px-0 md:max-w-screen-2xl xl:max-w-screen-xl mx-auto flex items-center justify-between h-full">
        <ClassLinkSection />
      </div>
    </div>
  );
}

export default Dashboard;

export async function getServerSideProps({ req }) {
  const session = await getSession({ req });


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
