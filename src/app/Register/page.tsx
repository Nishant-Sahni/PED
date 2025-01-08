"use client";

import { useState } from "react";
import { auth } from "../firebaseConfig"; // Import your sign-up function
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import "../styles/globals.css";
import Link from "next/link";
const Register = () => {
  const[name, setName] = useState("");
  const[entryno, setEntryno] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e:React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const email = `${entryno}@iitrpr.ac.in`
      const domain = email.split("@")[1];
      if(domain != "iitrpr.ac.in"){
        throw new Error("Email must belong to the iitrpr.ac.in domain.");
      } 

      const userCredential = await createUserWithEmailAndPassword(auth,email, password);

      await sendEmailVerification(userCredential.user);

      setSuccess("Registration successful! please verify your email before logging in"); 
     
    } catch (err:any) {
      setError(err.message); 
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Register</h1>
        {success && <p className="text-green-500 text-center mb-4">{success}</p>}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full mt-1 p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Entry No</label>
            <input
              type="text"
              value={entryno}
              onChange={(e) => setEntryno(e.target.value)}
              required
              className="w-full mt-1 p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={`${entryno}@iitrpr.ac.in`}
              readOnly
              className="w-full mt-1 p-2 border rounded-lg bg-gray-200 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full mt-1 p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Register
          </button>
        </form>
        <p className="text-center mt-4">
          Already a user?{" "}
          <Link href="/login"
             className="text-blue-500 hover:underline">Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
