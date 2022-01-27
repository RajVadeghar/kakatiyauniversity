import { useRouter } from "next/router";
import { useEffect, useState } from "react";

function ClassLinkItem({ classLink }) {
  const [sub, setSub] = useState("");
  const { title, desc, video, year, sem, branch, subject, postedBy } =
    classLink;
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
      <td className="col-span-1 hidden md:block">{year}</td>
      <td className="col-span-1">{sem}</td>
      <td className="col-span-1">{branch}</td>
      <td className="col-span-1 uppercase">{sub}</td>
      <td className="col-span-1 md:col-span-2">
        {postedBy.name || postedBy.email || postedBy.uid}
      </td>
    </tr>
  );
}

export default ClassLinkItem;
