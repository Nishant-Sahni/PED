// pages/index.js
'use client';
import './background.css';
import { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner"; // Import qr-scanner
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQrcode } from "@fortawesome/free-solid-svg-icons";
import SuccessScan from "@/components/SuccessScan";
import { getCurrentUser } from './firebasefetch.js';

export default function Home() {
  const [info,setinfo]=useState(null);  
  const videoRef = useRef(null); // Reference to the video element
  const [scanData, setScanData] = useState(null); // State for storing scan results
  const [isScannerActive, setScannerActive] = useState(false); // Toggle scanner
  const [closebutton, setclosebutton] = useState(true); // For not showing anything if we click CloseQR
  const [curruser,setcurruser]=useState(null);

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
  useEffect(() => {
    let qrScanner;
    getCurrentUser((userData)=>{setcurruser(userData);})
    if (isScannerActive && videoRef.current) {
      qrScanner = new QrScanner(
        videoRef.current,
        async (result) => {
          try {
            const jsonContent = JSON.parse(result.data); // Parse JSON content
            setScanData(jsonContent);
            setclosebutton(false);
            setScannerActive(false); // Stop scanning after successful scan
            qrScanner.stop(); // Stop the scanner
            console.log("HI");
            setinfo({
              type:jsonContent.type,
              timestamp:jsonContent.timestamp,
              user:{
                name:"Nishant",
                entry_number:"2023CSB1140",
                email:"email",
                // name:curruser?.displayName,
                // entry_number:curruser?.uid,
                //email:

              }
            });
            console.log(info);
            await postScanData(info);
          } catch (error) {
            console.log(error)
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
          //set position of this button to be middle of page
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
        
        <div        //Display data div
          style={{
            height: "10vh",
            marginTop: "100px",
            textAlign: "left",
            width: "100%",
            position: "relative",
            padding:"15px 0px 0px 0px",
          }}
        >
          <button
            style={{
              position: "absolute",
              top:"45px",
              right:"10px",
              background: "transparent",
              border: "none",
              color: "#fff",
              fontSize: "18px",
              cursor: "pointer",
              zIndex: 1, // Ensure button stays on top of the scanner
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
            {/* {JSON.stringify(info, null, 2)} */}
            <p><strong>{'\n'}Entry Type:</strong> {scanData.type || "N/A"}</p>
            <p><strong>Timestamp:</strong> {scanData.timestamp || "N/A"}</p>
          </pre>
        </div>
      )}
    </div>
  );
}
