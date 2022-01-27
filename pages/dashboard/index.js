import { PlusIcon, SearchIcon } from "@heroicons/react/outline";
import { getSession, useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import ClassLinkItem from "../../components/ClassLinkItem";
import Navbar from "../../components/Navbar";
import { getSemesters, getSubjects } from "../../utils/common";
import { getClasses } from "../../utils/request";

function Dashboard({ classes, serverBranch, serverSemester, serverSubject }) {
  const classLinks = useRef(classes);
  const [semesters, setSemesters] = useState([]);
  const [semester, setSemester] = useState(serverSemester);
  const [subjects, setSubjects] = useState([]);
  const [subject, setSubject] = useState(serverSubject);
  const [branch, setBranch] = useState(serverBranch);
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = () => {
      const res = getSemesters();
      const subres = getSubjects();
      setSemesters(res);
      setSubjects(subres);
    };
    return unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = () => {
      if (classLinks.current) {
        setIsMounted(true);
      }
    };
    return unsubscribe();
  }, [classLinks.current]);

  const fetchData = async () => {
    const queryStringArray = [];

    const sub = subject.toLowerCase().split(" ").join("%20");

    queryStringArray.push(branch ? `branch=${branch}` : "");
    queryStringArray.push(semester ? `semester=${semester}` : "");
    queryStringArray.push(subject ? `subject=${sub}` : "");

    const queryString = "";
    queryStringArray.map((query) => (queryString = queryString + query + "&"));

    const res = await getClasses(queryString);
    classLinks.current = res;
    router.push(`/dashboard?${queryString}`, undefined);
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-900 antialiased">
      <Head>
        <title>welcome {session?.user?.email}</title>
        <link rel="icon" href="/1logo.png" />
      </Head>

      <Navbar />

      <div className="w-screen px-2 md:px-0 md:max-w-screen-2xl xl:max-w-screen-xl mx-auto h-full">
        <div className="relative -top-[61px] left-0">
          <div
            onClick={() => setIsVisible((isVisible) => !isVisible)}
            className="md:hidden grid place-items-center h-10 w-10 bg-indigo-100 rounded-full cursor-pointer"
          >
            <div className="h-6 w-6">
              <SearchIcon className="text-indigo-600 h-full w-full" />
            </div>
          </div>
        </div>
        <section className="py-2 w-full">
          <div className="flex flex-col gap-y-5 md:flex-row items-center md:items-start max-w-screen-lg mx-auto">
            <div
              className={`${
                !isVisible && "hidden md:flex"
              } text-xs md:text-base max-w-screen-md md:w-60 flex flex-col space-y-5 transition-all`}
            >
              <div className="w-full">
                <label htmlFor="subject" className="label">
                  Branch:
                </label>
                <input
                  className="input"
                  list="branch"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                />
                <datalist className="input" name="branch" id="branch">
                  <option value="cse">cse</option>
                  <option value="it">it</option>
                  <option value="ece">ece</option>
                  <option value="eee">eee</option>
                  <option value="mechanical">mechanical</option>
                  <option value="civil">civil</option>
                  <option value="mining">mining</option>
                </datalist>
              </div>
              <div className="w-full">
                <label htmlFor="subject" className="label">
                  Semester:
                </label>
                <input
                  className="input"
                  list="semester"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                />
                <datalist className="input" name="semester" id="semester">
                  {semesters?.map((semester, i) => (
                    <option key={i} value={semester}>
                      {semester}
                    </option>
                  ))}
                </datalist>
              </div>

              <div className="w-full">
                <label htmlFor="subject" className="label">
                  Subject:
                </label>
                <input
                  className="input"
                  list="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
                <datalist className="input" name="subject" id="subject">
                  {Array?.from(subjects)
                    ?.sort()
                    .map((subject, i) => (
                      <option key={i} value={subject}>
                        {subject}
                      </option>
                    ))}
                </datalist>
              </div>
              <button onClick={fetchData} className="authButton">
                Search Results
              </button>
            </div>
            <div className="flex-1">
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
              <table className="table-auto mx-auto bg-white border-[0.2px] shadow-sm w-full max-w-screen-md">
                <thead>
                  <tr className="p-5 grid grid-cols-8 md:grid-cols-9 justify-items-start w-full bg-gray-100 text-xs md:text-base">
                    <th className="col-span-3">Title</th>
                    <th className="col-span-1 hidden md:block">year</th>
                    <th className="col-span-1">sem</th>
                    <th className="col-span-1">branch</th>
                    <th className="col-span-1">subject</th>
                    <th className="col-span-1 md:col-span-2">postedBy</th>
                  </tr>
                </thead>
                <tbody>
                  {classLinks.current?.data?.map((classLink) => (
                    <ClassLinkItem key={classLink._id} classLink={classLink} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;

export async function getServerSideProps(context) {
  const { query } = context;
  const { branch, semester, subject } = query;
  const session = await getSession(context);
  const queryStringArray = [];

  const sub = subject && subject.toLowerCase().split(" ").join("%20");

  queryStringArray.push(branch ? `branch=${branch}` : "");
  queryStringArray.push(semester ? `semester=${semester}` : "");
  queryStringArray.push(subject ? `subject=${sub}` : "");

  let queryString = "";
  queryStringArray.map((query) => (queryString = queryString + query + "&"));

  const classLinks = await getClasses(queryString);

  if (classLinks?.hasError) {
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
      classes: classLinks,
      serverBranch: branch || "",
      serverSemester: semester || "",
      serverSubject: subject || "",
    },
  };
}
