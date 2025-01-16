"use client";
import { useState, useEffect } from "react";
import QRCode from "qrcode";
import { database, auth } from "@/lib/firebaseClient";
import { ref, set, onValue } from "firebase/database";
import "../styles/globals.css";

const Home = () => {
  const [scanData, setScanData] = useState(null);
  const [qrCode, setQrCode] = useState("");
  const [uniqueId, setUniqueId] = useState(null);
  const [error, setError] = useState("");

  const generateUniqueId = () => crypto.randomUUID();

  useEffect(() => {
    const generateQrCode = async () => {
      if (!scanData) return;

      try {
        const qr = await QRCode.toDataURL(JSON.stringify(scanData));
        setQrCode(qr);
      } catch (err) {
        console.error("Error generating QR Code:", err);
        setError("Failed to generate QR code. Please try again.");
      }
    };

    generateQrCode();
  }, [scanData]);

  useEffect(() => {
    if (!uniqueId) return;

    const qrRef = ref(database, `qrData/${uniqueId}`);
    const unsubscribe = onValue(qrRef, (snapshot) => {
      const data = snapshot.val();
      if (data?.scanned) {
        console.log("QR Code has been scanned!");
        window.location.reload(); // Reload the screen
      }
    });

    return () => unsubscribe(); // Cleanup listener
  }, [uniqueId]);

  const handleScan = async (entryType) => {
    setQrCode("");
    setError("");

    const user = auth.currentUser;

    if (!user) {
      setError("User is not logged in.");
      return;
    }

    const newUniqueId = generateUniqueId();
    setUniqueId(newUniqueId);

    const qrData = entryType === "guest"
      ? {
          id: newUniqueId,
          type: "guest",
          url: "https://docs.google.com/forms/d/1SVz3gUQgKtLzxp7bcmiHRA3t9YXUQy-_8gZ2P0MSQaY",
          timestamp: Date.now(),
          scanned: false,
        }
      : {
          id: newUniqueId,
          type: entryType,
          email: user.email,
          name:user.displayName,
          uid: user.uid,
          timestamp: Date.now(),
          scanned: false,
        };

    try {
      const qrRef = ref(database, `qrData/${newUniqueId}`);
      await set(qrRef, qrData);
      setScanData(qrData);
      console.log("Data stored successfully:", qrData);
    } catch (err) {
      console.error("Error storing QR data in Firebase:", err);
      setError("Failed to store QR data. Please try again.");
    }
  };

  return (
    <div className="text-center p-5 bg-white shadow-lg rounded-lg w-full max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-3">QR Code Generator</h1>
      <p className="text-gray-600 mb-5">Select an entry type to generate a QR code:</p>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="mb-5">
        <button
          onClick={() => handleScan("home")}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-5 rounded mx-2"
        >
          Home Entry
        </button>
        <button
          onClick={() => handleScan("regular")}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-5 rounded mx-2"
        >
          Regular Entry
        </button>
        <button
          onClick={() => handleScan("guest")}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-5 rounded mx-2"
        >
          Guest Entry
        </button>
      </div>

      {qrCode ? (
        <div>
          <h3 className="text-lg font-semibold text-gray-700">Generated QR Code:</h3>
          <img
            src={qrCode}
            alt="Generated QR Code"
            className="mt-5 w-48 h-48 mx-auto border border-gray-300 rounded"
          />
        </div>
      ) : (
        <p className="text-gray-500">No QR Code generated yet. Select an entry type.</p>
      )}
    </div>
  );
};

export default Home;
