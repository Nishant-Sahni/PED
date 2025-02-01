"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../lib/firebaseClient";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useSwipeable } from "react-swipeable";
import Image from "next/image";
import "../styles/globals.css";

const iitRoparImages = [
  { id: 1, src: "/iit-ropar-1.jpg", alt: "IIT Ropar 1" },
  { id: 2, src: "/iit-ropar-2.jpg", alt: "IIT Ropar 2" },
  { id: 3, src: "/iit-ropar-5.jpg", alt: "IIT Ropar 3" },
  { id: 4, src: "/iit-ropar-4.avif", alt: "IIT Ropar 4" },
  { id: 5, src: "/iit-ropar-5.jpeg", alt: "IIT Ropar 5" },
  { id: 6, src: "/iit-ropar-6.jpg", alt: "IIT Ropar 6" },
];

const Register = () => {
  const [error, setError] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();

    return () => clearInterval(interval);
  }, []);

  const handleRegister = () => {
    setError("");
    if (email === "admin@iitrpr.ac.in" && password === "admin@1234") {
      localStorage.setItem("isAdminLoggedIn", "true"); // Store session
      router.push("/gate");
    } else {
      setError("Invalid admin credentials.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative overflow-hidden">
      {/* Background Slider */}

      <div
        className="w-full h-screen flex-shrink-0"
        style={{ flexBasis: "100%" }}
      >
        <Image
          src="/iit-ropar-2.jpg"
          alt="img-3"
          layout="fill"
          objectFit="cover"
          quality={100}
        />
      </div>

      {/* Page Title */}
      <img
        src="logo.png"
        className="absolute w-20 h-20 top-5 opacity-80"
        alt=""
      />
      <h1
        className="absolute top-32 text-3xl font-extrabold text-transparent bg-clip-text 
           bg-gradient-to-r from-gray-100 via-gray-300 to-gray-100 
            drop-shadow-2xl z-10"
      >
        Public Entry Device
      </h1>

      {/* Login Card */}
      <div className="bg-white bg-opacity-20 p-4 rounded-3xl shadow-md w-[90%] max-w-sm sm:max-w-md lg:max-w-lg z-10 ">
        {" "}
        <h1 className="text-2xl font-bold text-center text-white mb-6">
          Admin Login
        </h1>
        {error && (
          <p className="text-red-600 text-center font-semibold mt-4">{error}</p>
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded-lg"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded-lg"
        />
        <button
          onClick={handleRegister}
          className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Register;
