// components/SuccessScan.js
'use client';

import { useState, useEffect } from "react";

export default function SuccessScan({ visible, message = "Scan Successful!" }) {
  const [show, setShow] = useState(visible);

  useEffect(() => {
    if (visible) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
      }, 40000); // Hide after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [visible]);

  return (
    <div
      style={{
        position: "fixed",
        top: "55%",
        left: "50%",
        height: "60px",
        transform: "translate(-50%, -50%)",
        padding: "20px 40px 20px 66px",
        background: "#4caf50", // Green background for success
        color: "#fff",
        borderRadius: "50px",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
        opacity: show ? 1 : 0,
        transition: "opacity 0.5s ease-in-out, transform 0.5s ease-in-out",
        transform: show ? "translate(-50%, -50%)" : "translate(-50%, -60%)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* <div
        style={{
        position:"relative",
        top:"-7px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      > */}
        <div
          style={{
            width: "26px",
            height: "26px",
            border: "2px solid #fff",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            top: "50%",
            left: "20px",
            transform: "translateY(-50%)",
          }}
        >
          <div
            style={{
              width: "12px",
              height: "12px",
              backgroundColor: "#fff",
              borderRadius: "50%",
              alignItems: "center",
              justifyContent: "center",
              animation: "pulse 1s infinite",
            }}
          />
        </div>
    <span style={{fontSize: "16px", fontWeight: "bold" ,top:"50%"}}>{message}</span>
      {/* </div> */}

      <style jsx>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.5);
            opacity: 0.5;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
