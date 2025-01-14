'use client';
import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { database } from '@/lib/firebaseClient';
import { onValue, ref, set } from 'firebase/database';

const Home = () => {
  const [scanData, setScanData] = useState(null);
  const [qrCode, setQrCode] = useState('');
  const [uniqueId, setUniqueId] = useState(null);

  const generateUniqueId = () => {
    return crypto.randomUUID();
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

    // Real-time listener for changes to the `scanned` status of the generated QR code
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
    await set(qrRef, qrData); // Store the `qrData` object directly in Firebase
    setScanData(qrData); // Update state with the same data
    console.log("Data stored successfully:", qrData);
  } catch (error) {
    console.error('Error storing QR data in Firebase:', error);
  }
  };

  return (
    <div className="text-center p-5 bg-white shadow-lg rounded-lg w-full max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-3">QR Code Generator</h1>
      <p className="text-gray-600 mb-5">Select an entry type to generate a QR code:</p>

      <div className="mb-5">
        <button
          onClick={() => handleScan('home')}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-5 rounded mx-2"
        >
          Home Entry
        </button>
        <button
          onClick={() => handleScan('regular')}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-5 rounded mx-2"
        >
          Regular Entry
        </button>
        <button
          onClick={() => handleScan('guest')}
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
