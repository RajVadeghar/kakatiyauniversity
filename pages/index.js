import { getSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import Header from "../components/Header";

export default function Home() {
  const router = useRouter();

  return (
    <div className="md:h-screen overflow-hidden bg-slate-50 text-slate-900 antialiased">
      <Head>
        <title>Kakatiya University</title>
        <link rel="icon" href="/1logo.png" />
      </Head>

      <Header />

      <main className="max-w-screen-xl mx-auto m-11 md:mt-32 flex flex-col md:flex-row space-y-11 md:space-y-0 justify-around">
        <div className="userCard group">
          <div className="authCard">
            <h3 className="text-2xl font-semibold">Student</h3>
            <div className="userImage">
              <Image
                className="object-contain"
                src="/student.jpg"
                alt=""
                layout="fill"
              />
            </div>
          </div>
          <div className="userCardHidden">
            <button
              className="authButton"
              onClick={() => router.push("/login")}
            >
              Sign In
            </button>
            <button
              className="authButton"
              onClick={() => router.push("/register")}
            >
              Register
            </button>
          </div>
        </div>

        <div className="userCard group">
          <div className="authCard">
            <h3 className="text-2xl font-semibold">Faculty</h3>
            <div className="userImage">
              <Image
                className="object-contain"
                src="/faculty.jpg"
                alt=""
                layout="fill"
              />
            </div>
          </div>
          <div className="userCardHidden">
            <button
              className="authButton"
              onClick={() => router.push("/login")}
            >
              Sign In
            </button>
            <button
              className="authButton"
              onClick={() => router.push("/facultyRegister")}
            >
              Register
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export async function getServerSideProps({ req }) {
  const session = await getSession({ req });

  if (session) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}
