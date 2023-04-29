import { CameraIcon, UserCircleIcon } from "@heroicons/react/solid";
import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import { toggle } from "../redux/modalSlice";

function Avatar({ src = null, height = 11 }) {
  const { data: session } = useSession();

  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.modalState.isOpen);

  const uploadPhoto = () => {
    dispatch(toggle());
  };

  return (
    <div
      className={`grid place-items-center h-${height} w-${height} rounded-full overflow-hidden relative group ring-4 ring-indigo-500 bg-white`}
    >
      {src ? (
        <img
          className="object-cover object-top h-full rounded-full brightness-110"
          src={src}
          alt=""
        />
      ) : (
        <UserCircleIcon className="h-full" />
      )}
      {/* <div className="absolute inset-0 backdrop-blur-sm z-0">
        <img
          className="h-full object-cover object-center"
          src={src || "/avatar.png"}
          alt=""
        />
      </div> */}
      <div
        onClick={uploadPhoto}
        className="absolute inset-0 grid place-items-center bg-black/50 opacity-0 group-hover:opacity-100 group-hover:cursor-pointer"
      >
        <div className="h-16 p-3 bg-black/10 rounded-full">
          <CameraIcon className="h-full text-white" />
        </div>
      </div>
    </div>
  );
}

export default Avatar;
