import { getSession, useSession } from "next-auth/react";
import Head from "next/head";
import AssignmentItem from "../components/AssignmentItem";
import Navbar from "../components/Navbar";

function Assignments() {
  const { data: session } = useSession();
  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-900 antialiased">
      <Head>
        <title>welcome {session?.user?.email}</title>
        <link rel="icon" href="/1logo.png" />
      </Head>
      <Navbar />
      <div className="w-screen px-2 md:px-0 md:max-w-screen-2xl xl:max-w-screen-xl mx-auto flex items-center justify-between h-full">
        <section className="py-2 w-full">
          <ul className="p-5 w-full flex flex-col max-w-screen-md mx-auto bg-white border-[0.2px] shadow-sm">
            {Array.from(Array(5), (_, i) => (
              <AssignmentItem key={i} />
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

export default Assignments;

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
