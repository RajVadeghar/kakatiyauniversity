import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { registeruser } from "../utils/request";

function FacultyRegister() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState("");
  const [branch, setBranch] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = () => {
      let password = "";
      while (!password || password.length !== 4) {
        password = prompt("Please enter password");
      }
      const key = process.env.FACULTY_KEY;
      if (password === key.toString()) setIsAuthenticated(true);
    };

    return unsubscribe();
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-screen grid place-items-center">
        <Head>
          <title>Faculty Authenticate</title>
          <link rel="icon" href="/1logo.png" />
        </Head>
        <div className="flex flex-col space-y-3 items-center">
          <p className="text-4xl text-black capitalize font-semibold">
            Enter correct password to view form
          </p>
          <div className="flex space-x-4 items-center">
            <span className="link text-gray-700">
              <Link href="/">Go Back</Link>
            </span>
            <p onClick={() => location.reload()} className="link text-gray-700">
              Enter password again
            </p>
          </div>
        </div>
      </div>
    );
  }

  const createUser = async (e) => {
    e.preventDefault();

    const payload = { uid: userId, branch, email, password, isFaculty: true };
    setLoading(true);
    const user = await registeruser(payload);

    if (user.hasError) {
      setErrorMessage(user.errorMessage);
    } else {
      setErrorMessage("");
      setUserId("");
      setBranch("");
      setEmail("");
      setPassword("");
      router.replace("/login");
    }
    setLoading(false);
  };

  return (
    <div className="bg-login bg-cover bg-center grid place-items-center min-h-screen overflow-hidden">
      <Head>
        <title>{loading ? "Registering..." : "Faculty Registration"}</title>
        <link rel="icon" href="/1logo.png" />
      </Head>
      <form
        className="flex flex-col space-y-5 2xl:w-1/4 xl:w-1/3 md:w-1/2 mx-5 p-11 bg-white shadow-md rounded-md"
        onSubmit={createUser}
      >
        <h1 className="text-center text-4xl font-thin mb-5">Register</h1>
        {errorMessage && (
          <p className="text-red-500 text-center capitalize font-semibold text-sm mb-5">
            {errorMessage}
          </p>
        )}
        <div className="w-full">
          <label htmlFor="rno" className="label">
            Roll no:
          </label>
          <input
            className="input"
            type="text"
            name="rno"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
        </div>
        <div className="w-full">
          <label htmlFor="branch" className="label">
            branch:
          </label>
          <select
            label="branch"
            name="branch"
            className="input"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
          >
            <option hidden value=""></option>
            <option value="cse">CSE</option>
            <option value="it">IT</option>
            <option value="ece">ECE</option>
            <option value="eee">EEE</option>
            <option value="mechanical">MECHANICAL</option>
            <option value="civil">CIVIL</option>
          </select>
        </div>
        <div className="w-full">
          <label htmlFor="email" className="label">
            email:
          </label>
          <input
            className="input"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="w-full">
          <label htmlFor="password" className="label">
            password:
          </label>
          <input
            className="input"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          type="submit"
          tabIndex="0"
          className="authButton text-center cursor-pointer"
        >
          {loading ? "Registering..." : "Register"}
        </button>
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

export default FacultyRegister;
