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
  { id: 2, src: "/iit-ropar-2.jpg", alt: "IIT Ropar 2" },
  { id: 3, src: "/iit-ropar-3.jpg", alt: "IIT Ropar 3" },
  { id: 4, src: "/iit-ropar-4.avif", alt: "IIT Ropar 4" },
  { id: 5, src: "/iit-ropar-5.jpeg", alt: "IIT Ropar 5" },
  { id: 6, src: "/iit-ropar-6.jpg", alt: "IIT Ropar 6" },
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
      <div {...swipeHandlers} className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <div
          className="flex transition-transform duration-1000 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
            width: `${iitRoparImages.length * 100}%`,
          }}
        >
          {iitRoparImages.map((image) => (
            <div key={image.id} className="w-full h-screen flex-shrink-0" style={{ flexBasis: "100%" }}>
              <Image src={image.src} alt={image.alt} layout="fill" objectFit="cover" quality={100} />
            </div>
          ))}
        </div>
      </div>

      {/* 🔹 Page Title */}
      <h1 className="absolute top-10 text-4xl font-bold text-white z-10">Public Entry Device</h1>

      {/* 🔹 Registration Card */}
      <div className="bg-white bg-opacity-20 p-8 rounded-lg shadow-md w-full max-w-sm sm:max-w-md lg:max-w-lg z-10">
        <h1 className="text-2xl font-bold text-center text-black mb-6">Register</h1>

        {error && <p className="text-red-600 text-center font-semibold mt-4">{error}</p>}

        <button
          onClick={handleGoogleSignIn}
          className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mb-4 flex items-center justify-center gap-2"
        >
          Sign Up with Google
        </button>
      </div>
    </div>
  );
};

export default Register;
