import Link from "next/link";

function login() {
  return (
    <div className="bg-login bg-cover grid place-items-center h-screen overflow-hidden">
      <form
        className="flex flex-col space-y-5 w-1/4 p-11 bg-white shadow-md rounded-md"
        action=""
      >
        <h1 className="text-center text-4xl font-thin mb-5">Register</h1>
        <input
          className="rounded-full bg-slate-50 px-3 p-2 outline-none focus-within:shadow-md"
          type="text"
          placeholder="Enter your ID number"
        />
        <input
          className="rounded-full bg-slate-50 px-3 p-2 outline-none focus-within:shadow-md"
          type="password"
          placeholder="Enter your password"
        />
        <input
          className="rounded-full bg-slate-50 px-3 p-2 outline-none focus-within:shadow-md"
          type="password"
          placeholder="Enter your password again"
        />
        <p type="submit" tabIndex="0" className="authButton text-center">
          Register
        </p>
        <p>
          Already have an account?{" "}
          <span className="link">
            <Link href="/login">Sign In</Link>
          </span>
        </p>
      </form>
    </div>
  );
}

export default login;
