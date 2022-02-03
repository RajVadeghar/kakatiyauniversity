import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSession } from "next-auth/react";
import { getuser } from "../utils/request";
import { updateCurrentUser } from "../redux/currentUserSlice";

function InitailState() {
  const { data: session } = useSession();
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = async () => {
      const currentUser = await getuser(session?.user.uid);
      session && dispatch(updateCurrentUser(currentUser));
    };
    return unsubscribe();
  }, []);

  return <div></div>;
}

export default InitailState;
