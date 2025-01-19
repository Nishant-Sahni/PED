"use client";
import { useState } from "react";
import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import "../styles/globals.css";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleRouter = () => router.push("/scanQR");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Extract email domain and check if it is iitrpr.ac.in
    const emailDomain = email.split("@")[1];
    if (emailDomain !== "iitrpr.ac.in") {
      setError("Please use a valid iitrpr.ac.in email address.");
      return;
    }

    try {
      const usercredential = await signInWithEmailAndPassword(auth, email, password);
      const user = usercredential.user;
      if (!user.emailVerified) {
        throw new Error("Email not verified, please check your inbox.");
      }
      setSuccess(true);
      handleRouter(); // Redirect to scanQR page after successful login
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Side: Form */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 bg-white p-8">
        <h1 className="text-3xl font-bold mb-6">Login</h1>
        {success && (
          <p className="text-green-600 text-center mb-4">Login successful!</p>
        )}
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-6 w-full max-w-sm">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white font-semibold py-2 rounded-md shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Login
          </button>
        </form>
        <p className="text-center mt-6 text-sm text-gray-600">
          Don't have an account?{" "}
          <Link href="/Register" className="text-indigo-500 hover:underline">
            Sign up
          </Link>
        </p>
      </div>

      {/* Right Side: Image */}
      <div className="hidden md:block  md:w-1/2">
        <img
          src="/Loc.jpg" // Replace with the correct image path
          alt="Background"
          className=""
        />
      </div>
    </div>
  );
};

export default Login;
