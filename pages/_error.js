import { EmojiSadIcon } from "@heroicons/react/outline";
import Head from "next/head";
import Navbar from "../components/Navbar";

function Error({ statusCode }) {
  return (
    <div>
      <Navbar />
      <Head>
        <title>Error</title>
        <link rel="icon" href="/1logo.png" />
      </Head>
      <div className="w-screen px-5 md:px-0 md:max-w-screen-2xl xl:max-w-screen-xl mx-auto flex items-center justify-between h-full">
        <section className="py-5 w-full">
          <div className="p-11 w-full flex justify-center items-center gap-x-5 max-w-screen-md mx-auto bg-white border-[0.2px] shadow-sm">
            {statusCode
              ? `An error ${statusCode} occurred on server`
              : "An error occurred on client"}
            <div className="h-16">
              <EmojiSadIcon className="h-full" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
