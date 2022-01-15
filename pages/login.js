import Link from "next/link";

function login() {
  return (
    <div className="bg-login bg-cover grid place-items-center h-screen overflow-hidden">
      <form
        method="POST"
        className="flex flex-col space-y-5 w-1/4 p-11 bg-white shadow-md rounded-md"
        action="/api/login"
      >
        <h1 className="text-center text-4xl font-thin mb-5">Sign In</h1>
        <input
          className="rounded-full bg-slate-50 px-3 p-2 outline-none focus-within:shadow-md"
          type="text"
          name="username"
          placeholder="Enter your ID number"
        />
        <input
          className="rounded-full bg-slate-50 px-3 p-2 outline-none focus-within:shadow-md"
          type="password"
          name="password"
          placeholder="Enter your password"
        />
        <p
          type="submit"
          tabIndex="0"
          className="authButton text-center cursor-pointer"
        >
          Sign In
        </p>
        <p>
          Haven't registered yet?{" "}
          <span className="link">
            <Link href="/register">Register</Link>
          </span>
        </p>
      </form>
    </div>
  );
}

export default login;
