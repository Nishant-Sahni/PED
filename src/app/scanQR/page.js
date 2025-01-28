'use client';
import './background.css';
import { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQrcode } from "@fortawesome/free-solid-svg-icons";
import SuccessScan from "@/components/SuccessScan";
import { getCurrentUser } from './firebasefetch.js';
import { ref, get, update, remove } from "firebase/database";
import { database, auth } from '@/lib/firebaseClient';
import { useRouter } from 'next/navigation';
import { signOut } from "firebase/auth";

export default function Home() {
  const videoRef = useRef(null);
  const [scanData, setScanData] = useState(null);
  const [isScannerActive, setScannerActive] = useState(false);
  const [closebutton, setclosebutton] = useState(true);
  const [curruser, setcurruser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null); // State to show error messages
  const router = useRouter();

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
    }
  }, []);

  const postScanData = async (data) => {
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

      const responseData = await response.json();
      console.log("Data posted successfully:", responseData);
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  const handleScanResult = async (scanData) => {
    try {
      const dbRef = ref(database, `qrData/${scanData.id}`);
      const snapshot = await get(dbRef);
      if (snapshot.exists()) {
        const dbData = snapshot.val();
        if (!dbData.scanned) {
          await update(dbRef, { scanned: true });
          await remove(dbRef);
          console.log("Scanned field updated to true in Firebase:", scanData.id);

          const info = {
            uid: scanData.id,
            type: scanData.type,
            timestamp: scanData.timestamp,
            user: {
              entry_number: curruser?.email?.slice(0, 11),
              name: curruser?.displayName,
              email: curruser?.email || "N/A",
            },
          };

          await postScanData(info);
        } else {
          console.log("This QR code has already been scanned:", scanData.id);
          setErrorMessage("This QR code has already been scanned.");
        }
      } else {
        console.error("No data found in Firebase for this ID:", scanData.id);
        setErrorMessage("Invalid QR code.");
      }
    } catch (error) {
      console.error("Error checking or updating scan data in Firebase:", error);
      setErrorMessage("An error occurred while processing the QR code.");
    }
  };

  useEffect(() => {
    let qrScanner;
    if (isScannerActive && videoRef.current) {
      qrScanner = new QrScanner(
        videoRef.current,
        async (result) => {
          try {
            const jsonContent = JSON.parse(result.data);
            setScanData(jsonContent);
            setclosebutton(false);
            setScannerActive(false);
            qrScanner.stop();
            await handleScanResult(jsonContent);
          } catch (error) {
            console.log("Error processing scan result:", error);
            alert("Invalid JSON content in QR code!");
          }
        },
        {
          highlightScanRegion: true,
        }
      );
      qrScanner.start();
    }

    return () => {
      if (qrScanner) qrScanner.stop();
    };
  }, [isScannerActive]);

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
                height: "300px",
                top: "20px",
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
            <div style={{ color: "red", marginTop: "20px" }}>{errorMessage}</div>
          )}

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