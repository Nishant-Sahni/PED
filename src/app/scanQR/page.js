// pages/index.js
'use client';
import './background.css';
import { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner"; // Import qr-scanner
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQrcode } from "@fortawesome/free-solid-svg-icons";
import SuccessScan from "@/components/SuccessScan";
import { getCurrentUser } from './firebasefetch.js';
import { ref, get, update } from "firebase/database";
import { database, auth } from '@/lib/firebaseClient'; // Import Firebase auth
import { useRouter } from 'next/navigation'; // Import useRouter from Next.js
import { signOut } from "firebase/auth"; // Import signOut from Firebase Auth

export default function Home() {
  const videoRef = useRef(null); // Reference to the video element
  const [scanData, setScanData] = useState(null); // State for storing scan results
  const [isScannerActive, setScannerActive] = useState(false); // Toggle scanner
  const [closebutton, setclosebutton] = useState(true); // For not showing anything if we click CloseQR
  const [curruser, setcurruser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track if the user is logged in
  const router = useRouter();
  // Check if the user is logged in
  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out the user
      setIsLoggedIn(false); // Update state to reflect logged-out status
      router.push("/Register"); // Navigate to the Register page
    } catch (error) {
      console.error("Error during sign out:", error);
    }
  };
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setIsLoggedIn(true);
      setcurruser(user); // Set the current user data
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const postScanData = async (data) => {
    try {
      const response = await fetch("http://localhost:3000/api/route", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Set content type
        },
        body: JSON.stringify(data), // Convert data to JSON string
      });

      if (!response.ok) {
        console.log(response);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json(); // Parse JSON response if needed
      console.log("Data posted successfully:", responseData);
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  const handleScanResult = async (scanData) => {
    try {
      // Reference to the scanned data in the database
      const dbRef = ref(database, `qrData/${scanData.id}`);
      
      // Fetch the current data from Firebase
      const snapshot = await get(dbRef);
      if (snapshot.exists()) {
        const dbData = snapshot.val(); // Get the data object
        if (!dbData.scanned) {
          // If `scanned` is false, update it to true
          await update(dbRef, { scanned: true });
          console.log("Scanned field updated to true in Firebase:", scanData.id);
        } else {
          console.log("This QR code has already been scanned:", scanData.id);
        }
      } else {
        console.error("No data found in Firebase for this ID:", scanData.id);
      }
    } catch (error) { 
      console.error("Error checking or updating scan data in Firebase:", error);
    }
  };

  useEffect(() => {
    let qrScanner;
    console.log("Initializing scanner...");

    if (isScannerActive && videoRef.current) {
      console.log("Scanner is active. Initializing QrScanner...");

      qrScanner = new QrScanner(
        videoRef.current,
        async (result) => {
          try {
            console.log("QR code scanned. Result data:", result.data); // Debug: Log raw scan data
            const jsonContent = JSON.parse(result.data); // Parse JSON content
            setScanData(jsonContent);
            setclosebutton(false);
            setScannerActive(false); // Stop scanning after successful scan
            qrScanner.stop(); // Stop the scanner

            const info = {
              uid: jsonContent.id,
              type: jsonContent.type,
              timestamp: jsonContent.timestamp,
              user: {
                uniqueid: curruser?.uid,
                name: curruser?.displayName,
                email: curruser?.email || "N/A",
              },
            };

            console.log("Scanned QR Code JSON Content:", jsonContent); // Debug: Parsed JSON
            console.log("Info to send to backend:", info); // Debug: Info object
            
            await handleScanResult(jsonContent);
            await postScanData(info);
          } catch (error) {
            console.log("Error processing scan result:", error); // Debug: Catch errors
            alert("Invalid JSON content in QR code!");
          }
        },
        {
          highlightScanRegion: true, // Optional: Highlight the scan area
        }
      );

      qrScanner.start(); // Start scanning
    }

    return () => {
      if (qrScanner) qrScanner.stop(); // Cleanup on unmount
    };
  }, [isScannerActive]);

  // Debug `curruser` state whenever it changes
  useEffect(() => {
    console.log("Current user state updated:", curruser); // Debug: Log whenever curruser changes
  }, [curruser]);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "20px",
        gap: "20px", 
        position: "relative", // Position relative for absolute positioning inside
      }}
    >
      <div className="custom-background">
        <div className="light x1"></div>
        <div className="light x2"></div>
        <div className="light x3"></div>
        <div className="light x4"></div>
        <div className="light x5"></div>
        <div className="light x6"></div>
        <div className="light x7"></div>
        <div className="light x8"></div>
        <div className="light x9"></div>
      </div>

      {/* Display login prompt if not logged in */}
      {!isLoggedIn && (
        <div style={{ position: 'absolute', top: '50%', zIndex: 2, color: 'white', fontSize: '20px' }}>
          <p>Please login first to access QR scanner</p>
        </div>
      )}

      {isLoggedIn && (
        <>
          {isScannerActive && (
            <div
              style={{
                width: "300px",
                height: "300px", // Absolutely position the scanner
                top: "20px", // Adjust this to control the vertical position
              }}
            >
              <video
                ref={videoRef}
                style={{
                  width: "100%",
                  height: "100%",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                }}
              />
            </div>
          )}
          {isLoggedIn && (
        <button
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            padding: "10px 20px",
            background: "#d9534f",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          onClick={handleLogout}
        >
          Logout
        </button>
      )}

          <button
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px", // Space between icon and text
              padding: "10px 20px",
              cursor: "pointer",
              background: "#06aa3d",
              color: "#fff",
              border: "none",
              borderRadius: "100px",
              top: "60%",
              zIndex: 1, // Ensure button stays on top of the scanner
            }}
            onClick={() => {
              setScannerActive((prev) => !prev);
              setclosebutton(true);
            }}
          >
            <FontAwesomeIcon icon={faQrcode} style={{ fontSize: "20px", marginRight: "5px" }} />
            {isScannerActive ? "Close Scanner" : "Scan QR Code"}
          </button>

          {scanData && !isScannerActive && !closebutton && (
            <SuccessScan visible={true}></SuccessScan>
          )}

          {scanData && !isScannerActive && !closebutton && (
            <div
              style={{
                height: "10vh",
                marginTop: "100px",
                textAlign: "left",
                width: "100%",
                position: "relative",
                padding: "15px 0px 0px 0px",
              }}
            >
              <button
                style={{
                  position: "absolute",
                  top: "45px",
                  right: "10px",
                  background: "transparent",
                  border: "none",
                  color: "#fff",
                  fontSize: "18px",
                  cursor: "pointer",
                  zIndex: 1,
                }}
                onClick={() => setScanData(null)}
              >
                ✕
              </button>
              <pre
                style={{
                  position: "relative",
                  top: "30px",
                  background: "#000000",
                  padding: "10px",
                  borderRadius: "5px",
                  overflowX: "auto",
                  color: "#fff",
                }}
              >
                <p><strong>{'\n'}Entry Type:</strong> {scanData.type || "N/A"}</p>
                <p><strong>Timestamp:</strong> {scanData.timestamp || "N/A"}</p>
              </pre>
            </div>
          )}
        </>
      )}
    </div>
  );
}
