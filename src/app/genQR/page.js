"use client";
import { useState, useEffect } from "react";
import QRCode from "qrcode";
import { database, db } from "../../lib/firebaseClient";
import { onValue, ref, set } from "firebase/database";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { auth, onAuthStateChanged } from "../../lib/firebaseClient.js";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import "../styles/globals.css";

const Home = () => {
  const [scanData, setScanData] = useState(null);
  const [qrCode, setQrCode] = useState("");
  const [uniqueId, setUniqueId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  const router = useRouter();
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsLoggedIn(false);
      router.push("/admin");
    } catch (error) {
      console.error("Error during sign out:", error);
    }
  };

  const [entries, setEntries] = useState([]);

  const generateUniqueId = () => {
    return crypto.randomUUID();
  };

  const handleGetApp = () => {
    setShowQrModal(true);
  };

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAdminLoggedIn");

    if (!isAuthenticated) {
      router.push("/admin"); // Redirect to admin login if not authenticated
    }
  }, []);

  useEffect(() => {
    const generateQrCode = async () => {
      if (!scanData) return;

      try {
        const qr = await QRCode.toDataURL(JSON.stringify(scanData));
        setQrCode(qr);
      } catch (error) {
        console.error("Error generating QR Code", error);
      }
    };

    generateQrCode();
  }, [scanData]);

  useEffect(() => {
    if (!uniqueId) return;

    const qrRef = ref(database, `qrData/${uniqueId}`);

    // Listener for changes in QR data
    const unsubscribe = onValue(qrRef, (snapshot) => {
      const data = snapshot.val();

      if (!data) {
        console.log("QR Code has been removed from Firebase!");
        window.location.reload(); // Reload the page when QR is removed
      }
    });

    return () => unsubscribe(); // Cleanup listener
  }, [uniqueId]);

  const handleScan = async (entryType) => {
    setQrCode("");
    
    if (entryType === "guest") {
      setQrCode("/guest-qr.png"); // Static QR for guest
      return;
    }

    const newUniqueId = generateUniqueId();
    setUniqueId(newUniqueId);

    const qrData = {
      id: newUniqueId,
      type: entryType,
      timestamp: Date.now(),
      scanned: false,
    };

    try {
      const qrRef = ref(database, `qrData/${newUniqueId}`);
      await set(qrRef, qrData);
      setScanData(qrData);
      console.log("Data stored successfully:", qrData);
    } catch (error) {
      console.error("Error storing QR data in Firebase:", error);
    }
  };

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const entriesRef = collection(db, "entries");
        const q = query(entriesRef, orderBy("time_out", "desc"), limit(10));
        const querySnapshot = await getDocs(q);

        const fetchedEntries = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.user.name,
            entryNumber: data.user.entry_number,
            type: data.type,
            timeIn: data.time_in
              ? new Date(data.time_in).toLocaleString("en-IN", {
                  timeZone: "Asia/Kolkata",
                })
              : "-",
            timeOut: data.time_out
              ? new Date(data.time_out).toLocaleString("en-IN", {
                  timeZone: "Asia/Kolkata",
                })
              : "N/A",
          };
        });

        setEntries(fetchedEntries);
      } catch (error) {
        console.error("Error fetching entries:", error);
      }
    };

    fetchEntries();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Navbar */}
      <div className="fixed top-5 right-20 p-4 flex flex-row items-center gap-4">
        <button
          className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-md text-lg font-semibold hover:bg-yellow-600 transition-colors"
          onClick={handleLogout}
        >
          Log Out
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md text-lg font-semibold hover:bg-blue-600 transition-colors"
          onClick={handleGetApp}
        >
          Get App
        </button>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-md p-6 mt-10">
        <h1 className="text-5xl font-bold text-gray-800 mb-4 text-center">
          Generating QR Code
        </h1>
        <p className="text-gray-700 text-xl mb-6 text-center">
          Select an entry type to generate a QR code:
        </p>

        <div className="flex flex-row items-center justify-evenly">
          <div className="flex flex-col items-center space-y-8 mb-8 w-full max-w-sm">
            <button
              onClick={() => handleScan("home")}
              className="bg-blue-500 hover:bg-blue-600 h-[70px] text-white font-medium py-3 px-8 rounded-lg w-full max-w-md transition-transform transform hover:scale-105"
            >
              Home Entry
            </button>
            <button
              onClick={() => handleScan("regular")}
              className="bg-green-500 hover:bg-green-600 h-[70px] text-white font-medium py-3 px-8 rounded-lg w-full max-w-md transition-transform transform hover:scale-105"
            >
              Regular Entry
            </button>
            <button
              onClick={() => handleScan("guest")}
              className="bg-purple-500 hover:bg-purple-600 h-[70px] text-white font-medium py-3 px-8 rounded-lg w-full max-w-md transition-transform transform hover:scale-105"
            >
              Guest Entry
            </button>
          </div>

          {qrCode ? (
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Generated QR Code:
              </h3>
              <img
                src={qrCode}
                alt="Generated QR Code"
                className="w-60 h-60 mx-auto border border-gray-300 rounded"
              />
            </div>
          ) : (
            <p className="text-gray-500 text-center ml-40">
              No QR Code generated yet. Select an entry type.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
