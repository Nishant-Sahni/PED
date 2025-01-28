'use client';
import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { database } from '@/lib/firebaseClient';
import { onValue, ref, set } from 'firebase/database';
import { auth, onAuthStateChanged } from "../../lib/firebaseClient.js";
import { useRouter } from "next/navigation";
import "../styles/globals.css";
const Home = () => {
  const [scanData, setScanData] = useState(null);
  const [qrCode, setQrCode] = useState('');
  const [uniqueId, setUniqueId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  const generateUniqueId = () => {
    return crypto.randomUUID();
  };

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
      router.push("/admin");
    }
  }, [router]);
  const handleRoute = (path) => {
    router.push(path); // Navigate to the specified path
  };
  useEffect(() => {
    const generateQrCode = async () => {
      if (!scanData) return;

      try {
        const qr = await QRCode.toDataURL(JSON.stringify(scanData));
        setQrCode(qr);
      } catch (error) {
        console.error('Error generating QR Code', error);
      }
    };

    generateQrCode();
  }, [scanData]);

  useEffect(() => {
    if (!uniqueId) return;

    // Real-time listener for changes to the scanned status of the generated QR code
    const qrRef = ref(database, `qrData/${uniqueId}`);
    const unsubscribe = onValue(qrRef, (snapshot) => {
      const data = snapshot.val();
      if (data?.scanned) {
        console.log('QR Code has been scanned!');
        window.location.reload(); // Reload the screen
      }
    });

    // Cleanup the listener when the component unmounts or uniqueId changes
    return () => unsubscribe();
  }, [uniqueId]);

  const handleScan = async (entryType) => {
    setQrCode('');
    const newUniqueId = generateUniqueId();
    setUniqueId(newUniqueId);

    const qrData = entryType === 'guest'
      ? {
          id: newUniqueId,
          type: 'guest',
          url: 'https://docs.google.com/forms/d/1SVz3gUQgKtLzxp7bcmiHRA3t9YXUQy-_8gZ2P0MSQaY',
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
      console.error('Error storing QR data in Firebase:', error);
    }
  };

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

        <div className="flex flex-col items-start space-y-4 mb-6">
          <button
            onClick={() => handleScan('home')}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-8 rounded-lg w-full transition-transform transform hover:scale-105"
          >
            Home Entry
          </button>
          <button
            onClick={() => handleScan('regular')}
            className="bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-8 rounded-lg w-full transition-transform transform hover:scale-105"
          >
            Regular Entry
          </button>
          <button
            onClick={() => handleScan('guest')}
            className="bg-purple-500 hover:bg-purple-600 text-white font-medium py-3 px-8 rounded-lg w-full transition-transform transform hover:scale-105"
          >
            Guest Entry
          </button>
        </div>

        {qrCode ? (
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 text-center mx-auto">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Generated QR Code:</h3>
            <img
              src={qrCode}
              alt="Generated QR Code"
              className="w-60 h-60 mx-auto border border-gray-300 rounded"
            />
          </div>
        ) : (
          <p className="text-gray-500 text-center">No QR Code generated yet. Select an entry type.</p>
        )}
      </div>
    </div>
  );
};

export default Home;