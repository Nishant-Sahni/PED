"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation"; // For routing
import "../styles/globals.css";
import { auth, onAuthStateChanged } from "../../lib/firebaseClient.js"; // Import Firebase Auth instance

const ButtonSlider = ({ images, transitionDuration = 500 }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter(); // Initialize Next.js router

  // Check authentication status
  useEffect(()=>{
    const user = auth.currentUser;
    if (user){
      setIsLoggedIn(true);
    }else{
      setIsLoggedIn(false);
      router.push("/admin");
    }
  },[router]);

  // Image slider logic
  useEffect(() => {
    const intervalId = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Automatically cycle images every 3 seconds

    return () => clearInterval(intervalId);
  }, [images.length]);

  // Button routing handler
  const handleRoute = (path) => {
    router.push(path); // Navigate to the specified path
  };

  // Prevent rendering if not logged in
  if (!isLoggedIn) {
    return null; // Optionally, show a loading spinner here
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Background Images */}
      <div
        className="absolute inset-0 flex transition-transform"
        style={{
          transform: `translateX(-${activeIndex * 100}%)`,
          transition: `transform ${transitionDuration}ms ease-in-out`,
        }}
      >
        {images.map((image, index) => (
          <div key={index} className="relative flex-shrink-0 w-full h-full">
            <Image
              src={image}
              alt={`Image ${index + 1}`}
              fill
              style={{ objectFit: "cover" }}
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      {/* Routing Buttons */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 flex space-x-4">
        <button
          className="p-4 bg-blue-500 text-white rounded-lg shadow-md text-lg font-semibold hover:bg-blue-600 transition-colors"
          onClick={() => handleRoute("/genQR")}
        >
          genQR
        </button>
        <button
          className="p-4 bg-yellow-500 text-white rounded-lg shadow-md text-lg font-semibold hover:bg-yellow-600 transition-colors"
          onClick={() => handleRoute("/Data_charts")}
        >
          Data Charts
        </button>
      </div>
    </div>
  );
};

export default ButtonSlider;
