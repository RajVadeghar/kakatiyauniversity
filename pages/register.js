import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { signup } from "../client/request";

function Register() {
  const [userId, setUserId] = useState("");
  const [branch, setBranch] = useState("");
  const [dateOfJoining, setDateOfJoining] = useState("");
  const [dateOfPassOut, setDateOfPassOut] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const createUser = async (e) => {
    e.preventDefault();

    const payload = {
      uid: userId,
      branch,
      dateOfJoining,
      dateOfPassOut,
      email,
      password,
    };
    setLoading(true);
    const user = await signup(payload);

    if (user.hasError) {
      setErrorMessage(user.errorMessage);
    } else {
      setErrorMessage("");
      setUserId("");
      setBranch("");
      setDateOfJoining("");
      setDateOfPassOut("");
      setEmail("");
      setPassword("");
      router.replace("/login");
    }
    setLoading(false);
  };

  return (
    <div className="bg-login bg-cover bg-center grid place-items-center min-h-screen overflow-hidden">
      <Head>
        <title>{loading ? "Registering..." : "Student Registration"}</title>
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
            <option value="">Choose your branch</option>
            <option value="cse">CSE</option>
            <option value="it">IT</option>
            <option value="ece">ECE</option>
            <option value="eee">EEE</option>
            <option value="mechanical">MECHANICAL</option>
            <option value="civil">CIVIL</option>
          </select>
        </div>
        <div className="w-full">
          <label htmlFor="yoj" className="label">
            year of joining:
          </label>
          <input
            className="input"
            type="date"
            name="yoj"
            value={dateOfJoining}
            onChange={(e) => setDateOfJoining(e.target.value)}
          />
        </div>
        <div className="w-full">
          <label htmlFor="poy" className="label">
            year of pass out:
          </label>
          <input
            className="input"
            type="date"
            name="poy"
            value={dateOfPassOut}
            onChange={(e) => setDateOfPassOut(e.target.value)}
          />
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

        <button type="submit" className="authButton text-center cursor-pointer">
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

export default Register;
