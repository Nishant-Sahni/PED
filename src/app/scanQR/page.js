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
import { onAuthStateChanged } from 'firebase/auth';

export default function Home() {
  const videoRef = useRef(null);
  const [scanData, setScanData] = useState(null);
  const [isScannerActive, setScannerActive] = useState(false);
  const [closebutton, setclosebutton] = useState(true);
  const [curruser, setcurruser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const router = useRouter();
  const [dateshow, setdateshow] = useState(null);
  const [showScanResult, setShowScanResult] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out the user
      setIsLoggedIn(false); // Update state to reflect logged-out status
      router.push("/"); // Navigate to the Register page
    } catch (error) {
      console.error("Error during sign out:", error);
    }
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth,(user)=>{
      if (user) {
        setIsLoggedIn(true);
        setcurruser(user);
      } else {
        setIsLoggedIn(false);
        router.push("/");
      }
    });
    return ()=> unsubscribe();
  }, []);


  const postScanData = async (data) => {
    console.log("Posting data:", data);
    try {
      const response = await fetch(`${window.location.origin}/api/route`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log("Data posted successfully:", await response.json());
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  const handleScanResult = async (jsonContent) => {
    try {
      const dbRef = ref(database, `qrData/${jsonContent.id}`);
      const snapshot = await get(dbRef);

      if (snapshot.exists()) {
        const dbData = snapshot.val();

        if (!dbData.scanned) {
          await update(dbRef, { scanned: true });
          await remove(dbRef);
          console.log("QR marked as scanned:", jsonContent.id);
        } else {
          console.log("QR already scanned:", jsonContent.id);
        }

        return true; // QR exists and is valid
      } else {
        console.error("Invalid QR Code:", jsonContent.id);
        setErrorMessage("INVALID QR");
        return false; // QR does not exist
      }
    } catch (error) {
      console.error("Error processing QR code:", error);
      setErrorMessage("INVALID QR");
      return false;
    }
  };
  useEffect(() => {
      if (scanData && !isScannerActive && !closebutton) {
        const timer = setTimeout(() => {
          setFadeOut(true); // Start fade-out after 5 seconds
          setTimeout(() => {
            setShowScanResult(false); // Remove element after fade-out is complete
          }, 1000); // Allow fade-out to complete before hiding element
        }, 50000);

        // Cleanup timeout if the component unmounts or if scanData changes
        return () => clearTimeout(timer);
      }
    }, [scanData, isScannerActive, closebutton]); // Dependency array ensures it runs when scanData changes
  useEffect(() => {
    let qrScanner;

    if (isScannerActive && videoRef.current) {
      console.log("Starting QR scanner...");
      qrScanner = new QrScanner(
        videoRef.current,
        async (result) => {
          try {
            console.log("QR scanned:", result.data);
            const jsonContent = JSON.parse(result.data);
            setScanData(jsonContent);
            setclosebutton(false);
            setScannerActive(false);
            qrScanner.stop();

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

            const isValidQR = await handleScanResult(jsonContent);
            if (isValidQR) {
              await postScanData(info);
            }
          } catch (error) {
            console.error("Invalid QR content:", error);
            setErrorMessage("INVALID QR");
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
      <div className="custom-background"></div>
      {/* Display login prompt if not logged in */}
      {!isLoggedIn && (
        <div style={{ position: 'absolute', top: '50%', zIndex: 2, color: 'white', fontSize: '20px' }}>
          <p>Please login first to access QR scanner</p>
        </div>
      )}
      

      {isLoggedIn && (
        <>
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
            <FontAwesomeIcon icon={faQrcode} style={{ fontSize: "20px", marginRight: "5px" }} />
            {isScannerActive ? "Close Scanner" : "Scan QR Code"}
          </button>

          {errorMessage && (
            <div style={{ color: "red", marginTop: "20px", fontSize: "20px", fontWeight: "bold" }}>
              {errorMessage}
            </div>
          )}

          {scanData && !isScannerActive && !closebutton && !errorMessage && (
            <SuccessScan visible={true}>Fucked</SuccessScan>
          )}

          {scanData && !isScannerActive && !closebutton && showScanResult && !errorMessage && (
            <div
              style={{
                height: "10vh",
                marginTop: "100px",
                textAlign: "left",
                width: "100%",
                position: "relative",
                padding: "15px 0px 0px 0px",
                opacity: fadeOut ? 0 : 1,
                transition: "opacity 1s ease-out",
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
                <p><strong>Name:</strong> {curruser?.displayName || "N/A"}</p>
                <p><strong>Entry Type:</strong> {scanData.type || "N/A"}</p>
                <p><strong>Timestamp:</strong> {dateshow || "N/A"}</p>
              </pre>
            </div>
          )}
        </>
      )}
    </div>
  );
}
