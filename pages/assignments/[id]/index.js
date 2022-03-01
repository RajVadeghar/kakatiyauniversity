import { deleteObject, ref } from "firebase/storage";
import moment from "moment";
import { getSession, useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import Navbar from "../../../components/Navbar";
import { storage } from "../../../utils/firebase";
import { getAssignment } from "../../../utils/request";

function Assignment({ assignment }) {
  const {
    _id,
    title,
    createdAt,
    desc,
    postedBy,
    submissions,
    subject,
    branch,
    sem,
    img,
    pdf,
  } = assignment;
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { data: session } = useSession();

  const deleteAssignment = async (e) => {
    if (loading) return;
    setLoading(true);

    const pdfRef = ref(
      storage,
      `AssignmentPdfs/${session?.user.uid}/${sem}/${branch}/${subject}/${pdf.name}`
    );

    const imgRef = ref(
      storage,
      `AssignmentImages/${session?.user.uid}/${sem}/${branch}/${subject}/${img.name}`
    );

    deleteObject(pdfRef)
      .then(async () => {
        setErrorMessage("");
      })
      .catch((err) => setErrorMessage(err));
    deleteObject(imgRef)
      .then(async () => {
        setErrorMessage("");
      })
      .catch((err) => setErrorMessage(err));

    const payload = { id: router.query.id, uid: postedBy.uid };

    const res = await deleteAssignment(payload);

    if (res.hasError) {
      setErrorMessage(res.errorMessage);
    } else {
      setLoading(false);
      router.replace("/assignments");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-900 antialiased">
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/1logo.png" />
      </Head>
      <Navbar />
      <div className="w-screen px-2 md:px-0 md:max-w-screen-2xl xl:max-w-screen-xl mx-auto flex items-center justify-between h-full">
        <section className="py-2 w-full">
          <div className="p-5 w-full flex flex-col space-y-5 max-w-screen-md mx-auto bg-white border-[0.2px] shadow-sm">
            <div className="flex flex-col md:space-y-2">
              <h1 className="text-xl md:text-4xl font-medium text-gray-900 capitalize">
                {title}
              </h1>
              <div className="grid md:grid-cols-2 p-5 gap-5">
                <a
                  href={img.url}
                  target="_blank"
                  className="group relative cursor-pointer rounded-md overflow-hidden"
                >
                  <div className="absolute inset-0 group-hover:bg-black/40" />
                  <img
                    className="h-auto w-auto object-contain"
                    src={img.url}
                    alt=""
                  />
                </a>

                <a
                  href={pdf.url}
                  target="_blank"
                  className="group relative cursor-pointer rounded-md overflow-hidden"
                >
                  <div className="absolute inset-0 group-hover:bg-black/40" />
                  <iframe
                    src={`${pdf.url}#toolbar=0`}
                    scrolling="auto"
                    height="100%"
                    width="100%"
                  ></iframe>
                </a>
              </div>

              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-y-2 flex-1">
                  <p className="text-base md:text-md leading-tight text-gray-700 tracking-widest capitalize">
                    {desc}
                  </p>
                  <p className="text-xs text-gray-500">
                    {submissions.length} submissions
                  </p>
                  {session?.user.isFaculty ? (
                    postedBy.uid === session.user.uid && (
                      <button
                        onClick={deleteAssignment}
                        className={`mt-3 px-4 p-2 w-max bg-red-500 text-white uppercase text-xs md:text-sm rounded-md hover:ring-2 hover:ring-red-500 hover:bg-white hover:text-red-500 ${
                          loading && "opacity-50"
                        }`}
                      >
                        {loading ? "Deleting" : "Delete Class"}
                      </button>
                    )
                  ) : (
                    <button
                      onClick={() =>
                        router.push(`/assignments/${_id}/submitAssignment`)
                      }
                      className={`mt-3 px-4 p-2 w-max bg-blue-500 text-white uppercase text-sm rounded-md hover:ring-[1.4px] hover:ring-blue-500 hover:bg-white hover:text-blue-500 transition-all duration-300 ${
                        loading && "opacity-50"
                      }`}
                    >
                      {loading ? "Submitting" : "Submit Assignment"}
                    </button>
                  )}
                </div>

                <div className="flex flex-col space-y-1 w-max">
                  <p className="text-[10px] md:text-xs text-gray-600 lowercase">
                    {subject}
                  </p>
                  <p className="text-[10px] md:text-xs text-gray-600">
                    {postedBy.name || postedBy.email || postedBy.uid}
                  </p>
                  <p className="text-[10px] md:text-xs text-gray-600">
                    {moment(createdAt).format("llll")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Assignment;

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);
  const assignment = await getAssignment(ctx.query.id);

  if (assignment.hasError) {
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
    props: { session, assignment: assignment.data },
  };
}
