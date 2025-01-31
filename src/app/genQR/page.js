"use client";
import { useState, useEffect } from "react";
import QRCode from "qrcode";
import { database, db } from "../../lib/firebaseClient";
import { onValue, ref, set } from "firebase/database";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { auth, onAuthStateChanged } from "../../lib/firebaseClient.js";
import { useRouter } from "next/navigation";
import "../styles/globals.css";
const Home = () => {
  const [scanData, setScanData] = useState(null);
  const [qrCode, setQrCode] = useState("");
  const [uniqueId, setUniqueId] = useState(null);
  
  const router = useRouter();
const handleRoute = (path) =>{
  router.push("/admin");
}  
const [entries, setEntries] = useState([]);

  const generateUniqueId = () => {
    return crypto.randomUUID();
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
    const newUniqueId = generateUniqueId();
    setUniqueId(newUniqueId);

    const qrData =
      entryType === "guest"
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
            timestamp: Date.now(),
            scanned: false,
          };

    try {
      const qrRef = ref(database, `qrData/${newUniqueId}`); // Reference for Firebase
      await set(qrRef, qrData); // Store the qrData object directly in Firebase
      setScanData(qrData); // Update state with the same data
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
  <button
    className="fixed top-5 right-5 p-4 bg-yellow-500 text-white rounded-lg shadow-md text-lg font-semibold hover:bg-yellow-600 transition-colors"
    onClick={() => handleRoute("/Data_charts")}
  >
    Data Charts
  </button>
  <div className="bg-white rounded-lg shadow-md p-6 mt-10">
    <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">
      Generating QR Code
    </h1>
    <p className="text-gray-700 mb-6 text-center">
      Select an entry type to generate a QR code:
    </p>

    <div className="flex flex-col items-center space-y-4 mb-6">
      <button
        onClick={() => handleScan("home")}
        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-8 rounded-lg w-full max-w-md transition-transform transform hover:scale-105"
      >
        Home Entry
      </button>
      <button
        onClick={() => handleScan("regular")}
        className="bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-8 rounded-lg w-full max-w-md transition-transform transform hover:scale-105"
      >
        Regular Entry
      </button>
      <button
        onClick={() => handleScan("guest")}
        className="bg-purple-500 hover:bg-purple-600 text-white font-medium py-3 px-8 rounded-lg w-full max-w-md transition-transform transform hover:scale-105"
      >
        Guest Entry
      </button>
    </div>

    {qrCode ? (
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 text-center mx-auto mt-6">
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
      <p className="text-gray-500 text-center">
        No QR Code generated yet. Select an entry type.
      </p>
    )}
  </div>

  <h2 className="text-2xl font-bold text-gray-800 text-center mt-6">
    Recent Entries
  </h2>
  <div className="w-full max-w-4xl mx-auto overflow-y-auto h-80 border border-gray-300 rounded-lg shadow-lg mt-6">
    <table className="table-auto w-full border-collapse">
      <thead>
        <tr className="bg-gray-100">
          <th className="border border-gray-300 px-4 py-2">Name</th>
          <th className="border border-gray-300 px-4 py-2">Entry Number</th>
          <th className="border border-gray-300 px-4 py-2">Type</th>
          <th className="border border-gray-300 px-4 py-2">Time Out</th>
          <th className="border border-gray-300 px-4 py-2">Time In</th>
        </tr>
      </thead>
      <tbody>
        {entries.map((entry) => (
          <tr key={entry.id} className="text-center">
            <td className="border border-gray-300 px-4 py-2">{entry.name}</td>
            <td className="border border-gray-300 px-4 py-2">
              {entry.entryNumber}
            </td>
            <td className="border border-gray-300 px-4 py-2">{entry.type}</td>
            <td className="border border-gray-300 px-4 py-2">{entry.timeOut}</td>
            <td className="border border-gray-300 px-4 py-2">{entry.timeIn}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

  );
};

export default Home;
