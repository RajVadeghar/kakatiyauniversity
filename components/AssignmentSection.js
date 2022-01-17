import AssignmentItem from "./AssignmentItem";

function AssignmentSection() {
  return (
    <section className="py-5 w-full">
      <ul className="p-5 w-full flex flex-col max-w-screen-md mx-auto bg-white border-[0.2px] shadow-sm">
        {Array.from(Array(5), (_, i) => (
          <AssignmentItem key={i} />
        ))}
      </ul>
    </section>
  );
}

export default AssignmentSection;
