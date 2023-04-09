import { useSession } from "next-auth/react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { update } from "../redux/userSlice";
import FormInput from "./FormInput";
import { UserRole } from "../models/User";

function UserEditForm({ updateUser }) {
  const user = useSelector((state) => state.userState.data);
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const {
    branch,
    email,
    uid,
    role,
    dateOfJoining,
    dateOfPassOut,
    desc,
    dateOfBirth,
    name,
  } = user;

  const [values, setValues] = useState({
    branch,
    email,
    uid,
    role,
    dateOfJoining,
    dateOfPassOut,
    desc,
    dateOfBirth,
    name,
    errorMessage: "",
    successMessage: "",
  });

  const inputs = [
    {
      id: 1,
      name: "email",
      type: "email",
      placeholder: "Your Email",
      label: "email",
      isEditable:
        session.user.role === UserRole.Admin ||
        session.user.role === UserRole.Faculty
          ? true
          : false,
    },
    {
      id: 2,
      name: "branch",
      type: "text",
      placeholder: "Your Branch",
      label: "branch",
      isEditable:
        session.user.role === UserRole.Admin ||
        session.user.role === UserRole.Faculty
          ? true
          : false,
    },
    {
      id: 3,
      name: "dateOfJoining",
      type: "date",
      placeholder: "Date Joined",
      label: "Date Joined",
      min: "2000",
      isEditable:
        session.user.role === UserRole.Admin ||
        session.user.role === UserRole.Faculty
          ? true
          : false,
    },
    {
      id: 4,
      name: "dateOfPassOut",
      type: "date",
      placeholder: "Date of passout",
      label: "Date of passout",
      min: "2000",
      isEditable:
        session.user.role === UserRole.Admin ||
        session.user.role === UserRole.Faculty
          ? true
          : false,
    },
    {
      id: 5,
      name: "uid",
      type: "text",
      placeholder: "Your Roll Number",
      label: "Roll Number",
      isEditable:
        session.user.role === UserRole.Admin ||
        session.user.role === UserRole.Faculty
          ? true
          : false,
    },
    {
      id: 6,
      name: "name",
      type: "text",
      placeholder: "Your name",
      label: "User Name",
      isEditable: true,
    },
    {
      id: 7,
      name: "desc",
      type: "text",
      placeholder: "Add Bio",
      label: "Bio",
      isEditable: true,
    },
    {
      id: 8,
      name: "dateOfBirth",
      type: "date",
      placeholder: "Your Birthday",
      label: "Birthday",
      isEditable: true,
    },
  ];

  const submitUpdate = async (e) => {
    e.preventDefault();

    const {
      branch,
      email,
      uid,
      role,
      dateOfJoining,
      dateOfPassOut,
      desc,
      dateOfBirth,
      name,
    } = values;

    const payload = {
      branch,
      email,
      uid,
      role,
      dateOfJoining,
      dateOfPassOut,
      desc,
      dateOfBirth,
      name,
    };

    const user = await updateUser(payload);

    if (user.hasError) {
      setValues({ ...values, errorMessage: user.errorMessage });
    } else {
      setValues({
        ...values,
        successMessage: "Updated user successfully! Cheers :)",
      });
      dispatch(update(user));
    }
  };

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  return (
    <form
      onSubmit={submitUpdate}
      className="flex flex-col items-start space-y-4 w-full animate-slide-up"
    >
      {values.errorMessage && (
        <p className="text center text-red-500 text-center capitalize font-semibold text-sm mb-5">
          {values.errorMessage}
        </p>
      )}
      {values.successMessage && (
        <p className="text center text-green-500 text-center capitalize font-semibold text-sm w-full">
          {values.successMessage}
        </p>
      )}
      {inputs.map((input) => (
        <FormInput
          key={input.id}
          {...input}
          value={values[input.name]}
          onChange={onChange}
          role={role}
        />
      ))}

      <button
        type="submit"
        className="px-3 p-2 bg-blue-500 text-white uppercase text-sm rounded-md hover:ring-2 hover:ring-blue-500 hover:bg-white hover:text-blue-500"
      >
        Update Details
      </button>
    </form>
  );
}

export default UserEditForm;
