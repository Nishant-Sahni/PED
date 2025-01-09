'use client';
import { useState, useEffect } from 'react';
import QRCode from 'qrcode';

const Home = () => {
  const [scanData, setScanData] = useState(null);
  const [qrCode, setQrCode] = useState('');

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

  const handleScan = (entryType) => {
    setQrCode('');
    const uniqueId = generateUniqueId();

    if (entryType === 'guest') {
      const url = 'https://docs.google.com/forms/d/1SVz3gUQgKtLzxp7bcmiHRA3t9YXUQy-_8gZ2P0MSQaY';
      setScanData({
        id : uniqueId,
        type: 'guest',
        url,
        timestamp: Date.now(),
      });
    } else {
      setScanData({
        id : uniqueId,
        type: entryType,
        timestamp: Date.now(),
      });
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
