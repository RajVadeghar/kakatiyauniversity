import { EmojiSadIcon } from "@heroicons/react/outline";
import Head from "next/head";
import Navbar from "../components/Navbar";

function Custom404() {
  return (
    <div>
      <Navbar />
      <Head>
        <title>404, Not Found</title>
        <link rel="icon" href="/1logo.png" />
      </Head>
      <div className="w-screen px-5 md:px-0 md:max-w-screen-2xl xl:max-w-screen-xl mx-auto flex items-center justify-between h-full">
        <section className="py-5 w-full">
          <div className="p-11 w-full flex justify-center items-center gap-x-5 max-w-screen-md mx-auto bg-white border-[0.2px] shadow-sm">
            <h1 className="text-center text-4xl font-medium ">Not Found</h1>
            <div className="h-16">
              <EmojiSadIcon className="h-full" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Custom404;
