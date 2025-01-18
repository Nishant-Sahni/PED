"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, googleProvider, signInWithPopup } from "../../lib/firebaseClient";
import { createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";
import { useSwipeable } from "react-swipeable"; // Import react-swipeable
import { FaGoogle } from "react-icons/fa"; // Import Google Icon from react-icons
import "../styles/globals.css";

const iitRoparImages = [
  { id: 1, src: "iit-ropar-1.jpg", alt: "IIT Ropar 1" },
  { id: 2, src: "iit-ropar-2.jpg", alt: "IIT Ropar 2" },
  { id: 3, src: "iit-ropar-3.jpg", alt: "IIT Ropar 3" },
  { id: 4, src: "iit-ropar-4.avif", alt: "IIT Ropar 4" },
];

const Register = () => {
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0); // Track the current card index
  const router = useRouter();

  // Automatically swipe images every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % iitRoparImages.length);
    }, 3000);

    return () => clearInterval(interval); // Clean up interval on component unmount
  }, []);

  // Handle swipe gestures
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleSwipe("left"),
    onSwipedRight: () => handleSwipe("right"),
  });

  const handleSwipe = (direction:any) => {
    console.log(`Swiped ${direction}`);
    if (direction === "left") {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % iitRoparImages.length);
    } else if (direction === "right") {
      setCurrentIndex(
        (prevIndex) =>
          (prevIndex - 1 + iitRoparImages.length) % iitRoparImages.length
      );
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const emailDomain = user.email?.split("@")[1];
      if (emailDomain !== "iitrpr.ac.in") {
        throw new Error("You must sign in with an iitrpr.ac.in email address.");
      }

      console.log("User details:", {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
      });

      // Check if the user's email is verified
      if (!user.emailVerified) {
        setError("Please verify your email before logging in.");
        return;
      }

      router.push("/scanQR");
    } catch (err:any) {
      console.error("Google Sign-In error:", err);
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative">
      {/* Background Swipeable Cards */}
      <div
        {...swipeHandlers}
        className="absolute inset-0 flex items-center justify-center overflow-hidden"
      >
        <div className="swipe-card-wrapper relative w-full h-screen">
          <img
            src={iitRoparImages[currentIndex].src}
            alt={iitRoparImages[currentIndex].alt}
            className="absolute w-full h-full object-cover transition-all duration-1000 ease-in-out"
          />
        </div>
      </div>

      {/* Foreground Transparent Registration Card */}
      <div className="bg-white bg-opacity-20  p-8 rounded-lg shadow-md w-full max-w-sm sm:max-w-md lg:max-w-lg z-10">
        <h1 className="text-2xl font-bold text-center text-black mb-6">Register</h1>
        {error && <p className="text-red-600 text-center font-semibold mt-4">{error}</p>}

        <button
          onClick={handleGoogleSignIn}
          className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mb-4 flex items-center justify-center gap-2"
        >
          <FaGoogle /> {/* Google Icon */}
          Sign Up with Google
        </button>
      </div>
    </div>
  );
};

export default Register;
