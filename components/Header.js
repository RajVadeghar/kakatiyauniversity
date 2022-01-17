import Image from "next/image";

function Header() {
  return (
    <header className="flex items-center justify-between w-screen h-40 p-5 px-11 border-b shadow-md">
      <div className="hidden sm:inline-block relative h-40 w-40">
        <Image
          className="object-contain"
          src="/1logo.png"
          alt=""
          layout="fill"
        />
      </div>
      <h1 className="flex-1 text-center text-5xl md:text-6xl lg:text-8xl capitalize font-bold bg-gradient-to-r text-transparent bg-clip-text from-lime-500 via-green-700 to-slate-900 font-Dongle">
        Kakatiya University
      </h1>
      <div className="hidden sm:inline-block relative h-40 w-52">
        <Image
          className="object-contain"
          src="/2logo.png"
          alt=""
          layout="fill"
        />
      </div>
    </header>
  );
}

export default Header;
