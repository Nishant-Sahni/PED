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
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-left p-5 shadow-lg rounded-lg w-full max-w-lg">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-4 text-center">Generating QR Code</h1>
        <p className="text-gray-700 mb-6 text-center">Select an entry type to generate a QR code:</p>
  
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
