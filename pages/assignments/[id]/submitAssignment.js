import { CameraIcon, DocumentAddIcon } from "@heroicons/react/outline";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { storage } from "../../../utils/firebase";
import {
  submitAssignment,
  updateAssignment,
  updateSubmission,
} from "../../../utils/request";

function SubmitAssignment() {
  const [desc, setDesc] = useState("");
  const [img, setImg] = useState(null);
  const [pdf, setPdf] = useState(null);

  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { data: session } = useSession();

  const imgPickerRef = useRef(null);
  const pdfPickerRef = useRef(null);

  const addImgToPost = (e) => {
    if (e.target.files[0]) {
      setImg(e.target.files[0]);
    }
  };

  const addPdfToPost = (e) => {
    if (e.target.files[0]) {
      setPdf(e.target.files[0]);
    }
  };

  const submitassignment = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    const payload = {
      id: router.query.id,
      submissionData: { uid: session.user.uid, desc },
    };

    const submission = await updateAssignment(payload);

    if (submission.hasError) {
      typeof submission.errorMessage === "string"
        ? setErrorMessage(submission.errorMessage)
        : setErrorMessage("Something went wrong");
    } else {
      if (img) {
        const imgName = img.name.trim().toLowerCase();

        const imgRef = ref(
          storage,
          `AssignmentSubmissions/AssignmentImages/${session?.user.uid}/${router.query.id}/${imgName}`
        );
        const uploadTask = uploadBytesResumable(imgRef, img);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const prog =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(prog);
          },
          (err) => setErrorMessage(err),
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
              const payload = {
                id: router.query.id,
                submitId: submission.data._id,
                img: { name: imgName, url },
              };
              const res = await updateAssignment(payload);
            });
          }
        );
      }
      if (pdf) {
        const pdfName = pdf.name.trim().toLowerCase();

        const pdfRef = ref(
          storage,
          `AssignmentSubmissions/AssignmentPdfs/${session?.user.uid}/${router.query.id}/${pdfName}`
        );
        const uploadTask = uploadBytesResumable(pdfRef, pdf);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const prog =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(prog);
          },
          (err) => setErrorMessage(err),
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
              const payload = {
                id: router.query.id,
                submitId: submission.data._id,
                pdf: { name: pdfName, url },
              };
              const res = await updateAssignment(payload);
            });
          }
        );
      }
      const payload = { id: router.query.id, submitId: submission.data._id };
      const assignment = updateAssignment(payload);
      if (assignment.hasError) {
        typeof assignment.errorMessage === "string"
          ? setErrorMessage(assignment.errorMessage)
          : setErrorMessage("Something went wrong");
      } else {
        setErrorMessage("");
        setDesc("");
        setImg(null);
        setPdf(null);
        setProgress(0);
        setLoading(false);
        router.push("/assignments");
      }
    }
    setLoading(false);
  };

  return (
    <div className="bg-submitAssignment bg-cover bg-bottom grid place-items-center min-h-screen">
      <form
        className="relative flex flex-col space-y-5 2xl:w-1/4 xl:w-1/3 md:w-1/2 mx-5 p-11 bg-white shadow-md rounded-md"
        onSubmit={submitassignment}
      >
        <h1 className="text-center text-4xl font-thin mb-5">
          Submit Assignment
        </h1>
        {errorMessage && (
          <p className="text-red-500 text-center capitalize font-semibold text-sm mb-5">
            {errorMessage}
          </p>
        )}
        <div className="w-full">
          <label htmlFor="desc" className="label">
            Desc:
          </label>
          <input
            className="input"
            type="text"
            name="desc"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        </div>
        <input
          type="file"
          accept="image/*"
          ref={imgPickerRef}
          onChange={addImgToPost}
          hidden
        />
        <input
          type="file"
          accept=".pdf"
          ref={pdfPickerRef}
          onChange={addPdfToPost}
          hidden
        />
        <div className="w-full grid grid-cols-2">
          {!img ? (
            <div
              tabIndex="0"
              onKeyPress={() => imgPickerRef.current.click()}
              onClick={() => imgPickerRef.current.click()}
              className="grid place-items-center h-11 w-11 rounded-full bg-red-100 mx-auto cursor-pointer transition-all hover:scale-105 outline-none focus:shadow-lg focus:scale-125"
            >
              <div className="h-7 w-7">
                <CameraIcon className="h-full text-red-600" />
              </div>
            </div>
          ) : (
            <div className="cursor-pointer link" onClick={() => setImg(null)}>
              {img.name}
            </div>
          )}
          {!pdf ? (
            <div
              tabIndex="0"
              onKeyPress={() => pdfPickerRef.current.click()}
              onClick={() => pdfPickerRef.current.click()}
              className="grid place-items-center h-11 w-11 rounded-full bg-red-100 mx-auto cursor-pointer transition-all hover:scale-105 outline-none focus:shadow-lg focus:scale-125"
            >
              <div className="h-7 w-7">
                <DocumentAddIcon className="h-full text-red-600" />
              </div>
            </div>
          ) : (
            <div className="cursor-pointer link" onClick={() => setPdf(null)}>
              {pdf.name}
            </div>
          )}
        </div>

        <button className="authButton" type="submit">
          Submit Assignment
        </button>
        <div className="absolute h-3 bottom-0 left-0 right-0">
          <div className="relative h-full w-full bg-gray-300">
            <div
              style={{ width: `${progress}%` }}
              className={`absolute inset-0 bg-red-600 h-full`}
            />
          </div>
        </div>
      </form>
    </div>
  );
}

export default SubmitAssignment;

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

  if (session.user.isFacuty) {
    return {
      redirect: {
        destination: "/assignments",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}
