"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, googleProvider, signInWithPopup } from "../lib/firebaseClient";
import { useSwipeable } from "react-swipeable";
import "./styles/globals.css";

const iitRoparImages = [
  { id: 1, src: "iit-ropar-1.jpg", alt: "IIT Ropar 1" },
  { id: 2, src: "iit-ropar-2.jpg", alt: "IIT Ropar 2" },
  { id: 3, src: "iit-ropar-3.jpg", alt: "IIT Ropar 3" },

];

const Register = () => {
  const [error, setError] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();

  // Automatically swipe images every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      handleSwipe("left");
    }, 8000);

    return () => clearInterval(interval); // Clean up interval on component unmount
  }, []);

  // Handle swipe gestures
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleSwipe("left"),
    onSwipedRight: () => handleSwipe("right"),
  });

  const handleSwipe = (direction) => {
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

      if (!user.emailVerified) {
        setError("Please verify your email before logging in.");
        return;
      }

      router.push("/scanQR");
    } catch (err) {
      console.error("Sign-in error:", err);
      setError(err.message || "An unexpected error occurred. Please try again.");
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
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`, // Slide effect
            width: `${iitRoparImages.length * 100}%`, // Ensure all images fit in the slider
          }}
        >
          {iitRoparImages.map((image) => (
            <div
              key={image.id}
              className="w-full h-screen flex-shrink-0"
              style={{ flexBasis: "100%" }}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Page Title */}
      <img src="logo.png" className="absolute w-20 h-20 top-5 opacity-65" alt="" />
      <h1
  className="absolute top-32 text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 animate-wavy z-10"
>
  Public Entry Device
</h1>


<style jsx>{`
  @keyframes waveFlow {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
  .animate-flowing-wave {
    background-size: 200% 200%;
    animation: waveFlow 3s linear infinite;
    transform: translateX(-100%);
  }
  .animate-flowing-wave {
    animation: waveFlow 3s linear infinite;
  }
`}</style>

  
      <div className="bg-white bg-opacity-20 p-2 rounded-3xl shadow-md w-[90%] max-w-sm sm:max-w-md lg:max-w-lg z-10 ">

        {error && (
          <p className="text-red-600 text-center font-semibold mt-4">{error}</p>
        )}

<button
  onClick={handleGoogleSignIn}
  className="relative w-full py-3 text-white font-semibold text-lg rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 ease-in-out  flex items-center justify-center gap-3 bg-gray-900"
>
  <div className="absolute inset-0 pointer-events-none"></div>
  <img src="google.png" alt="Google Logo" className="h-7 w-7 z-10" />

  <span className="z-10">Sign Up with Google</span>
</button>



      </div>
    </div>
  );
};

export default Register;
