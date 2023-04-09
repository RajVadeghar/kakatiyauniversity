import { SearchIcon } from "@heroicons/react/outline";
import moment from "moment";
import { getSession, useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import Navbar from "../../components/Navbar";
import {
  deleteClassLink,
  getClass,
  updateClassLink,
} from "../../utils/request";
import { deleteObject, ref } from "firebase/storage";
import { storage } from "../../utils/firebase";
import { useState } from "react";

function VideoPage({ classLink }) {
  const { data: session } = useSession();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const {
    title,
    desc,
    video,
    year,
    sem,
    branch,
    subject,
    postedBy,
    createdAt,
    watchedBy,
  } = classLink;

  function userExists() {
    return watchedBy.some(function (person) {
      return person.uid === session.user.uid;
    });
  }

  const handleTime = async (e) => {
    const now = e.target.currentTime / e.target.duration;
    const percent = now * 100;

    const payload = {
      id: router.query.id,
      uid: session?.user.uid,
      percent: parseInt(percent),
    };

    if (userExists()) {
      const user = watchedBy.find((user) => user.uid === session.user.uid);
      if (percent > user?.watchedPercent) {
        await updateClassLink(payload);
      }
    } else {
      await updateClassLink(payload);
    }
  };

  const deleteClass = async (e) => {
    if (loading) return;
    setLoading(true);

    const videoRef = ref(
      storage,
      `videos/${session?.user.uid}/${sem}/${branch}/${subject}/${video.name}`
    );

    deleteObject(videoRef)
      .then(async () => {
        setErrorMessage("");
      })
      .catch((err) => setErrorMessage(err));

    const payload = { id: router.query.id, uid: postedBy.uid };

    const res = await deleteClassLink(payload);

    if (res.hasError) {
      setErrorMessage(res.errorMessage);
    } else {
      setLoading(false);
      router.replace("/dashboard");
    }

    setLoading(false);
  };

  const handleVideoEnded = () => {};

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
            <video
              className="w-full aspect-video"
              controls
              controlsList="nodownload"
              disablePictureInPicture
              onTimeUpdate={handleTime}
              onEnded={handleVideoEnded}
            >
              <source src={video?.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="flex items-start justify-between">
              <div className="flex flex-col md:space-y-2">
                <h1 className="text-xl md:text-4xl font-medium text-gray-900">
                  {title}
                </h1>
                <p className="text-base md:text-md leading-tight text-gray-700 tracking-widest">
                  {desc}
                </p>
                <p className="text-xs text-gray-500">
                  {watchedBy.length} views
                </p>
                {(session.user.role === UserRole.Admin ||
                  session.user.role === UserRole.Faculty) &&
                  postedBy.uid === session.user.uid && (
                    <button
                      onClick={deleteClass}
                      className={`mt-3 px-4 p-2 w-max bg-red-500 text-white uppercase text-xs md:text-sm rounded-md hover:ring-2 hover:ring-red-500 hover:bg-white hover:text-red-500 ${
                        loading && "opacity-50"
                      }`}
                    >
                      {loading ? "Deleting" : "Delete Class"}
                    </button>
                  )}
              </div>
              <div className="flex flex-col items-end space-y-1">
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
          {(session.user.role === UserRole.Admin ||
            session.user.role === UserRole.Faculty) &&
            postedBy.uid === session.user.uid && (
              <div className="p-5 w-full flex flex-col space-y-5 max-w-screen-md mx-auto bg-white border-[0.2px] shadow-sm mt-4">
                <h1 className="text-2xl md:text-4xl text-center font-thin uppercase">
                  Watched By
                </h1>
                <div className="input flex gap-x-5 mx-auto">
                  <div className="h-7 w-7">
                    <SearchIcon className="h-full w-full text-gray-400" />
                  </div>
                  <input
                    className="w-full outline-none"
                    type="text"
                    placeholder="Enter roll number"
                  />
                </div>
                <table className="table-auto mx-auto bg-white border-[0.2px] shadow-sm w-full max-w-screen-md">
                  <thead>
                    <tr className="p-5 grid grid-cols-2 justify-items-start w-full bg-gray-100 text-xs md:text-base">
                      <th>Roll No</th>
                      <th>Watched Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {watchedBy.map((user, i) => (
                      <tr
                        key={i}
                        className="p-5 grid grid-cols-2 justify-items-start w-full text-xs md:text-base"
                      >
                        <td className="col-span-1">{user.uid}</td>
                        <td className="col-span-1">{user.watchedPercent}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
        </section>
      </div>
    </div>
  );
}

export default VideoPage;

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);
  const classLink = await getClass(ctx.query.id);

  if (classLink.hasError) {
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
    props: { session, classLink: classLink.data },
  };
}
