function FormInput(props) {
  const {
    uid,
    label,
    onChange,
    isEditable = true,
    isFaculty = false,
    ...inputProps
  } = props;

  if (
    isFaculty &&
    (props.name === "dateOfJoining" || props.name === "dateOfPassOut")
  ) {
    return null;
  }

  return (
    <div className="w-full">
      <label htmlFor={props.name} className="label">
        {label}:{" "}
      </label>
      <input
        className={`input ${!isEditable && "bg-slate-200 cursor-not-allowed"}`}
        {...inputProps}
        onChange={onChange}
        readOnly={!isEditable}
      />
    </div>
  );
}

export default FormInput;
