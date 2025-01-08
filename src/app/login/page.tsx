"use client";
import { useState } from "react";
import { auth } from "../firebaseConfig"; // Import your sign-in function
import { signInWithEmailAndPassword } from "firebase/auth";
import "../styles/globals.css";
import Link from "next/link";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const usercredential = await signInWithEmailAndPassword(auth, email, password); 
      const user = usercredential.user;
      if(!user.emailVerified){
        throw new Error("Email not verified, please check your inbox.");
      } 
      
      setSuccess(true); // Indicate successful login
    } catch (err: any) {
      setError(err.message); // Display error if login fails
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-4">Login</h1>
        {success && (
          <p className="text-green-600 text-center mb-4">Login successful!</p>
        )}
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email:
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password:
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-md shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Login
          </button>
        </form>
        <p className="text-center mt-4">
          New user?{" "}
          <Link href="/Register"
            className="text-blue-500 hover:underline">Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
