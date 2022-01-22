import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function UserDetails() {
  const user = useSelector((state) => state.userState.data);
  if (!user) return;
  const [dob, setDob] = useState(null);
  const {
    branch,
    email,
    uid,
    isFaculty,
    dateOfPassOut,
    desc,
    dateOfBirth,
    name,
  } = user;

  const [currentYear, setCurrentYear] = useState(null);

  useEffect(() => {
    const unsubscribe = (e) => {
      const datearray = dateOfBirth?.split("-");
      dateOfBirth &&
        setDob(datearray[2] + "-" + datearray[1] + "-" + datearray[0]);

      const currentTime = new Date();
      const currentYear = currentTime.getFullYear();
      const currentMonth = currentTime.getMonth();
      const passOutYear = dateOfPassOut?.split("-")[0];
      dateOfPassOut && currentMonth < 6
        ? setCurrentYear(currentYear - passOutYear + 4)
        : setCurrentYear(currentYear - passOutYear + 5);
    };
    return unsubscribe();
  }, [dateOfBirth]);

  return (
    <div className="animate-fade-up">
      <div className="flex flex-col space-y-2 mb-3">
        <p className="flex flex-col space-y-2 text-4xl font-thin">
          {name || email}{" "}
          <span className="text-xs font-normal">
            ({isFaculty ? "Faculty account" : "Student account"})
          </span>
        </p>
        <p className="text-gray-500 font-Dongle text-2xl"> {desc}</p>
      </div>
      <p className="uppercase">
        <span className="text-sm font-semibold text-gray-600">Branch:</span>{" "}
        {branch}
      </p>
      <p className="uppercase">
        <span className="text-sm font-semibold text-gray-600">Roll No:</span>{" "}
        {uid}
      </p>
      {!isFaculty && (
        <p className="uppercase">
          <span className="text-sm font-semibold text-gray-600">
            Current Year:
          </span>{" "}
          {currentYear}
        </p>
      )}
      {dob && (
        <p className="uppercase">
          <span className="text-sm font-semibold text-gray-600">
            Date Of Birth:
          </span>{" "}
          {dob}
        </p>
      )}
    </div>
  );
}

export default UserDetails;
