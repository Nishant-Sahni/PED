"use client";
import "./background.css";
import { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQrcode } from "@fortawesome/free-solid-svg-icons";
import SuccessScan from "../../components/SuccessScan";
import { ref, get, remove, update } from "firebase/database";
import { database, auth } from "../../lib/firebaseClient";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";

export default function Home() {
  const videoRef = useRef(null);
  const [scanData, setScanData] = useState(null);
  const [isScannerActive, setScannerActive] = useState(false);
  const [closebutton, setclosebutton] = useState(true);
  const [curruser, setcurruser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const router = useRouter();
  const [dateshow,setdateshow] = useState(null);
  const [showScanResult, setShowScanResult] = useState(true); // State to control visibility
  const [fadeOut, setFadeOut] = useState(false);

  // Check if the user is logged in
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsLoggedIn(false);
      router.push("/");
    } catch (error) {
      console.error("Error during sign out:", error);
    }
  };

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setIsLoggedIn(true);
      setcurruser(user);
    } else {
      setIsLoggedIn(false);
      router.push("/");
    }
  }, []);

  const postScanData = async (data) => {
    console.log("The data is :", data)
    try {
      const response = await fetch(`${window.location.origin}/api/route`, {
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

      const snapshot = await get(dbRef);
      if (snapshot.exists()) {
        const dbData = snapshot.val(); // Get the data object
        if (!dbData.scanned) {
          await update(dbRef, { scanned: true });
          await remove(dbRef);
          console.log(
            "Scanned field updated to true in Firebase:",
            scanData.id
          );
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
    if (scanData && !isScannerActive && !closebutton) {
      const timer = setTimeout(() => {
        setFadeOut(true); // Start fade-out after 5 seconds
        setTimeout(() => {
          setShowScanResult(false); // Remove element after fade-out is complete
        }, 1000); // Allow fade-out to complete before hiding element
      }, 5000);

      // Cleanup timeout if the component unmounts or if scanData changes
      return () => clearTimeout(timer);
    }
  }, [scanData, isScannerActive, closebutton]); // Dependency array ensures it runs when scanData changes

  useEffect(() => {
    let qrScanner;

    if (isScannerActive && videoRef.current) {
      qrScanner = new QrScanner(
        videoRef.current,
        async (result) => {
          try {
            console.log("QR code scanned. Result data:", result.data);
            const jsonContent = JSON.parse(result.data);
            setScanData(jsonContent);
            setclosebutton(false);
            setScannerActive(false);
            qrScanner.stop();
            // Post data to the server directly here
            const info = {
              uid: jsonContent.id,
              type: jsonContent.type,
              timestamp: jsonContent.timestamp || Date.now(),
              user: {
                entry_number: String(curruser?.email?.slice(0, 11) || ""),
                name: String(curruser?.displayName || ""),
                email: String(curruser?.email || ""),
              },
            };
            const date = new Date(jsonContent.timestamp);
            setdateshow(date.toLocaleString());
            console.log("Scanned QR Code JSON Content:", jsonContent); // Debug: Parsed JSON
            console.log("Info to send to backend:", info); // Debug: Info object

            await handleScanResult(jsonContent); // Remove existing QR code data
            await postScanData(info); // Send data to the server
          } catch (error) {
            console.error("Error processing scan result:", error);
            alert("Invalid JSON content in QR code!");
          }
        },
        { highlightScanRegion: true }
      );

      qrScanner.start();
    }

    return () => {
      if (qrScanner) qrScanner.stop();
    };
  }, [isScannerActive, curruser?.displayName, curruser?.email]);

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
        position: "relative",
      }}
    >
      <div className="custom-background">{/* Background elements */}</div>

      <button
        style={{
          padding: "10px 20px",
          cursor: "pointer",
          background: "#d9534f",
          color: "#fff",
          border: "none",
          borderRadius: "100px",
          marginTop: "20px",
        }}
        onClick={handleLogout}
      >
        Logout
      </button>

      {isLoggedIn && (
        <>
          {isScannerActive && (
            <div style={{ width: "300px", height: "300px", top: "20px" }}>
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

          <button
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "10px 20px",
              cursor: "pointer",
              background: "#06aa3d",
              color: "#fff",
              border: "none",
              borderRadius: "100px",
              top: "60%",
              zIndex: 1,
            }}
            onClick={() => {
              setScannerActive((prev) => !prev);
              setclosebutton(true);
              setErrorMessage(null);
            }}
          >
            <FontAwesomeIcon
              icon={faQrcode}
              style={{ fontSize: "20px", marginRight: "5px" }}
            />
            {isScannerActive ? "Close Scanner" : "Scan QR Code"}
          </button>

          {errorMessage && (
            <div style={{ color: "red", marginTop: "20px" }}>
              {errorMessage}
            </div>
          )}

          {scanData && !isScannerActive && !closebutton && (
            <SuccessScan visible={true}></SuccessScan>
          )}

          {scanData && !isScannerActive && !closebutton && showScanResult && (
            <div
              style={{
                height: "10vh",
                marginTop: "100px",
                textAlign: "left",
                width: "100%",
                position: "relative",
                padding: "15px 0px 0px 0px",
                opacity: fadeOut ? 0 : 1, // Fade out based on state
                transition: "opacity 1s ease-out", // Smooth transition
              }}
            >
              
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
                  <button
                  style={{
                    position: "absolute",
                    top: "5px",
                    right: "5px",
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
                <p><strong>{'\n'}Name:</strong>{curruser?.displayName || "N/A"}</p>
                <p><strong>{'\n'}Entry Type:</strong> {scanData.type || "N/A"}</p>
                <p><strong>Timestamp:</strong> {dateshow || "N/A"}</p>
              </pre>
            </div>
          )}
        </>
      )}
    </div>
  );
}
