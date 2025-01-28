"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {auth} from "../../lib/firebaseClient";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useSwipeable } from "react-swipeable";
import Image from "next/image";
import "../styles/globals.css";

const iitRoparImages = [
  { id: 1, src: "/iit-ropar-1.jpg", alt: "IIT Ropar 1" },
  { id: 2, src: "/iit-ropar-2.jpg", alt: "IIT Ropar 2" },
  { id: 3, src: "/iit-ropar-3.jpg", alt: "IIT Ropar 3" },
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

    const interval = setInterval(() => handleSwipe("left"), 8000);
    return () => clearInterval(interval);
  }, []);

  const handleSwipe = (direction) => {
    if (isSwiping) return;
    setIsSwiping(true);

    setCurrentIndex((prevIndex) => {
      if (direction === "left") {
        return (prevIndex + 1) % iitRoparImages.length;
      } else if (direction === "right") {
        return (prevIndex - 1 + iitRoparImages.length) % iitRoparImages.length;
      }
      return prevIndex;
    });

    setTimeout(() => setIsSwiping(false), 1000); // Match transition duration
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleSwipe("left"),
    onSwipedRight: () => handleSwipe("right"),
    delta: 50,
    preventDefaultTouchmoveEvent: true,
    trackTouch: true,
  });

  const handleRegister = () => {
    setError("");
    if (email === "admin@iitrpr.ac.in" && password === "admin@1234") {
      setIsLoggedIn(true);
      router.push("/gate");
    } else {
      setError("Please enter the correct admin ID and password.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative overflow-hidden">
      {/* Background Slider */}
      <div
        {...swipeHandlers}
        className="absolute inset-0 flex items-center justify-center overflow-hidden"
      >
        <div
          className="flex transition-transform duration-1000 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
            width: `${iitRoparImages.length * 100}%`,
          }}
        >
          {iitRoparImages.map((image) => (
            <div
              key={image.id}
              className="w-full h-screen flex-shrink-0"
              style={{ flexBasis: "100%" }}
            >
              <Image
                src={image.src}
                alt={image.alt}
                layout="fill"
                objectFit="cover"
                quality={100}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Page Title */}
      <h1 className="absolute top-10 text-4xl font-bold text-white z-10">
        Public Entry Device
      </h1>

      {/* Login Card */}
      <div className="bg-white bg-opacity-20 p-8 rounded-lg shadow-md w-full max-w-sm sm:max-w-md lg:max-w-lg z-10">
        <h1 className="text-2xl font-bold text-center text-black mb-6">
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
