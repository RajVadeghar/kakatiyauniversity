import Link from "next/link";
import { getSession, signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

function Login() {
  const [userId, setUserId] = useState("205671865l");
  const [password, setPassword] = useState("Raj@21");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const loginUser = async (e) => {
    e.preventDefault();

    const payload = { uid: userId, password };
    setLoading(true);
    const user = await signIn("credentials", { ...payload, redirect: false });

    if (!user.error) {
      router.replace("/dashboard");
    } else {
      setErrorMessage(user.error);
    }
    setLoading(false);
  };

  return (
    <div className="bg-login bg-cover grid place-items-center h-screen overflow-hidden">
      <Head>
        <title>{loading ? "Signing In..." : "Sign In"}</title>
        <link rel="icon" href="/1logo.png" />
      </Head>
      <form
        onSubmit={loginUser}
        className="flex flex-col space-y-5 2xl:w-1/4 xl:w-1/3 md:w-1/2 mx-5 p-11 bg-white shadow-md rounded-md"
      >
        <h1 className="text-center text-4xl font-thin mb-5">Sign In</h1>
        {errorMessage && (
          <p className="text-red-500 text-center capitalize font-semibold text-sm mb-5">
            {errorMessage}
          </p>
        )}
        <input
          className="rounded-full bg-slate-50 px-3 p-2 outline-none focus-within:shadow-md"
          type="text"
          name="username"
          placeholder="Enter your ID number"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <input
          className="rounded-full bg-slate-50 px-3 p-2 outline-none focus-within:shadow-md"
          type="password"
          name="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          tabIndex="0"
          className={`authButton text-center cursor-pointer ${
            loading && "opacity-80"
          }`}
          disabled={loading}
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>
        <p>
          Haven't registered yet?{" "}
          <span className="link">
            <Link href="/register">Register</Link>
          </span>{" "}
          <span className="link whitespace-nowrap">
            <Link href="/facultyRegister">Faculty Register</Link>
          </span>
        </p>
      </form>
    </div>
  );
}

export default Login;
