import Head from "next/head";
import Header from "../components/Header";
import UserCard from "../components/UserCard";

export default function Home() {
  return (
    <div className="md:min-h-screen overflow-hidden bg-slate-50 text-slate-900 antialiased">
      <Head>
        <title>Kakatiya University</title>
        <link rel="icon" href="/1logo.png" />
      </Head>

      <Header />

      <main className="max-w-screen-xl mx-auto m-11 md:mt-32 flex flex-col md:flex-row space-y-11 md:space-y-0 justify-around">
        <UserCard userType="Student" img="/student.jpg" path="/register" />
        <UserCard
          userType="Faculty"
          img="/faculty.jpg"
          path="/facultyRegister"
        />
      </main>
    </div>
  );
}
