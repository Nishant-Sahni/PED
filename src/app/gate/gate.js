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
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAdminLoggedIn");

    if (!isAuthenticated) {
      router.push("/admin"); // Redirect to admin login if not authenticated
    }
  }, []);

  // Image slider logic
  useEffect(() => {
    const intervalId = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Automatically cycle images every 3 seconds

    return () => clearInterval(intervalId);
  }, [images.length]);

  // Button routing handler
  const handleRoute = (path) => {
    router.push(path); // Navigate to the specified path
  };

  // Prevent rendering if not logged in

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Background Images */}

      <div className="relative flex-shrink-0 w-full h-full">
        <Image
          src={"/iit-ropar-5.avif"}
          alt="img-2"
          fill
          style={{ objectFit: "cover" }}
        />
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
