import { ref, onValue, database } from '../../lib/firebaseClient';
import Home from "./page";


const monitorQRCode = () => {
  const qrRef = ref(database, "qr_codes/current");

  onValue(qrRef, async (snapshot) => {
    const data = snapshot.val();
    if (data && data.scanned) {
      console.log("QR code scanned. Generating a new one...");
      await Home(); // Generate a new QR code
    }
  });
};

export default monitorQRCode;
