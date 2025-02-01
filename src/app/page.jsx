"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, googleProvider } from "../lib/firebaseClient"; // Ensure the correct import path
import {
  signInWithPopup,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";

import { useSwipeable } from "react-swipeable";
import Image from "next/image";
import "./styles/globals.css";
const iitRoparImages = [
  { id: 1, src: "/iit-ropar-1.jpg", alt: "IIT Ropar 1" },

];

const Register = () => {
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();

  // 🔹 Maintain authentication state on refresh
  useEffect(() => {
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
          if (firebaseUser) {
            setUser(firebaseUser);
            router.push("/scanQR"); // Redirect if already logged in
          } else {
            setUser(null);
          }
          setLoading(false);
        });

        return () => unsubscribe(); // Cleanup listener on unmount
      })
      .catch((err) => {
        console.error("Error setting auth persistence:", err);
        setLoading(false);
      });
  }, [router]);

  // 🔹 Auto-slide images every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      handleSwipe("left");
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  // 🔹 Handle swipes for image carousel
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleSwipe("left"),
    onSwipedRight: () => handleSwipe("right"),
  });

  const handleSwipe = (direction) => {
    setCurrentIndex((prevIndex) =>
      direction === "left"
        ? (prevIndex + 1) % iitRoparImages.length
        : (prevIndex - 1 + iitRoparImages.length) % iitRoparImages.length
    );
  };

  // 🔹 Google Sign-In
  const handleGoogleSignIn = async () => {
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const emailDomain = user.email?.split("@")[1];
      if (emailDomain !== "iitrpr.ac.in") {
        throw new Error("You must sign in with an iitrpr.ac.in email address.");
      }

      router.push("/scanQR");
    } catch (err) {
      console.error("Sign-in error:", err);
      setError(err.message || "An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative overflow-hidden">
      {/* 🔹 Background Image Carousel */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <div className="w-full h-screen flex-shrink-0" style={{ flexBasis: "100%" }}>
          <Image src={"/iit-ropar-1.jpg"} alt='1' layout="fill" objectFit="cover" quality={100} />
        </div>
        ))

      </div>
      <img src="logo.png" className="absolute w-20 h-20 top-5 opacity-80" alt="" />
      <h1
        className="absolute top-32 text-3xl font-extrabold text-transparent bg-clip-text 
           bg-gradient-to-r from-gray-300 via-gray-100 to-gray-300 
            drop-shadow-2xl z-10"
      >
        Public Entry Device
      </h1>


      {/* 🔹 Registration Card */}
      <div className="bg-white bg-opacity-20 p-2 rounded-3xl shadow-md w-[90%] max-w-sm sm:max-w-md lg:max-w-lg z-10 ">

        {error && (
          <p className="text-red-600 text-center font-semibold mt-4">{error}</p>
        )}

        <button
          onClick={handleGoogleSignIn}
          className="relative w-full py-3 text-white font-semibold text-lg rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 ease-in-out  flex items-center justify-center gap-3 bg-gray-900"
        >
          <div className="absolute inset-0 pointer-events-none"></div>
          <img src="google.png" alt="Google Logo" className="h-7 w-7 z-10 " />

          <span className="z-10">Sign Up with Google</span>
        </button>
      </div>
    </div>
  );
};

export default Register;
