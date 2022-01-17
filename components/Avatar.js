import { CameraIcon } from "@heroicons/react/outline";
import { useSession } from "next-auth/react";

function Avatar({ height = 11 }) {
  const { data: session } = useSession();

  const uploadPhoto = () => {
    alert("Uploading");
  };

  return (
    <div className={`h-${height} rounded-full overflow-hidden relative group`}>
      <div
        onClick={uploadPhoto}
        className="absolute inset-0 grid place-items-center bg-black/50 opacity-0 group-hover:opacity-100 group-hover:cursor-pointer"
      >
        <div className="h-16 p-3 bg-black/70 rounded-full">
          <CameraIcon className="h-full text-white" />
        </div>
      </div>
      <img
        className="h-full object-contain"
        src={session?.user?.image || "/avatar.png"}
        alt=""
      />
    </div>
  );
}

export default Avatar;
