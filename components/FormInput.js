function FormInput(props) {
  const { uid, label, onChange, isEditable, isFaculty, ...inputProps } = props;

  if (
    isFaculty &&
    (props.name === "dateOfJoining" || props.name === "dateOfPassOut")
  ) {
    return null;
  }

  return (
    <div className="w-full">
      <label
        htmlFor={props.name}
        className="text-xs uppercase p-2 font-semibold"
      >
        {label}:{" "}
      </label>
      <input
        className={`rounded-full w-full bg-slate-50 px-3 p-2 outline-none focus-within:shadow-md ${
          !isEditable && "bg-slate-200 cursor-not-allowed"
        }`}
        {...inputProps}
        onChange={onChange}
        readOnly={!isEditable}
      />
    </div>
  );
}

export default FormInput;
