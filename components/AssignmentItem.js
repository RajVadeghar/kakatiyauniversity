import moment from "moment";
import { useRouter } from "next/router";

function AssignmentItem({ assignment }) {
  const { _id, title, createdAt, desc, postedBy, submissions } = assignment;

  const router = useRouter();

  return (
    <li className="">
      <details
        className="open:bg-white dark:open:bg-slate-900 open:ring-1 open:ring-black/5 dark:open:ring-white/10 open:shadow-lg p-6 rounded-lg w-full"
        open
      >
        <summary className="text-sm leading-6 text-slate-900 dark:text-white font-semibold select-none capitalize cursor-pointer">
          {title}
        </summary>
        <div className="flex items-start justify-between gap-x-4 mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
          <div className="flex-1 flex flex-col space-y-2">
            <p className="capitalize">{desc}</p>
            <p className="text-xs opacity-50">
              {submissions.length} submissions
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => router.push(`/assignments/${_id}`)}
                className="px-3 p-1 bg-blue-500 text-white uppercase text-sm rounded-md hover:ring-[1.4px] hover:ring-blue-500 hover:bg-white hover:text-blue-500 transition-all duration-300"
              >
                Visit
              </button>
              <button
                onClick={() =>
                  router.push(`/assignments/${_id}/submitAssignment`)
                }
                className="px-3 p-1 bg-blue-500 text-white uppercase text-sm rounded-md hover:ring-[1.4px] hover:ring-blue-500 hover:bg-white hover:text-blue-500 transition-all duration-300"
              >
                Submit Assignment
              </button>
            </div>
          </div>
          <div className="hidden md:flex flex-col items-end space-y-2 text-slate-600 text-xs">
            <p className="text-slate-800">{moment(createdAt).format("llll")}</p>

            <p className="text-slate-800">By {postedBy.name || postedBy.uid}</p>
          </div>
        </div>
      </details>
    </li>
  );
}

export default AssignmentItem;
