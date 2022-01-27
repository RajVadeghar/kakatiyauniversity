import { Dialog, Transition } from "@headlessui/react";
import { CameraIcon } from "@heroicons/react/outline";
import { Fragment, useRef, useState } from "react";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../utils/firebase";
import { updateuser } from "../utils/request";
import { useDispatch, useSelector } from "react-redux";
import { toggle } from "../redux/modalSlice";

function Modal() {
  const isOpen = useSelector((state) => state.modalState.isOpen);
  const dispatch = useDispatch();
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [progress, setProgress] = useState(0);

  const user = useSelector((state) => state.userState);

  const cancelButtonRef = useRef(null);
  const filePickerRef = useRef(null);

  const addImageToPost = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      setUploadFile(e.target.files[0]);
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target.result);
    };
  };

  const uploadImage = async () => {
    if (loading) return;
    if (!selectedFile) return;

    setLoading(true);

    const imageRef = ref(
      storage,
      `images/${user?.uid}/profileImg/${user?.email}`
    );
    const uploadTask = uploadBytesResumable(imageRef, uploadFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const prog = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(prog);
      },
      (err) => setErrorMessage(err),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
          const user = await updateuser({ uid: userData.data.uid, img: url });
          setUserData(user);
        });
      }
    );

    setProgress(0);
    setLoading(false);
    setSelectedFile(null);
    setOpen(false);
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        initialFocus={cancelButtonRef}
        onClose={() => dispatch(toggle())}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full p-8">
              <div className="flex flex-col justify-center space-y-2">
                {selectedFile ? (
                  <img
                    className="w-full object-contain cursor-pointer rounded-md"
                    src={selectedFile}
                    onClick={() => setSelectedFile(null)}
                    alt=""
                  />
                ) : (
                  <div
                    onClick={() => filePickerRef.current.click()}
                    className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 cursor-pointer"
                  >
                    <div className="h-6 w-6">
                      <CameraIcon
                        className="h-full w-full text-red-600"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                )}

                <Dialog.Title
                  as="h3"
                  className="text-lg text-center leading-6 font-medium text-gray-900"
                >
                  Upload Profile Picture
                </Dialog.Title>

                <div className="">
                  <input
                    type="file"
                    accept="image/*"
                    ref={filePickerRef}
                    onChange={addImageToPost}
                    hidden
                  />
                </div>

                {errorMessage && (
                  <p className="text-red-600 text-center uppercase text-xs">
                    {errorMessage}
                  </p>
                )}

                <div className="mt-2">
                  <button
                    disabled={!selectedFile}
                    className="px-3 p-2 bg-red-600 text-white uppercase text-sm rounded-md transition-all hover:ring-2 hover:ring-red-600 hover:bg-white hover:text-red-600 w-full cursor-pointer"
                    onClick={uploadImage}
                  >
                    Upload
                  </button>
                </div>
              </div>
              <div className="absolute h-3 bottom-0 left-0 right-0">
                <div className="relative h-full w-full bg-gray-300">
                  <div
                    style={{ width: `${progress}%` }}
                    className={`absolute inset-0 bg-red-600 h-full`}
                  />
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
export default Modal;
