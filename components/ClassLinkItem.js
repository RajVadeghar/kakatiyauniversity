import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import TimeAgo from "timeago-react";

function ClassLinkItem({ classLink }) {
  const [sub, setSub] = useState("");
  const { title, sem, branch, subject, postedBy, createdAt } = classLink;
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = () => {
      const res = subject
        ?.split(" ")
        .map((word) => word[0])
        .join("");
      setSub(res);
    };
    return unsubscribe();
  }, []);

  return (
    <tr className="p-5 grid grid-cols-8 md:grid-cols-9 justify-items-start w-full text-xs md:text-base">
      <td
        onClick={() => router.push(`/dashboard/${classLink._id}`)}
        className="col-span-3 link"
      >
        {title}
      </td>
      <td className="col-span-1">{sem}</td>
      <td className="col-span-1">{branch}</td>
      <td className="col-span-1 uppercase">{sub}</td>
      <td className="col-span-1 md:col-span-2">
        {postedBy.name || postedBy.email || postedBy.uid}
      </td>
      <td className="col-span-1 text-xs text-gray-600">
        <TimeAgo datetime={createdAt} />
      </td>
    </tr>
  );
}

export default ClassLinkItem;
